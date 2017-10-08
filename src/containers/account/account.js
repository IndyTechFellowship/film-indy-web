import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import AccountPage from '../../presentation/account/accountPage'
import Snackbar from 'material-ui/Snackbar'

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email': return 'Invalid Email'
    case 'auth/email-already-in-use': return 'Email already in use'
    case 'auth/requires-recent-login': return 'Recent login required. Please sign out and back in'
    default: return 'There was an issue changing your email. Please try again'
  }
}

const Account = props => (
  <div>
    <AccountPage
      {...props}
      handleProfileChanges={(values) => {
        props.firebase.updateProfile({ firstName: values.firstName, lastName: values.lastName });
        props.firebase.updateEmail(values.email);
      }}
    />
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.signInError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.signInError.code'))}
      autoHideDuration={4000}
    />
  </div>
)

Account.propTypes = {
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired
  }).isRequired,
  auth: PropTypes.shape({
    email: PropTypes.string,
    uid: PropTypes.string
  }).isRequired,
  account: PropTypes.shape({
    signInError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
}

Account.defaultProps = {
  account: {},
}

const wrappedAccount = firebaseConnect()(Account)

export default withRouter(connect(
  state => ({ account: state.account,
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    initialValues: { firstName: state.firebase.profile.firstName, lastName: state.firebase.profile.lastName, email: state.firebase.auth.email } }),
  { },
)(wrappedAccount))
