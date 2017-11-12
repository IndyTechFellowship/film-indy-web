import React from 'react'
import QueryString from 'query-string'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import ViewProfilePage from '../../presentation/profile/ViewProfile'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'


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
    lastName: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  firebase: PropTypes.shape({
    set: PropTypes.func
  }).isRequired
}

const WrappedViewProfile = firebaseConnect((props, firebase) => {
  // gets uid of current public profile from URL
  const { location } = props
  const parsed = QueryString.parse(location.search)
  const uid = parsed.query

  return [
    `/userProfiles/${uid}`,
    `/userAccount/${uid}`,
    'roles'
  ]
})(ViewProfileContainer)


export default withRouter(connect(
  state => ({ firebase: state.firebase, auth: state.firebase.auth, profile: state.firebase.profile, data: state.firebase.data }),
  { ...algoliaActions },
)(WrappedViewProfile))
