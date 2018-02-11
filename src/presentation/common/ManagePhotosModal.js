import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Dropzone from 'react-dropzone'
import Gallery from 'react-photo-gallery'
import PhotoComponent from '../common/PhotoComponent'


class ManagePhotosModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, uploadedPhotos: [] }
    this.handleClose = this.handleClose.bind(this)
    this.uploadImages = this.uploadImages.bind(this)
  }


  handleClose() {
    const { onCancel } = this.props
    onCancel()
  }

  uploadImages(files) {
    const { uploadFile, updateLocationProfile, fbFilePath, locationId, displayImages } = this.props
    files.map(file => uploadFile(fbFilePath, file).then((response) => {
      const downloadUrl = response.uploadTaskSnaphot.downloadURL
      updateLocationProfile({ displayImages: [...displayImages, downloadUrl] }, locationId)
    }))
  }

  render() {
    const { open, displayImages, updateLocationProfile, locationId } = this.props
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary
        onClick={this.handleClose}
      />
    ]

    return (
      <Dialog
        autoScrollBodyContent
        title="Manage Photos"
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose}
      >
        <Gallery
          onClick={(e, event) => {
            const newImages = displayImages.filter(image => image !== event.photo.src)
            updateLocationProfile({ displayImages: newImages }, locationId)
          }}
          ImageComponent={PhotoComponent}
          colums={10}
          photos={displayImages.map(image => ({ src: image, height: 3, width: 4 }))}
        />
        <Dropzone onDrop={this.uploadImages} style={{ border: 'none' }}>
          <RaisedButton label="Upoad Photos" />
        </Dropzone>
      </Dialog>
    )
  }
}

ManagePhotosModal.propTypes = {
  displayImages: PropTypes.arrayOf(PropTypes.string).isRequired,
  locationId: PropTypes.string.isRequired,
  fbFilePath: PropTypes.string.isRequired,
  uploadFile: PropTypes.func.isRequired,
  updateLocationProfile: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ManagePhotosModal

