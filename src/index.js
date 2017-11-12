import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import * as firebase from 'firebase'

import injectTapEventPlugin from 'react-tap-event-plugin'

// implements Google Material UI framework:
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { fade } from 'material-ui/utils/colorManipulator'
import {
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack
} from 'material-ui/styles/colors'

import { configureStore } from './redux/store/configureReduxStore'
import App from './App'
import './index.css'

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#004b8d', // Film Indy dark blue: primary={true} enables it on component
    primary2Color: pinkA200,
    primary3Color: grey400,
    accent1Color: '#38b5e6', // Film Indy light blue: secondary={true} enables it on component
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: '#39991e',
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  }
})

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
}

firebase.initializeApp(firebaseConfig)

const target = document.getElementById('root')
const history = createHistory()
const store = configureStore(history, firebase)


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <MuiThemeProvider muiTheme={muiTheme} >
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>, target)
