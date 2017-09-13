import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as firebase from 'firebase'
import { configureStore } from './redux/store/configureReduxStore'
import './index.css'
import App from './App'

const target = document.getElementById('root')
const history = createHistory()
const store = configureStore(history)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
}

firebase.initializeApp(firebaseConfig)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>, target)
