import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import VendorProfile from '../../presentation/vendorProfile/vendorProfile'

class EditProfileContainer extends React.Component {
  render() {
    return (
      <VendorProfile {...this.props} />
    )
  }
}

EditProfileContainer.propTypes = {

}

const WrappedEditProfile = firebaseConnect((props, firebase) => {
  const vendorId = get(props, 'match.params.vendorId', '')
  return [
    `/vendorProfiles/${vendorId}`
  ]
})(EditProfileContainer)

export default withRouter(connect(
  state => ({
    firebase: state.firebase,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    data: state.firebase.data

  }),
  { },
)(WrappedEditProfile))

