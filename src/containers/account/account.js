import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import AccountPage from '../../presentation/account/accountPage'

const Account = props => (
  <AccountPage 
    {...props} 
    onSubmit={ (values) => { 
      props.firebase.updateProfile({ firstName: values.firstName, lastName: values.lastName }); 
      props.firebase.updateEmail(values.email);
    }} />
)

Account.propTypes = {
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    email: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
}

const wrappedAccount = firebaseConnect()(Account)

export default withRouter(connect(
  state => ({ account: state.account, firebase: state.firebase, auth: state.firebase.auth, profile: state.firebase.profile }),
  { },
)(wrappedAccount))
