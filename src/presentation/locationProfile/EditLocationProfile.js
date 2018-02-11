import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import { Card, CardTitle } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import LinkIcon from 'material-ui/svg-icons/content/link'
import { FormControl } from 'material-ui-next/Form'
import { InputLabel } from 'material-ui-next/Input'
import { MenuItem } from 'material-ui-next/Menu'
import { Link } from 'react-router-dom'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace'
import RenderSelectField from './CustomSelect'
import AddLinkForm from '../profile/AddLinkForm'
import EditLinkForm from '../profile/EditLinkForm'
import AddVideoForm from '../profile/AddVideoForm'
import EditVideoForm from '../profile/EditVideoForm'
import YoutubeIcon from '../profile/YoutubeLogo'
import VimeoIcon from '../profile/VimeoLogo'
import ManagePhotosModal from '../common/ManagePhotosModal'
import States from './States'
import Gallery from '../common/Gallery'
import './EditLocationProfile.css'


const styles = {
  card: {
    width: '40%',
    height: 'auto',
    marginTop: '1em',
    display: 'block',
    margin: 'auto',
    padding: '1em'
  },
  chipStyle: {
    margin: 6
  }
}

const renderTextField = ({ input, name, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    hintStyle={{ float: 'left' }}
    textareaStyle={{ float: 'left' }}
    floatingLabelText={label}
    errorText={touched && error}
    multiLine={input.name === 'bio'}
    fullWidth
    {...input}
    {...custom}
  />
)
class EditLocationProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      dialogOpen: false,
      updated: false,
      addLinkDialogOpen: false,
      editLinkDialogOpen: false,
      addCreditDialogOpen: false,
      addYoutubeDialogOpen: false,
      addVimeoDialogOpen: false,
      editVideoDialogOpen: false,
      managePhotosDiaglogOpen: false
    })
    this.handleAddLinkClose = this.handleAddLinkClose.bind(this)
    this.handleAddLinkOpen = this.handleAddLinkOpen.bind(this)
    this.handleAddYoutubeClose = this.handleAddYoutubeClose.bind(this)
    this.handleAddYoutubeOpen = this.handleAddYoutubeOpen.bind(this)
    this.handleAddVimeoClose = this.handleAddVimeoClose.bind(this)
    this.handleAddVimeoOpen = this.handleAddVimeoOpen.bind(this)
    this.handleEditLinkClose = this.handleEditLinkClose.bind(this)
    this.handleEditLinkOpen = this.handleEditLinkOpen.bind(this)
    this.handleEditVideoClose = this.handleEditVideoClose.bind(this)
    this.handleEditVideoOpen = this.handleEditVideoOpen.bind(this)
  }

  handleEditLinkClose() {
    this.setState({ editLinkDialogOpen: false })
  }

  handleEditLinkOpen() {
    this.setState({ editLinkDialogOpen: true })
  }

  handleAddLinkClose() {
    this.setState({ addLinkDialogOpen: false })
  }

  handleAddLinkOpen() {
    this.setState({ addLinkDialogOpen: true })
  }
  handleAddYoutubeClose() {
    this.setState({ addYoutubeDialogOpen: false })
  }

  handleAddYoutubeOpen() {
    this.setState({ addYoutubeDialogOpen: true })
  }

  handleAddVimeoClose() {
    this.setState({ addVimeoDialogOpen: false })
  }

  handleAddVimeoOpen() {
    this.setState({ addVimeoDialogOpen: true })
  }

  handleEditVideoOpen() {
    this.setState({ editVideoDialogOpen: true })
  }

  handleEditVideoClose() {
    this.setState({ editVideoDialogOpen: false })
  }
  render() {
    const { locationProfile, locationId, firebase, pristine, submitting, handleSubmit, remoteSubmitForm, initForm,
      addLinkToLocationProfile, removeLocationProfileLink, editLocationProfileLink, addVimeoToLocationProfile, addYoutubeToLocationProfile,
      editLocationVideo, removeLocationVideo, updateLocationProfile } = this.props
    if (locationProfile) {
      const displayImages = get(locationProfile, 'displayImages', [])
      const locationLinks = get(locationProfile, 'links', [])
      const isPublic = get(locationProfile, 'public', false)
      const video = get(locationProfile, 'video', '')[0]
      let videoType = 0
      if (video) videoType = video.url.indexOf('youtube') > -1 ? 1 : 2 // 1 for Youtube, 2 for Vimeo

      const addLinkActions = [
        <FlatButton
          label="Cancel"
          primary
          onClick={this.handleAddLinkClose}
        />,
        <FlatButton
          label="Save"
          primary
          onClick={() => {
            remoteSubmitForm('AddLinkForm')
            this.handleAddLinkClose()
          }}
        />
      ]

      const addYoutubeActions = [
        <FlatButton
          label="Cancel"
          primary
          onClick={this.handleAddYoutubeClose}
        />,
        <FlatButton
          label="Save"
          primary
          onClick={() => {
            remoteSubmitForm('AddVideoForm')
            this.handleAddYoutubeClose()
          }}
        />
      ]

      const addVimeoActions = [
        <FlatButton
          label="Cancel"
          primary
          onClick={this.handleAddVimeoClose}
        />,
        <FlatButton
          label="Save"
          primary
          onClick={() => {
            remoteSubmitForm('AddVideoForm')
            this.handleAddVimeoClose()
          }}
        />
      ]
      return (
        <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'left', marginLeft: 20, marginTop: 5 }}>
            <Link to={`/location/${locationId}`}>
              <FloatingActionButton mini backgroundColor="#FFFFFF">
                <BackIcon style={{ fill: 'black' }} />
              </FloatingActionButton>
            </Link>
          </div>
          <div style={{ paddingTop: 30 }}>
            <Card style={styles.card}>
              <div className="toggleContainer">
                <div className="toggle">
                  <Toggle
                    label="Public"
                    toggled={isPublic}
                    onToggle={(event, toggleValue) => {
                      updateLocationProfile({ public: toggleValue }, locationId)
                    }}
                  />
                </div>
                <div>
                    Just here to search? Turn your profile to "Private" to not appear in other's searches.
                </div>
              </div>
            </Card>
          </div>
          <div style={{ paddingTop: 30 }}>
            <Card style={styles.card}>
              <CardTitle style={{ textAlign: 'left' }}title="Photos" />
              <Gallery
                type="edit"
                photos={displayImages.map(image => ({
                  src: image,
                  height: 3,
                  width: 4
                }))}
              />
              <RaisedButton
                style={{
                  borderRadius: 5,
                  marginTop: 20,
                  marginLeft: 10 }}
                label="Manage Photos"
                onClick={() => this.setState({ managePhotosDiaglogOpen: true })}
              />
              <ManagePhotosModal
                displayImages={displayImages}
                locationId={locationId}
                fbFilePath={`/images/locations/account/${locationId}/account_image`}
                uploadFile={firebase.uploadFile}
                updateLocationProfile={updateLocationProfile}
                open={this.state.managePhotosDiaglogOpen}
                onCancel={() => this.setState({ managePhotosDiaglogOpen: false })}
              />
            </Card>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <Card style={styles.card}>
              <CardTitle style={{ textAlign: 'left' }}title="General" />
              <div style={{ display: 'flex', justifyContent: 'left', paddingTop: 30 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', marginLeft: '25px' }}>
                  <div>
                    <form onSubmit={handleSubmit(values => updateLocationProfile(values, locationId))}>
                      <div>
                        <Field
                          name="name"
                          component={renderTextField}
                          floatingLabelText="Name"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="addressLine1"
                          component={renderTextField}
                          floatingLabelText="Address Line 1"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="addressLine2"
                          component={renderTextField}
                          floatingLabelText="Address Line 2"
                          type="text"
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: 5 }}>
                          <Field
                            name="city"
                            component={renderTextField}
                            floatingLabelText="City"
                            type="text"
                          />
                        </div>
                        <div style={{ marginRight: 5, marginTop: 16 }}>
                          <FormControl style={{ width: 60 }}>
                            <InputLabel htmlFor="state">State</InputLabel>
                            <Field
                              name="state"
                              component={RenderSelectField}
                            >
                              {States.map(state => (
                                <MenuItem key={state.abbreviation} value={state.abbreviation} >
                                  {state.abbreviation}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </div>
                        <div style={{ marginRight: 5 }}>
                          <Field
                            name="zip"
                            component={renderTextField}
                            floatingLabelText="Zip Code"
                            type="text"
                          />
                        </div>
                      </div>
                      <div>
                        <Field
                          name="phone"
                          component={renderTextField}
                          floatingLabelText="Phone Number"
                          type="text"
                        />
                      </div>
                      <div>
                        <Field
                          name="email"
                          component={renderTextField}
                          floatingLabelText="Email Address"
                          type="email"
                        />
                      </div>
                      <div style={{ width: '50%', marginTop: 10 }}>
                        <RaisedButton
                          buttonStyle={{ borderRadius: 5 }}
                          type="submit"
                          primary
                          label="Save"
                          disabled={pristine || submitting}
                          onClick={this.updateMessage}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div style={{ paddingTop: 30 }}>
            <Card style={styles.card}>
              <CardTitle style={{ textAlign: 'left' }} title="About Us" />
              <form onSubmit={handleSubmit(values => updateLocationProfile(values, locationId))}>
                <div>
                  <div>
                    <Field
                      name="aboutUs"
                      component={renderTextField}
                      floatingLabelStyle={{ display: 'flex' }}
                      floatingLabelText="About Us"
                      type="text"
                      multiLine
                      rows={3}
                    />
                  </div>
                </div>
                <RaisedButton
                  buttonStyle={{ borderRadius: 5 }}
                  type="submit"
                  className="accountButton"
                  primary
                  label="Save"
                  disabled={pristine || submitting}
                  style={{ marginBottom: '10px' }}
                  onClick={this.updateMessage}
                />
              </form>
            </Card>
          </div>
          <div style={{ paddingTop: 30 }}>
            <Card className="profile-card big-card" style={styles.card}>
              <CardTitle title="Links" style={{ textAlign: 'left' }} />
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingTop: 5 }}>
                {locationLinks.map((link, i) => (
                  <RaisedButton
                    backgroundColor="#4A90E2"
                    labelColor="#fff"
                    labelPosition="before"
                    icon={<EditIcon />}
                    label={link.title}
                    buttonStyle={{ borderRadius: 5 }}
                    style={{ marginRight: 5 }}
                    key={link.title}
                    onClick={() => {
                      initForm('EditLinkForm', { title: link.title, url: link.url })
                      this.handleEditLinkOpen()
                    }}
                  >
                    <Dialog
                      title="Edit a Link"
                      actions={
                        [
                          <FlatButton
                            label="Cancel"
                            primary
                            onClick={this.handleEditLinkClose}
                          />,
                          <FlatButton
                            label="Save"
                            primary
                            onClick={() => {
                              remoteSubmitForm('EditLinkForm')
                              this.handleEditLinkClose()
                            }}
                          />
                        ]
                      }
                      modal
                      open={this.state.editLinkDialogOpen}
                    >
                      <EditLinkForm
                        onSubmit={(values) => {
                          editLocationProfileLink(locationLinks, i, values.title, values.url, locationId)
                        }}
                        onDelete={() => {
                          removeLocationProfileLink(locationLinks, i, locationId)
                          this.handleEditLinkClose()
                        }}
                        initialValues={{ title: link.title, url: link.url }}
                      />
                    </Dialog>
                  </RaisedButton>
                ))}
              </div>
              <div>
                <RaisedButton
                  style={{ border: 'solid 2px #4A90E2', borderRadius: 5, marginTop: 10 }}
                  label="Add Link"
                  icon={<LinkIcon />}
                  onClick={this.handleAddLinkOpen}
                >
                  <Dialog
                    title="Add a Link"
                    actions={addLinkActions}
                    modal={false}
                    open={this.state.addLinkDialogOpen}
                    onRequestClose={this.handleAddLinkClose}
                  >
                    <AddLinkForm userLinks={locationLinks} onSubmit={values => addLinkToLocationProfile(locationLinks, values.title, values.url, locationId)} />
                  </Dialog>
                </RaisedButton>
              </div>
            </Card>
          </div>

          <div style={{ paddingTop: 30 }}>
            <Card className="profile-card big-card" style={styles.card}>
              <CardTitle style={{ textAlign: 'left' }} title="Featured Video" />
              { video ? (
                <RaisedButton
                  backgroundColor="#4A90E2"
                  labelColor="#fff"
                  labelPosition="before"
                  icon={<EditIcon />}
                  label={video.title}
                  buttonStyle={{ borderRadius: 5 }}
                  style={{ marginRight: 5 }}
                  key={video.title}
                  onClick={() => {
                    initForm('EditVideoForm', { title: video.title, url: video.url })
                    this.handleEditVideoOpen()
                  }}
                >
                  <Dialog
                    title="Edit a Video"
                    actions={
                      [
                        <FlatButton
                          label="Cancel"
                          primary
                          onClick={this.handleEditVideoClose}
                        />,
                        <FlatButton
                          label="Save"
                          primary
                          onClick={() => {
                            remoteSubmitForm('EditVideoForm')
                            this.handleEditVideoClose()
                          }}
                        />
                      ]
                    }
                    modal
                    open={this.state.editVideoDialogOpen}
                  >
                    <EditVideoForm
                      onSubmit={(values) => {
                        editLocationVideo(video, values.title, values.url, locationId)
                      }}
                      onDelete={() => {
                        removeLocationVideo(video, videoType, locationId)
                        this.handleEditVideoClose()
                      }}
                      initialValues={{ title: video.title, url: video.url }}
                    />
                  </Dialog>
                </RaisedButton>
              ) : (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                Where is your video?
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <RaisedButton
                      onClick={this.handleAddYoutubeOpen}
                      style={{ height: 90, width: 120, marginRight: 10 }}
                      icon={<YoutubeIcon style={{ height: 80, width: 100 }} />}
                    >
                      <Dialog
                        title="Add a Youtube video"
                        actions={addYoutubeActions}
                        modal
                        open={this.state.addYoutubeDialogOpen}
                      >
                        <AddVideoForm onSubmit={values => addYoutubeToLocationProfile(video, values.title, values.url, locationId)} />
                      </Dialog>
                    </RaisedButton>
                    <RaisedButton
                      onClick={this.handleAddVimeoOpen}
                      style={{ height: 90, width: 120 }}
                      icon={<VimeoIcon style={{ height: 80, width: 100 }} />}
                    >
                      <Dialog
                        title="Add a Vimeo video"
                        actions={addVimeoActions}
                        modal
                        open={this.state.addVimeoDialogOpen}
                      >
                        <AddVideoForm onSubmit={values => addVimeoToLocationProfile(video, values.title, values.url, locationId)} />
                      </Dialog>
                    </RaisedButton>
                  </div>
                </div>)
              }
            </Card>
          </div>

        </div>
      )
    }
    return null
  }
}

EditLocationProfile.propTypes = {
  locationProfile: PropTypes.shape({
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string
  }),
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  locationId: PropTypes.string.isRequired,
  remoteSubmitForm: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  editLocationProfileLink: PropTypes.func.isRequired,
  removeLocationProfileLink: PropTypes.func.isRequired,
  addLinkToLocationProfile: PropTypes.func.isRequired,
  addYoutubeToLocationProfile: PropTypes.func.isRequired,
  addVimeoToLocationProfile: PropTypes.func.isRequired,
  removeLocationVideo: PropTypes.func.isRequired,
  editLocationVideo: PropTypes.func.isRequired,
  updateLocationProfile: PropTypes.func.isRequired
}

EditLocationProfile.defaultProps = {
  locationProfile: undefined
}

const EditLocationProfileFormEnriched = reduxForm({
  form: 'UpdateLocationProfile',
  enableReinitialize: true
})(EditLocationProfile)

export default EditLocationProfileFormEnriched
