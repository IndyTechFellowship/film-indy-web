import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import AccountPage from '../../presentation/account/accountPage'

const Account = (props) => {
  const { firebase: { updateProfile, uploadFile }, auth } = props
  const email = get(auth, 'email', '')
  return (
    <div>
      <h1>{`hello ${email}`}</h1>
      <AccountPage {...this.props} />
    </div>
  )
}

Account.propTypes = {
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    email: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
}

const wrappedAccount = firebaseConnect()(Account)

export default withRouter(connect(
  state => ({ account: state.account, firebase: state.firebase, auth: state.firebase.auth }),
  { },
)(wrappedAccount))
