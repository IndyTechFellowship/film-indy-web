import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Dropzone from 'react-dropzone'
import Gallery from 'react-photo-gallery'
import PhotoComponent from '../common/PhotoComponent'

const getMeta = url => new Promise(((resolve) => {
  const img = new Image()
  img.src = url
  img.onload = function () {
    resolve({ width: this.width, height: this.height, url })
  }
}))


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
    const uploadPromises = files.map(file => uploadFile(fbFilePath, file)
      .then(response =>
        response.uploadTaskSnaphot.downloadURL
      ))
    const sizePromises = Promise.all(uploadPromises).then(urls => Promise.all(urls.map(getMeta)))
    sizePromises.then(results => updateLocationProfile({ displayImages: [...displayImages, ...results] }, locationId))
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
            const newImages = displayImages.filter(image => image.url !== event.photo.src)
            updateLocationProfile({ displayImages: newImages }, locationId)
          }}
          ImageComponent={PhotoComponent}
          colums={10}
          photos={displayImages.map(image => ({ src: image.url, height: image.height, width: image.width }))}
        />
        <Dropzone onDrop={this.uploadImages} style={{ width: '100%', height: 200, borderWidth: 2, borderColor: 'rgb(102,102,102)', borderStyle: 'dashed', borderRadius: 5 }}>
          <p>Click to upload files, or drag them here</p>
        </Dropzone>
      </Dialog>
    )
  }
}

ManagePhotosModal.propTypes = {
  displayImages: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  })).isRequired,
  locationId: PropTypes.string.isRequired,
  fbFilePath: PropTypes.string.isRequired,
  uploadFile: PropTypes.func.isRequired,
  updateLocationProfile: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ManagePhotosModal

