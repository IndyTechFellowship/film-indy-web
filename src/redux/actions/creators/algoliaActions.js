import * as firebase from 'firebase'
import algoliasearch from 'algoliasearch'
import { RESET_SEARCH_RESULTS, SEARCH_INDEX, SEARCH_FOR_CREW,
  SEARCH_FOR_CREW_ENRICHED, ENRICH_SEARCH_RESULT, PARTIAL_UPDATE_OBJECT, MIGRATE_PROFILE,
  MIGRATE_NAME, ADD_TO_NAME_INDEX, CREATE_PROFILE_RECORD, SET_PUBLIC, CREATE_VENDOR_PROFILE_RECORD,
  DELETE_VENDOR_PROFILE_RECORD, SEARCH_FOR_VENDORS, SEARCH_FOR_VENDORS_ENRICHED,
  SEARCH_FOR_LOCATIONS, SEARCH_FOR_LOCATIONS_ENRICHED,
  CREATE_LOCATION_PROFILE_RECORD, DELETE_LOCATION_PROFILE_RECORD, SEARCH_FOR_ROLES,
  ADD_ROLE_SEARCH_FILTER, REMOVE_ROLE_SEARCH_FILTER, DELETE_ROLE_FROM_PROFILE,
  SET_VENDOR_PUBLIC, ADD_EXPERIENCE_SEARCH_FILTER, SEARCH_FOR_LOCATION_TYPES, ADD_LOCATION_TYPE_SEARCH_FILTER, REMOVE_LOCATION_TYPE_SEARCH_FILTER
} from '../types/algoliaActionsTypes'
import { get } from 'lodash'
import moment from 'moment'

const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
const ALGOLA_ADMIN_KEY = process.env.REACT_APP_ALGOLIA_ADMIN_KEY

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLA_ADMIN_KEY, { protocol: 'https:' })

export const addRoleSearchFilter = role => ({
  type: ADD_ROLE_SEARCH_FILTER,
  payload: role
})

export const removeRoleSearchFilter = role => ({
  type: REMOVE_ROLE_SEARCH_FILTER,
  payload: role
})

export const addLocationTypeSearchFilter = type => ({
  type: ADD_LOCATION_TYPE_SEARCH_FILTER,
  payload: type
})

export const removeLocationTypeSearchFilter = type => ({
  type: REMOVE_LOCATION_TYPE_SEARCH_FILTER,
  payload: type
})

export const addExperienceSearchFilter = (min, max) => ({
  type: ADD_EXPERIENCE_SEARCH_FILTER,
  payload: { min, max }
})

export const searchIndex = (indexName, query, tableToEnrichFrom) => (dispatch) => {
  const index = algoliaClient.initIndex(indexName)
  return dispatch({
    type: SEARCH_INDEX,
    payload: index.search({ query })
  }).then((result) => {
    const hits = result.action.payload.hits
    const enriched = Promise.all(hits.map((hit) => {
      const objectID = hit.objectID
      return firebase.database().ref(`${tableToEnrichFrom}/${objectID}`).once('value').then((snapshot) => {
        const value = snapshot.val()
        return { objectID, value }
      })
    }))
    return dispatch({
      type: ENRICH_SEARCH_RESULT,
      payload: enriched
    })
  })
}

const createFilters = (filters) => {
  const roleFilters = filters.filter(filter => filter.type === 'role')
  const roles = roleFilters.reduce((acc, roleFilter) => {
    const role = roleFilter.role
    return acc === '' ? `roles:"${role}"` : `${acc} OR roles:"${role}"`
  }, '')
  return roles ? `(${roles}) AND public:true` : 'public:true'
}

const createLocationTypeFilters = (filters) => {
  const roleFilters = filters.filter(filter => filter.type === 'location')
  const types = roleFilters.reduce((acc, roleFilter) => {
    const type = roleFilter.locationType
    return acc === '' ? `types:"${type}"` : `${acc} OR types:"${type}"`
  }, '')
  return types ? `(${types}) AND public:true` : 'public:true'
}

const createExperienceFilterString = ({ min, max }) => {
  if (!min && !max) {
    return ''
  }
  const currentYear = moment().year()
  const minYear = currentYear - max
  const maxYear = currentYear - min
  return `experience: ${minYear} TO ${maxYear}`
}

export const searchForCrew = (query, filters, experienceFilter, offset = 0, length = 10) => (dispatch) => {
  const filtersString = createFilters(filters)
  const experienceFilterString = createExperienceFilterString(experienceFilter)
  const allFiltersString = experienceFilterString !== '' ? `${filtersString} AND ${experienceFilterString}` : filtersString
  const namesIndexFilters = experienceFilterString !== '' ? `public:true AND ${experienceFilterString}` : 'public:true'
  const searchObject = { offset, length }
  const indexNames = ['profiles', 'names']
  const searchPromises = indexNames.map((indexName) => {
    const index = algoliaClient.initIndex(indexName)
    if (indexName === 'profiles') {
      const enhancedSearchObject = filters.length === 0 ? { ...searchObject, query, filters: allFiltersString } : { ...searchObject, query: '', filters: allFiltersString }
      return index.search(enhancedSearchObject).then(results => ({ indexName, results }))
    } else if (indexName === 'names' && query && query !== ' ') {
      const enhancedSearchObject = filters.length === 0 ? { ...searchObject, query, filters: namesIndexFilters } : { ...searchObject, query, filters: namesIndexFilters }
      return index.search(enhancedSearchObject).then(results => ({ indexName, results }))
    }
    return Promise.resolve()
  })
  return dispatch({
    type: SEARCH_FOR_CREW,
    payload: {
      data: { offset, length },
      promise: Promise.all(searchPromises)
    }
  }).then((searchResults) => {
    const totalHits = searchResults.value.reduce((acc, results) => {
      const indexName = get(results, 'indexName')
      if (indexName) {
        return { ...acc, [indexName]: results.results.hits.length }
      }
      return acc
    }, {})
    const uniqueHits = searchResults.value.reduce((acc, result) => [...acc, ...get(result, 'results.hits', [])], [])
    const enrichPromises = Promise.all(uniqueHits.map(uniqueHit => firebase.database().ref(`userAccount/${uniqueHit.objectID}`)
      .once('value')
      .then(snapshot => firebase.database().ref(`/userProfiles/${uniqueHit.objectID}`)
        .once('value')
        .then(profileSnapshot => ({ objectID: uniqueHit.objectID, value: { ...snapshot.val(), ...profileSnapshot.val() } })))))
    return dispatch({
      type: SEARCH_FOR_CREW_ENRICHED,
      payload: {
        data: { totalHits },
        promise: enrichPromises
      }
    })
  })
}

export const searchForVendors = (query, offset = 0, length = 10) => (dispatch) => {
  const indexNames = ['vendors']
  const searchPromises = indexNames.map((indexName) => {
    const index = algoliaClient.initIndex(indexName)
    return index.search({ query, offset, length, filters: 'public:true' }).then(results => ({ indexName, results }))
  })
  return dispatch({
    type: SEARCH_FOR_VENDORS,
    payload: {
      data: { offset, length },
      promise: Promise.all(searchPromises)
    }
  }).then((searchResults) => {
    const totalHits = searchResults.value.reduce((acc, results) => {
      const indexName = results.indexName
      return { ...acc, [indexName]: results.results.hits.length }
    }, {})
    const uniqueHits = searchResults.value.reduce((acc, result) => [...acc, ...result.results.hits], [])
    const enrichPromises = Promise.all(uniqueHits.map(uniqueHit => firebase.database().ref(`vendorProfiles/${uniqueHit.objectID}`)
      .once('value')
      .then(snapshot => ({ objectID: uniqueHit.objectID, value: { ...snapshot.val() } }))))
    return dispatch({
      type: SEARCH_FOR_VENDORS_ENRICHED,
      payload: {
        data: { totalHits },
        promise: enrichPromises
      }
    })
  })
}

export const searchForLocations = (query, filters = [], offset = 0, length = 10) => (dispatch) => {
  const indexNames = ['locations']
  const locationTypeFilters = createLocationTypeFilters(filters)
  const searchPromises = indexNames.map((indexName) => {
    const index = algoliaClient.initIndex(indexName)
    return index.search({ query, offset, length, filters: locationTypeFilters }).then(results => ({ indexName, results }))
  })
  return dispatch({
    type: SEARCH_FOR_LOCATIONS,
    payload: {
      data: { offset, length },
      promise: Promise.all(searchPromises)
    }
  }).then((searchResults) => {
    const totalHits = searchResults.value.reduce((acc, results) => {
      const indexName = results.indexName
      return { ...acc, [indexName]: results.results.hits.length }
    }, {})
    const uniqueHits = searchResults.value.reduce((acc, result) => [...acc, ...result.results.hits], [])
    const enrichPromises = Promise.all(uniqueHits.map(uniqueHit => firebase.database().ref(`locationProfiles/${uniqueHit.objectID}`)
      .once('value')
      .then(snapshot => ({ objectID: uniqueHit.objectID, value: { ...snapshot.val() } }))))
    return dispatch({
      type: SEARCH_FOR_LOCATIONS_ENRICHED,
      payload: {
        data: { totalHits },
        promise: enrichPromises
      }
    })
  })
}

export const resetAndSearch = (show, query, filters = [], experienceFilter = { min: undefined, max: undefined }, locationTypeFilters = [], offset = 0, length = 10) => dispatch => dispatch({
  type: RESET_SEARCH_RESULTS,
  payload: {
    data: { offset, length, filters, locationTypeFilters },
    promise: Promise.resolve()
  }
})
  .then(() => {
    if (show === 'all') {
      dispatch(searchForCrew(query, filters, experienceFilter, offset, length))
      dispatch(searchForVendors(query, offset, length))
      dispatch(searchForLocations(query, locationTypeFilters, offset, length))
    } else if (show === 'crew') {
      dispatch(searchForCrew(query, filters, experienceFilter, offset, length))
    } else if (show === 'vendors') {
      dispatch(searchForVendors(query, offset, length))
    } else if (show === 'locations') {
      dispatch(searchForLocations(query, locationTypeFilters, offset, length))
    }
  })

export const migrateProfile = (uid, email) => (dispatch) => {
  const profileIndex = algoliaClient.initIndex('profiles')
  const updatePromise =
  profileIndex.getObject(email)
    .then(content => profileIndex.deleteObject(email)
      .then(() => profileIndex.addObject({
        ...content,
        objectID: uid
      })))
  return dispatch({
    type: MIGRATE_PROFILE,
    payload: updatePromise
  })
}

export const migrateName = (uid, email, namesObject) => (dispatch) => {
  const nameIndex = algoliaClient.initIndex('names')
  const updatePromise = nameIndex.getObject(email).then(content => nameIndex.deleteObject(email).then(() => nameIndex.addObject({
    ...content,
    ...namesObject,
    objectID: uid
  })))
  return dispatch({
    type: MIGRATE_NAME,
    payload: updatePromise
  })
}

export const addToNameIndex = (uid, namesObject) => {
  const namesIndex = algoliaClient.initIndex('names')
  const promise = namesIndex.getObject(uid)
    .then((val) => {
      namesIndex.partialUpdateObject({ ...namesObject, public: val.public, objectID: uid })
    })
    .catch(() => namesIndex.addObject({ ...namesObject, objectID: uid }))
  return {
    type: ADD_TO_NAME_INDEX,
    payload: promise
  }
}

export const createProfileRecord = (uid, profile) => {
  const profileIndex = algoliaClient.initIndex('profiles')
  const promise = profileIndex.getObject(uid)
    .catch(() => profileIndex.addObject({ ...profile, objectID: uid }))
  return {
    type: CREATE_PROFILE_RECORD,
    payload: promise
  }
}

export const partialUpdateAlgoliaObject = (index, updateObject) => dispatch => dispatch({
  type: PARTIAL_UPDATE_OBJECT,
  payload: algoliaClient.initIndex(index).partialUpdateObject(updateObject)
})

export const setPublic = (isPublic, uid) => (dispatch) => {
  const nameIndex = algoliaClient.initIndex('names')
  const profileIndex = algoliaClient.initIndex('profiles')
  const promise = nameIndex.partialUpdateObject({
    public: isPublic,
    objectID: uid
  })
    .then(() => profileIndex.partialUpdateObject({ public: isPublic, objectID: uid }))
  return dispatch({
    type: SET_PUBLIC,
    payload: promise
  })
}

export const setVendorPublic = (isPublic, vendorId) => {
  const vendorIndex = algoliaClient.initIndex('vendors')
  const promise = vendorIndex.partialUpdateObject({ objectID: vendorId, public: isPublic })
  return {
    type: SET_VENDOR_PUBLIC,
    payload: promise
  }
}

export const createVendorProfileRecord = (vendorId, vendorInfo) => {
  const vendorIndex = algoliaClient.initIndex('vendors')
  return {
    type: CREATE_VENDOR_PROFILE_RECORD,
    payload: vendorIndex.addObject({
      ...vendorInfo,
      public: false,
      objectID: vendorId
    })
  }
}

export const deleteVendorProfileRecord = (vendorId) => {
  const vendorIndex = algoliaClient.initIndex('vendors')
  return {
    type: DELETE_VENDOR_PROFILE_RECORD,
    payload: vendorIndex.deleteObject(vendorId)
  }
}

export const createLocationProfileRecord = (locationId, locationInfo) => {
  const locationIndex = algoliaClient.initIndex('locations')
  return {
    type: CREATE_LOCATION_PROFILE_RECORD,
    payload: locationIndex.addObject({
      ...locationInfo,
      objectID: locationId,
      public: true
    })
  }
}

export const deleteLocationProfileRecord = (locationId) => {
  const locationIndex = algoliaClient.initIndex('locations')
  return {
    type: DELETE_LOCATION_PROFILE_RECORD,
    payload: locationIndex.deleteObject(locationId)
  }
}

export const searchForRoles = (query) => {
  const roleIndex = algoliaClient.initIndex('roles')
  return {
    type: SEARCH_FOR_ROLES,
    payload: roleIndex.search({ query, hitsPerPage: '100', facets: ['roleName'] })
  }
}

export const searchForLocationTypes = (query) => {
  const locationIndex = algoliaClient.initIndex('locationTypes')
  return {
    type: SEARCH_FOR_LOCATION_TYPES,
    payload: locationIndex.search({ query, hitsPerPage: '100', facets: ['type'] })
  }
}

export const deleteRolesFromProfile = (newRoles, uid) => {
  const profileIndex = algoliaClient.initIndex('profiles')
  return {
    type: DELETE_ROLE_FROM_PROFILE,
    payload: profileIndex.partialUpdateObject({ roles: newRoles, objectID: uid })
  }
}
