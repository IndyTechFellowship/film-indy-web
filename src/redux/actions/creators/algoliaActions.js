import * as firebase from 'firebase'
import algoliasearch from 'algoliasearch'
import { SEARCH_INDEX, ENRICH_SEARCH_RESULT, PARTIAL_UPDATE_OBJECT } from '../types/algoliaActionsTypes'

const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
const ALGOLA_ADMIN_KEY = process.env.REACT_APP_ALGOLIA_ADMIN_KEY

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLA_ADMIN_KEY, { protocol: 'https:' })

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

export const partialUpdateAlgoliaObject = (index, updateObject) => dispatch => dispatch({
  type: PARTIAL_UPDATE_OBJECT,
  payload: algoliaClient.initIndex(index).partialUpdateObject(updateObject)
})
