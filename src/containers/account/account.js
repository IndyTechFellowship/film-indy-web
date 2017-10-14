import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import * as firebase from 'firebase'
import AccountPage from '../../presentation/account/accountPage'


const Account = props => (
  <div>
    <AccountPage
      {...props}
      handleProfileChanges={(values) => {
        const oldEmail = get(props, 'auth.email')
        props.firebase.updateProfile({ firstName: values.firstName, lastName: values.lastName })
        if (values.email !== oldEmail) {
          props.firebase.updateEmail(values.email)
        }
      }}
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
  }).isRequired
}

Account.defaultProps = {
  account: {}
}

const wrappedAccount = firebaseConnect()(Account)

export default withRouter(connect(
  state => ({ account: state.account,
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    initialValues: { firstName: state.firebase.profile.firstName, lastName: state.firebase.profile.lastName, email: get(firebase.auth(), 'currentUser.email') } }),
  { },
)(wrappedAccount))
