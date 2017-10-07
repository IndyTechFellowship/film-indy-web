import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import EditProfile from '../../presentation/profile/EditProfile'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'

class EditProfileContainer extends React.Component {
  render() {
    return (
      <EditProfile {...this.props} />
    )
  }
}

EditProfileContainer.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    photoURL: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object
  }).isRequired,
  firebase: PropTypes.shape({
    set: PropTypes.func
  }).isRequired
}

const WrappedEditProfile = firebaseConnect((props, firebase) => {
  const uid = get(firebase.auth(), 'currentUser.uid', '')
  return [
    `/userProfiles/${uid}`,
    'roles'
  ]
})(EditProfileContainer)


export default withRouter(connect(
  state => ({ firebase: state.firebase, auth: state.firebase.auth, profile: state.firebase.profile, data: state.firebase.data }),
  { ...algoliaActions },
)(WrappedEditProfile))

