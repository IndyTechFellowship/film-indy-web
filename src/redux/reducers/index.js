import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import home from '../reducers/homeReducer'
import account from '../reducers/accountReducer'

export default combineReducers({ routing: routerReducer, form: formReducer, home, account })
