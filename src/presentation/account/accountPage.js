import React from 'react'


import PropTypes from 'prop-types'
import { get } from 'lodash'

// Material UI Imports
import Avatar from 'material-ui/Avatar'
import { Card, CardTitle } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import CameraIcon from 'material-ui/svg-icons/image/photo-camera'
import UploadIcon from 'material-ui/svg-icons/file/file-upload'

import '../../App.css'
import './accountPage.css'

const accountPage = (props) => {
      const { profile, firebase, auth } = this.props
      const photoURL = get(profile, 'photoURL', '')
      const email = get(auth, 'email')
      const displayName = get(profile, 'displayName')
      const uid = get(auth, 'uid')
      return (
        <div>
          <h1>Account Settings</h1>
          <Card className="profileCard" >
            <CardTitle title="Your Profile" />
            <Divider />
            <div className="imageWrapper">
              <Avatar className="accountImage" src={photoURL} size={150} />
              <CameraIcon className="cameraIcon" color="white" />
              <FlatButton className="imageText" icon={<UploadIcon />} label="Upload Picture" labelPosition="before" containerElement="label">
                <FileUploader uid={uid} uploadFile={firebase.uploadFile} updateProfile={firebase.updateProfile} />
              </FlatButton>
            </div>
            <ul className="fields">
              <li>
                  <TextField
                      className="profileField"
                      hintText="Enter your name"
                      floatingLabelText="Name"
                      defaultValue={displayName}
                      value={this.state.currentName}
                      onChange={this.handleNameChange}
                      type="text"
                   />
              </li>
              <li>
                  <TextField
                      className="profileField"
                      hintText="Enter your email"
                      floatingLabelText="Email"
                      defaultValue={email}
                      value={this.state.currentEmail}
                      onChange={this.handleEmailChange}
                      type="text"
                   />
              </li>
            </ul>
            <RaisedButton className="accountButton" primary label="Save"/>
            {/* <RaisedButton className="accountButton" primary label="Save" onClick={firebase.updateProfile({displayName: this.state.currentName, email: this.state.email })}/> */}
          </Card>
          <Card className="passwordCard">
            <CardTitle title="Reset Password" />
            <Divider />
            <ul className="fields">
              <li><TextField hintText="New Password" floatingLabelText="Password" type="password" /></li>
              <li><TextField hintText="Confirm Password" floatingLabelText="Confirm Password" type="password" /></li>
            </ul>
            <RaisedButton className="accountButton" primary label="Submit" />
          </Card>
        </div>
      )
}

const FileUploader = props => (
  <input
    name="myFile"
    type="file"
    style={{ display: 'none' }}
    onChange={(event) => {
      const { uid, uploadFile, updateProfile } = props
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
)

FileUploader.propTypes = {
  uid: PropTypes.string,
  uploadFile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
}

FileUploader.defaultProps = {
  uid: '',
}

accountPage.propTypes = {
  profile: PropTypes.shape({
    photoURL: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  firebase: PropTypes.shape({
    updateProfile: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
  }).isRequired,
}

accountPage.defaultProps = {
}

export default accountPage
