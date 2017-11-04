import React from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { InstantSearch } from 'react-instantsearch/dom'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import 'react-instantsearch-theme-algolia/style.css'

// Material UI Components
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { Card } from 'material-ui/Card'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import Snackbar from 'material-ui/Snackbar'
import AutoComplete from 'material-ui/AutoComplete'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'
import AccountCircle from 'material-ui/svg-icons/action/account-circle'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
import CreateIcon from 'material-ui/svg-icons/social/person-add'
import EditIcon from 'material-ui/svg-icons/content/create'
import ViewIcon from 'material-ui/svg-icons/image/remove-red-eye'

// Page components
import Home from './containers/home'
import Login from './containers/login/login'
import Account from './containers/account/account'
import EditProfile from './containers/profile/EditProfile'
import ViewProfile from './containers/profile/ViewProfile'
import Search from './containers/search/Search'
import ForgotPassword from './containers/forgotPassword/forgotPassword'
import SignUpForm from './presentation/signup/SignUpForm'

// Style and images
import './App.css'

import Logo from './film-indy-logo.png'

import * as accountActions from './redux/actions/creators/accountActions'

const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID


const AutoCompleteBar = connectAutoComplete(
  ({ hits, onItemSelected, onUpdateInput }) => (
    <AutoComplete
      className="searchField"
      hintText="Search our database..."
      onUpdateInput={onUpdateInput}
      id="autocomplete"
      maxSearchResults={10}
      filter={(searchText, key) => {
        if (searchText === '') {
          return false
        }
        return AutoComplete.fuzzyFilter(searchText, key)
      }}
      onNewRequest={onItemSelected}
      dataSource={hits.sort((a, b) => a.roleName.localeCompare(b.roleName)).map(hit => hit.roleName)}
    />
  )
)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      signedOut: false
    }
    this.handleAvatarTouch = this.handleAvatarTouch.bind(this)
    this.handleDropdownClose = this.handleDropdownClose.bind(this)
    this.handleSignOutClose = this.handleSignOutClose.bind(this)
    this.signOutMessage = this.signOutMessage.bind(this)
  }

  handleAvatarTouch(event) {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
      signedOut: false
    })
  }

  handleDropdownClose() {
    this.setState({
      open: false
    })
  }

  signOutMessage() {
    this.setState({
      signedOut: true,
      open: false
    })
  }

  handleSignOutClose() {
    this.setState({
      signedOut: false
    })
  }

  render() {
    const { profile, auth, firebase, history, signUp, submitSignUp, location } = this.props
    const photoURL = get(profile, 'photoURL', '')
    const uid = get(auth, 'uid')
    return (
      <div className="App">
        <AppBar
          iconElementLeft={
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Link to="/"><img src={Logo} className="logo" alt="Film Indy Logo" /></Link>
              { location.pathname !== '/' &&
              <Card className="menuSearchCard" style={{ width: 420 }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <SearchIcon className="searchIcon" />
                  <InstantSearch
                    appId={ALGOLIA_APP_ID}
                    apiKey={ALGOLIA_SEARCH_KEY}
                    indexName="roles"
                  >
                    <AutoCompleteBar
                      onUpdateInput={query => this.searchQuery = query}
                      onItemSelected={item => history.push({ pathname: '/search', search: `?query=${encodeURIComponent(item)}` })}
                    />
                  </InstantSearch>
                  <RaisedButton
                    label="Search"
                    labelColor="#fff"
                    backgroundColor={'#38b5e6'}
                    style={{ height: 30, marginTop: 10, marginLeft: 30 }}
                    onClick={() => {
                      if (this.searchQuery !== '') {
                        history.push({ pathname: '/search', search: `?query=${encodeURIComponent(this.searchQuery)}` })
                      }
                    }}
                  />
                </div>
              </Card>
              }
            </div>
          }
          iconElementRight={uid ? (
            <Avatar className="accountIcon avatar" src={photoURL} size={60} onClick={this.handleAvatarTouch} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 35 }}>
              <SignUpForm
                onSubmit={(values) => {
                  signUp(values.firstName, values.lastName, values.photoFile, values.email, values.password)
                }}
                sendSubmit={submitSignUp}
              />
              <Link to="/login"><FlatButton style={{ color: 'white' }} label="Login" labelStyle={{fontSize: '12pt'}} size={60} /> </Link>
            </div>
          )}
          zDepth={2}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleDropdownClose}
        >
          <Menu>
            { uid ? ( // renders dropdown items depending on if logged in
              <div>
                <Link to="/account"><MenuItem primaryText="Account Settings" leftIcon={<AccountCircle />} /></Link>
                <Link to="/profile/edit"><MenuItem primaryText="Edit Profile" leftIcon={<EditIcon />} /></Link>
                <Link to={{ pathname: '/profile', search: `?query=${uid}` }}><MenuItem primaryText="View Profile" leftIcon={<ViewIcon />} /></Link>
                <MenuItem primaryText="Log Out" leftIcon={<LogoutIcon />} onClick={(e) => { firebase.logout(); this.signOutMessage() }} />
              </div>
            ) : (
              <div>
                <Link to="/login"><MenuItem primaryText="Log In" leftIcon={<AccountCircle />} /></Link>
                <Link to="/signup"><MenuItem primaryText="Create Account" leftIcon={<CreateIcon />} /></Link>
              </div>
            )}
          </Menu>
        </Popover>
        <Snackbar
          bodyStyle={{ backgroundColor: '#00C853' }}
          open={this.state.signedOut}
          message={'Successfully Logged Out.'}
          autoHideDuration={4000}
          onRequestClose={this.handleSignOutClose}
        />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/account" component={Account} />
        <Route path="/search" component={Search} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/profile/edit" component={EditProfile} />
        <Route path="/profile" component={ViewProfile} />
      </div>
    )
  }
}

App.propTypes = {
  profile: PropTypes.shape({
    photoURL: PropTypes.string
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  signUp: PropTypes.func.isRequired,
  submitSignUp: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

const wrappedApp = firebaseConnect()(App)

export default withRouter(connect(
  state => ({ firebase: state.firebase, profile: state.firebase.profile, auth: state.firebase.auth }),
  { ...accountActions },
)(wrappedApp))
