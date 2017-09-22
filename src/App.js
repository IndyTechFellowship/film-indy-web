import React from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { get } from 'lodash'
import PropTypes from 'prop-types'

// Material UI Components
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField'

// Page components
import Home from './containers/home'
import Login from './containers/login/login'
import Account from './containers/account/account'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'
import AccountCircle from 'material-ui/svg-icons/action/account-circle'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'

// Style and images
import './App.css'

import Logo from './film-indy-logo.png'

class App extends React.Component {

    constructor(props) {
      super(props);
    //   const photoURL = get(profile, 'photoURL', '')

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
  render () {
      return (
          <div className="App">
            <AppBar
              iconElementLeft={
                <div>
                  <Link to="/"><img src={Logo} className="logo" alt="Film Indy Logo" /></Link>
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
                    <Link to="/account"><MenuItem primaryText="Account Settings" leftIcon={<AccountCircle />} /></Link>
                    <MenuItem primaryText="Log Out" leftIcon={<LogoutIcon />}/>
                  </Menu>
                </Popover>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/account" component={Account} />
          </div>
    )
  }
}

App.propTypes = {
    profile: PropTypes.Object,
}

const wrappedApp = firebaseConnect()(App)

export default connect(
  state => ({ firebase: state.firebase, profile: state.firebase.profile }),
  {},
)(wrappedApp)
