import * as firebase from 'firebase'
import algoliasearch from 'algoliasearch'
import { RESET_SEARCH_RESULTS, SEARCH_INDEX, SEARCH_FOR_CREW,
  SEARCH_FOR_CREW_ENRICHED, ENRICH_SEARCH_RESULT, PARTIAL_UPDATE_OBJECT, MIGRATE_PROFILE,
  MIGRATE_NAME, ADD_TO_NAME_INDEX, CREATE_PROFILE_RECORD, SET_PUBLIC, CREATE_VENDOR_PROFILE_RECORD,
  DELETE_VENDOR_PROFILE_RECORD, SEARCH_FOR_VENDORS, SEARCH_FOR_VENDORS_ENRICHED, SEARCH_FOR_ROLES,
  ADD_ROLE_SEARCH_FILTER, REMOVE_ROLE_SEARCH_FILTER, DELETE_ROLE_FROM_PROFILE
} from '../types/algoliaActionsTypes'

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

export const searchForCrew = (query, filters, offset = 0, length = 10) => (dispatch) => {
  const filtersString = createFilters(filters)
  const searchObject = { offset, length }
  const indexNames = ['profiles', 'names']
  const searchPromises = indexNames.map((indexName) => {
    const index = algoliaClient.initIndex(indexName)
    if (indexName === 'profiles') {
      const enhancedSearchObject = filters.length === 0 ? { ...searchObject, query, filters: filtersString } : { ...searchObject, query: '', filters: filtersString }
      return index.search(enhancedSearchObject).then(results => ({ indexName, results }))
    } else if (indexName === 'names') {
      const enhancedSearchObject = filters.length === 0 ? { ...searchObject, query, filters: 'public:true' } : { ...searchObject, query, filters: 'public:true' }
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
      const indexName = results.indexName
      return { ...acc, [indexName]: results.results.hits.length }
    }, {})
    const uniqueHits = searchResults.value.reduce((acc, result) => [...acc, ...result.results.hits], [])
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
    return index.search({ query, offset, length }).then(results => ({ indexName, results }))
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

export const resetAndSearch = (query, filters = [], offset = 0, length = 10) => dispatch => dispatch({
  type: RESET_SEARCH_RESULTS,
  payload: {
    data: { offset, length, filters },
    promise: Promise.resolve()
  }
})
  .then(() => dispatch(searchForCrew(query, filters, offset, length)))
  .then(() => dispatch(searchForVendors(query, offset, length)))

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
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  const nameIndex = algoliaClient.initIndex('names')
  const profileIndex = algoliaClient.initIndex('profiles')
  const promise = nameIndex.partialUpdateObject({
    public: isPublic,
    objectID: uid
  })
    .then(() => profileIndex.partialUpdateObject({ public: isPublic, objectID: uid }))
    .then(() => profileRef.update({ public: isPublic }))
  return dispatch({
    type: SET_PUBLIC,
    payload: promise
  })
}

export const createVendorProfileRecord = (vendorId, vendorInfo) => {
  const vendorIndex = algoliaClient.initIndex('vendors')
  return {
    type: CREATE_VENDOR_PROFILE_RECORD,
    payload: vendorIndex.addObject({
      ...vendorInfo,
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

export const searchForRoles = (query) => {
  const roleIndex = algoliaClient.initIndex('roles')
  return {
    type: SEARCH_FOR_ROLES,
    payload: roleIndex.search({ query, hitsPerPage: '100', facets: ['roleName'] })
  }
}

export const deleteRolesFromProfile = (newRoles, uid) => {
  const profileIndex = algoliaClient.initIndex('profiles')
  return {
    type: DELETE_ROLE_FROM_PROFILE,
    payload: profileIndex.partialUpdateObject({ roles: newRoles, objectID: uid })
  }
}
