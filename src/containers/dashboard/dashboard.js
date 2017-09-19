import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import { get } from 'lodash'

const Dashboard = (props) => {
  const email = get(props.firebase.auth(), 'currentUser.email', '')
  return (
    <div>
      <h1>{`hello ${email}`}</h1>
      <input
        name="myFile"
        type="file"
        onChange={(event) => {
          const uid = get(props.firebase.auth(), 'currentUser.uid')
          const file = event.target.files[0]
          const fbFilePath = `/images/users/account/${uid}/account_image`
          props.firebase.uploadFile(fbFilePath, file).then((response) => {
            const downloadUrl = response.downloadURL
            props.firebase.updateProfile({
              photoURL: downloadUrl,
            })
          })
        }}
      />
    </div>
  )
}

const wrappedDashboard = firebaseConnect()(Dashboard)

export default withRouter(connect(
  state => ({ account: state.account, firebase: state.firebase }),
  { },
)(wrappedDashboard))
