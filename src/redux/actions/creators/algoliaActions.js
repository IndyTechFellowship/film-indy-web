import * as firebase from 'firebase'
import algoliasearch from 'algoliasearch'
import { push } from 'react-router-redux'
import { SEARCH_INDEX, ENRICH_SEARCH_RESULT, GO_TO_SEARCH } from '../types/algoliaActionsTypes'


const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

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

export const goToSearch = query => dispatch => dispatch(push(`/search?query=${encodeURIComponent(query)}`))
