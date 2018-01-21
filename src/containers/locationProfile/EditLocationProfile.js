import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import EditLocationProfile from '../../presentation/locationProfile/EditLocationProfile'
import * as accountActions from '../../redux/actions/creators/accountActions'
import * as profileActions from '../../redux/actions/creators/profileActions'
import * as locationActions from '../../redux/actions/creators/locationActions'
import AuthenticatedOwner from '../../AuthenticatedOwner'

const createInitialValues = (state, props) => {
  const location = get(state, `firebase.data.locationProfiles.${get(props, 'match.params.locationId', '')}`)
  return ({ ...location })
}

class EditLocationProfileContainer extends React.Component {
  render() {
    return (
      <EditLocationProfile {...this.props} />
    )
  }
}

EditLocationProfileContainer.propTypes = {

}

const WrappedEditLocationProfile = firebaseConnect((props) => {
  const locationId = get(props, 'match.params.locationId', '')
  return [
    `/locationProfiles/${locationId}`
  ]
})(AuthenticatedOwner(EditLocationProfileContainer))
export default withRouter(connect(
  (state, props) => ({
    firebase: state.firebase,
    auth: state.firebase.auth,
    locationProfile: get(state, `firebase.data.locationProfiles.${get(props, 'match.params.locationId', '')}`),
    locationId: get(props, 'match.params.locationId', ''),
    initialValues: createInitialValues(state, props)
  }),
  { ...accountActions, ...profileActions, ...locationActions },
)(WrappedEditLocationProfile))

