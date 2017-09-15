import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/home'
import './App.css'

// implements Google Material UI framework:
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {fade} from 'material-ui/utils/colorManipulator';
import {
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

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
	    shadowColor: fullBlack,
	  },
});

const App = () => (
<MuiThemeProvider muiTheme={muiTheme}>
  <div className="App">
    <Route exact path="/" component={Home} />
  </div>
</MuiThemeProvider>
)

export default App
