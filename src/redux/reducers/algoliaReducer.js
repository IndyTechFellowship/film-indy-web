import { SEARCH_INDEX, ENRICH_SEARCH_RESULT, SEARCH_FOR_CREW, SEARCH_FOR_CREW_ENRICHED, RESET_SEARCH_RESULTS } from '../actions/types/algoliaActionsTypes'
import { uniqBy } from 'lodash'

const initalState = {
  offset: 0,
  length: 10,
  totalHits: { hasLoaded: false },
  queryResults: [],
  enrichedResults: [],
  crewQueryResults: [],
  enrichedCrewResults: []
}

export default (state = initalState, action) => {
  switch (action.type) {
    case `${RESET_SEARCH_RESULTS}_STARTING`:
      return {
        ...state,
        offset: action.payload.offset,
        length: action.payload.length,
        totalHits: { hasLoaded: false },
        enrichedCrewResults: [],
        crewQueryResults: []
      }
    case `${SEARCH_INDEX}_SUCCESS`:
      return {
        enrichedResults: [],
        queryResults: action.payload.hits
      }
    case `${ENRICH_SEARCH_RESULT}_SUCCESS`:
      return {
        ...state,
        enrichedResults: [...state.enrichedResults, ...state.queryResults.map((result) => {
          const objectID = result.objectID
          const enrichmentData = action.payload.find(enriched => enriched.objectID === objectID)
          return { ...result, ...enrichmentData.value }
        })]
      }
    case `${SEARCH_FOR_CREW}_STARTING`:
      return {
        ...state,
        ...action.payload,
        totalHits: {
          ...state.totalHits,
          hasLoaded: false
        }
      }
    case `${SEARCH_FOR_CREW}_SUCCESS`:
      return {
        ...state,
        crewQueryResults: [...state.crewQueryResults, ...action.payload.reduce((acc, r) => [...acc, ...r.results.hits], [])]
      }
    case `${SEARCH_FOR_CREW_ENRICHED}_STARTING`:
      return {
        ...state,
        totalHits: {
          ...state.totalHits,
          ...action.payload.totalHits
        }
      }
    case `${SEARCH_FOR_CREW_ENRICHED}_SUCCESS`:
      if (action.payload.length > 0) {
        const newResults = [...state.enrichedCrewResults, ...state.crewQueryResults.map((result) => {
          const objectID = result.objectID
          const enrichmentData = action.payload.find(enriched => enriched.objectID === objectID)
          if (enrichmentData) {
            return { ...result, ...enrichmentData.value }
          }
          return { ...result }
        })]
        return {
          ...state,
          totalHits: {
            ...state.totalHits,
            hasLoaded: true
          },
          enrichedCrewResults: uniqBy(newResults, 'objectID')
        }
      }
      return {
        ...state,
        totalHits: {
          ...state.totalHits,
          hasLoaded: true
        }
      }


    default:
      return state
  }
}
