import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import { firebaseStateReducer } from 'react-redux-firebase'
import home from '../reducers/homeReducer'
import account from '../reducers/accountReducer'
import algolia from '../reducers/algoliaReducer'

export default combineReducers({ routing: routerReducer, form: formReducer, firebase: firebaseStateReducer, home, account, algolia })
