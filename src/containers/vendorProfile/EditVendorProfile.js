import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import EditVendorProfile from '../../presentation/vendorProfile/EditVendorProfile'
import * as accountActions from '../../redux/actions/creators/accountActions'
import * as profileActions from '../../redux/actions/creators/profileActions'
import * as vendorActions from '../../redux/actions/creators/vendorActions'
import AuthenticatedOwner from '../../AuthenticatedOwner'

const createInitialValues = (state, props) => {
  const vendor = get(state, `firebase.data.vendorProfiles.${get(props, 'match.params.vendorId', '')}`)
  return ({ ...vendor })
}

class EditVendorProfileContainer extends React.Component {
  render() {
    return (
      <EditVendorProfile {...this.props} />
    )
  }
}

EditVendorProfileContainer.propTypes = {

}

const WrappedEditProfile = firebaseConnect((props) => {
  const vendorId = get(props, 'match.params.vendorId', '')
  return [
    `/vendorProfiles/${vendorId}`
  ]
})(AuthenticatedOwner(EditVendorProfileContainer))
export default withRouter(connect(
  (state, props) => ({
    firebase: state.firebase,
    auth: state.firebase.auth,
    vendorProfile: get(state, `firebase.data.vendorProfiles.${get(props, 'match.params.vendorId', '')}`),
    vendorId: get(props, 'match.params.vendorId', ''),
    initialValues: createInitialValues(state, props)
  }),
  { ...accountActions, ...profileActions, ...vendorActions },
)(WrappedEditProfile))

