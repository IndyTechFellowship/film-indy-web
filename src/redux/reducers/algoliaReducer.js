import algoliasearch from 'algoliasearch'


const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)
const initalState = {
  algoliaClient
}

export default (state = initalState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
