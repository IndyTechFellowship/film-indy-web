import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { firebaseStateReducer } from 'react-redux-firebase'
import { createResponsiveStateReducer } from 'redux-responsive'
import home from '../reducers/homeReducer'
import account from '../reducers/accountReducer'
import algolia from '../reducers/algoliaReducer'

const responsiveStateReducer = createResponsiveStateReducer({
  extraSmall: 576,
  small: 768,
  medium: 992,
  large: 1200
})

export default combineReducers({ routing: routerReducer, form: formReducer, firebase: firebaseStateReducer, browser: responsiveStateReducer, home, account, algolia })
