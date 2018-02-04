import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import LocationProfile from '../../presentation/locationProfile/LocationProfile'

class LocationProfileContainer extends React.Component {
  render() {
    return (
      <LocationProfile {...this.props} />
    )
  }
}

LocationProfileContainer.propTypes = {

}

const WrappedLocationProfile = firebaseConnect((props, firebase) => {
  const locationId = get(props, 'match.params.locationId', '')
  return [
    `/locationProfiles/${locationId}`
  ]
})(LocationProfileContainer)

export default withRouter(connect(
  state => ({
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    data: state.firebase.data

  }),
  { },
)(WrappedLocationProfile))

