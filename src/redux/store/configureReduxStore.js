import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import { routerMiddleware } from 'react-router-redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export const configureStore = (browserHistory, firebaseConfig) => {
  const reduxFirebaseConfig = {
    userProfile: 'users',
    updateProfileOnLogin: true,
  }
  const createStoreWithFirebase = compose(
    reactReduxFirebase(firebaseConfig, reduxFirebaseConfig),
  )(createStore)

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

  const store = createStoreWithFirebase(rootReducer, initialState, composedEnhancers)
  return store
}
