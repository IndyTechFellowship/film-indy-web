import { SEARCH_INDEX, ENRICH_SEARCH_RESULT, SEARCH_FOR_CREW, SEARCH_FOR_CREW_ENRICHED } from '../actions/types/algoliaActionsTypes'

const initalState = {
  queryResults: [],
  enrichedResults: [],
  crewQueryResults: [],
  enrichedCrewResults: []
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
    case `${SEARCH_FOR_CREW}_SUCCESS`:
      return {
        enrichedCrewResults: [],
        crewQueryResults: action.payload.reduce((acc, r) => [...acc, ...r.results.hits])
      }
    case `${SEARCH_FOR_CREW_ENRICHED}_SUCCESS`:
      return {
        ...state,
        enrichedCrewResults: state.crewQueryResults.map((result) => {
          const objectID = result.objectID
          const enrichmentData = action.payload.find(enriched => enriched.objectID === objectID)
          return { ...result, ...enrichmentData.value }
        })
      }
    default:
      return state
  }
}
