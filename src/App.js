import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/home'
import './App.css'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'

import SearchIcon from 'material-ui/svg-icons/action/search'

// Image importing would only work via require
const Logo = require('./film-indy-logo.jpg')

const App = () => (
  <div className="App">
      <AppBar
          iconElementLeft={
              <div>
                  <img src={Logo} className="logo"/>
                  <Card className="searchCard" style={{width: 400}}>
                          <SearchIcon className="searchIcon" />
                          <TextField
                              className="searchField"
                              hintText="Search FilmIndy"
                              underlineFocusStyle={{borderColor: '#38b5e6'}}
                              floatingLabelFocusStyle={{color: '#38b5e6'}}
                          />
                  </Card>
              </div>
          }
          iconElementRight={ <Avatar className="accountIcon" src="https://goo.gl/ybdoo6" size={60} /> }
          zDepth = {2}
      />
     <Route exact path="/" component={Home} />
  </div>
)

export default App
