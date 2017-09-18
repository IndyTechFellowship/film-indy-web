import React from 'react'
import { Route } from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import TextField from 'material-ui/TextField'

import SearchIcon from 'material-ui/svg-icons/action/search'

import Home from './containers/home'
import Login from './containers/login/login'
import Dashboard from './containers/dashboard/dashboard'

import './App.css'
import Logo from './film-indy-logo.png'

const App = () => (
  <div className="App">
    <AppBar
      iconElementLeft={
        <div>
          <img src={Logo} className="logo" alt="Film Indy Logo" />
          <Card className="searchCard" style={{ width: 400 }}>
            <SearchIcon className="searchIcon" />
            <TextField
              className="searchField"
              hintText="Search FilmIndy"
              underlineFocusStyle={{ borderColor: '#38b5e6' }}
              floatingLabelFocusStyle={{ color: '#38b5e6' }}
            />
          </Card>
        </div>
      }
      iconElementRight={<Avatar className="accountIcon" src="https://goo.gl/ybdoo6" size={60} />}
      zDepth={2}
    />
    <Route exact path="/" component={Home} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/login" component={Login} />
  </div>
)

export default App
