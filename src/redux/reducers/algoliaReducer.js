import { SEARCH_INDEX, ENRICH_SEARCH_RESULT } from '../actions/types/algoliaActionsTypes'

const initalState = {
  queryResults: [],
  enrichedResults: []
}

export default (state = initalState, action) => {
  switch (action.type) {
    case `${SEARCH_INDEX}_SUCCESS`:
      return {
        enrichedResults: [],
        queryResults: action.payload.hits
      }
    case `${ENRICH_SEARCH_RESULT}_SUCCESS`:
      return {
        ...state,
        enrichedResults: state.queryResults.map((result) => {
          const objectID = result.objectID
          const enrichmentData = action.payload.find(enriched => enriched.objectID === objectID)
          return { ...result, ...enrichmentData.value }
        })
      }
    default:
      return state
  }
}
