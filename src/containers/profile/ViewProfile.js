import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import ViewProfilePage from '../../presentation/profile/ViewProfile'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'
import AuthenticatedComponent from '../../AuthenticatedComponent'



class ViewProfileContainer extends React.Component {
  render() {
    return (
      <ViewProfilePage {...this.props} />
    )
  }
}

ViewProfileContainer.propTypes = {
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

// const WrappedViewProfile = firebaseConnect((props, firebase) => {
//   const uid = get(firebase.auth(), 'currentUser.uid', '')
//   return [
//     `/userProfiles/${uid}`,
//     'roles'
//   ]
// })(AuthenticatedComponent(ViewProfileContainer))


export default withRouter(connect(
  state => ({ firebase: state.firebase, profile: state.firebase.profile, data: state.firebase.data }),
  { ...algoliaActions },
)(ViewProfileContainer))
