import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export const configureStore = (browserHistory) => {
  const initialState = {}
  const enhancers = []
  const middleware = [
    routerMiddleware(browserHistory),
    thunk,
    promiseMiddleware({
      promiseTypeSuffixes: ['STARTING', 'SUCCESS', 'ERROR'],
    }),
  ]


  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers)

  const store = createStore(rootReducer, initialState, composedEnhancers)
  return store
}
