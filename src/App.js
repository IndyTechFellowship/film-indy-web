import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/home'
import Login from './containers/login/login'
import Dashboard from './containers/dashboard/dashboard'
import './App.css'

import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField'

import SearchIcon from 'material-ui/svg-icons/action/search'

// Image importing would only work via require
const Logo = require('./film-indy-logo.png')

const App = () => (

    constructor(props) {
      super(props);
      this.state = {
        open: false,
      }
    }

    handleTouchTap = (event) => {
      // This prevents ghost click.
      event.preventDefault()

      this.setState({
        open: true,
        anchorEl: event.currentTarget,
      });
    }

    handleRequestClose = () => {
      this.setState({
        open: false,
      })
  }

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
      iconElementRight={<Avatar className="accountIcon" src="https://goo.gl/ybdoo6" size={60} onClick={this.handleTouchTap} />}
      zDepth={2}
    />
    <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Account Settings" />
            <MenuItem primaryText="Log Out" />
          </Menu>
        </Popover>
    <Route exact path="/" component={Home} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/login" component={Login} />
  </div>
)

export default App
