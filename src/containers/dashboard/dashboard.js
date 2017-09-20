import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { get } from 'lodash'

const Dashboard = (props) => {
  const { firebase: { updateProfile, uploadFile }, auth } = props
  const email = get(auth, 'email', '')
  return (
    <div>
      <h1>{`hello ${email}`}</h1>
      <input
        name="myFile"
        type="file"
        onChange={(event) => {
          const uid = get(auth, 'uid')
          const file = event.target.files[0]
          const fbFilePath = `/images/users/account/${uid}/account_image`
          uploadFile(fbFilePath, file).then((response) => {
            const downloadUrl = response.downloadURL
            updateProfile({
              photoURL: downloadUrl,
            })
          })
        }}
      />
    </div>
  )
}

Dashboard.propTypes = {
  firebase: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    email: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
}

const wrappedDashboard = firebaseConnect()(Dashboard)

export default withRouter(connect(
  state => ({ account: state.account, firebase: state.firebase, auth: state.firebase.auth }),
  { },
)(wrappedDashboard))
