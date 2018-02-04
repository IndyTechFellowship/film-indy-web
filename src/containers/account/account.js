import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import * as firebase from 'firebase'
import AccountPage from '../../presentation/account/accountPage'
import * as accountActions from '../../redux/actions/creators/accountActions'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'
import Authed from '../../AuthenticatedComponent'


const Account = props => (
  <div>
    <AccountPage
      {...props}
      handleProfileChanges={(values) => {
        const oldEmail = get(props, 'auth.email')
        const uid = get(props, 'auth.uid')
        props.firebase.updateProfile({ firstName: values.firstName, lastName: values.lastName })
        props.partialUpdateAlgoliaObject('names', { firstName: values.firstName, lastName: values.lastName, objectID: uid })
        if (values.email !== oldEmail) {
          props.firebase.updateEmail(values.email)
            .then(() => props.firebase.reloadAuth())
            .then(result => props.updateAuth(result))
        }
      }}
    />
  </div>
)

Account.propTypes = {
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
    reloadAuth: PropTypes.func.isRequired
  }).isRequired,
  auth: PropTypes.shape({
    email: PropTypes.string,
    uid: PropTypes.string
  }).isRequired,
  partialUpdateAlgoliaObject: PropTypes.func.isRequired,
  updateAuth: PropTypes.func.isRequired,
  sendPasswordResetEmail: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired
}

Account.defaultProps = {
  account: {}
}

const wrappedAccount = firebaseConnect((props, store) => {
  const uid = get(props, 'firebase.auth.uid', '')
  return [
    {
      path: 'vendorProfiles',
      storeAs: 'usersVendors',
      queryParams: ['orderByChild=creator', `equalTo=${uid}`]
    },
    {
      path: 'locationProfiles',
      storeAs: 'usersLocations',
      queryParams: ['orderByChild=creator', `equalTo=${uid}`]
    },
    `/userAccount/${uid}`
  ]
})(Authed(Account))

export default withRouter(connect(
  state => ({ account: state.account,
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    usersVendors: state.firebase.data.usersVendors,
    usersLocations: state.firebase.data.usersLocations,
    initialValues: { firstName: state.firebase.profile.firstName, lastName: state.firebase.profile.lastName, email: get(firebase.auth(), 'currentUser.email') } }),
  { ...accountActions, ...algoliaActions },
)(wrappedAccount))
