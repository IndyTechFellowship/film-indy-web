import React from 'react'
import PropTypes from 'prop-types'
import QueryString from 'query-string'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import EditProfile from '../../presentation/profile/EditProfile'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'
import AuthenticatedComponent from '../../AuthenticatedComponent'

const createInitialValues = (state) => {
  const uid = state.firebase.auth.uid
  return { 
    headline: get( state, `firebase.data.userProfiles.${uid}.headline`),
    experience: get( state, `firebase.data.userProfiles.${uid}.experience`),
    phone: get( state, `firebase.data.userProfiles.${uid}.phone`),
    bio: get( state, `firebase.data.userProfiles.${uid}.bio`),
    website: get( state, `firebase.data.userProfiles.${uid}.website`),
    video: get( state, `firebase.data.userProfiles.${uid}.video`)
   }
}

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
  }).isRequired,
  data: PropTypes.shape({
    userProfile: PropTypes.object
  }).isRequired,
}

const WrappedEditProfile = firebaseConnect((props, firebase) => {
  const uid = get(firebase.auth(), 'currentUser.uid', '')
  return [
    `/userProfiles/${uid}`,
    'roles'
  ]
})(AuthenticatedComponent(EditProfileContainer))



export default withRouter(connect(
  state => ({ 
    firebase: state.firebase, auth: state.firebase.auth, profile: state.firebase.profile, data: state.firebase.data,
    // initialValues: { headline: 'A', experience: 'A', phone: 'A', bio: 'A', website: 'A', video: 'A' }
    initialValues: createInitialValues(state)

   }),
  { ...algoliaActions },
)(WrappedEditProfile))

