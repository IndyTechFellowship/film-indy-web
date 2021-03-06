import React from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import LinkIcon from 'material-ui/svg-icons/image/photo-library'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images'
import './Gallery.css'

class PhotoGallery extends React.Component {
  constructor() {
    super()
    this.state = { currentImage: 0 }
    this.closeLightbox = this.closeLightbox.bind(this)
    this.openLightbox = this.openLightbox.bind(this)
    this.gotoNext = this.gotoNext.bind(this)
    this.gotoPrevious = this.gotoPrevious.bind(this)
  }
  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    })
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    })
  }
  gotoPrevious() {
    const { photos } = this.props
    this.setState({
      currentImage: (this.state.currentImage - 1) % photos.length
    })
  }
  gotoNext() {
    const { photos } = this.props
    this.setState({
      currentImage: (this.state.currentImage + 1) % photos.length
    })
  }
  render() {
    const { lightboxIsOpen } = this.state
    const { photos, type } = this.props
    return (
      <div>
        <Gallery margin={0} photos={photos.slice(0, 2)} onClick={this.openLightbox} colums={2} />
        {
          photos.length > 1 ? (
            <RaisedButton
              style={{
                borderRadius: 5,
                marginTop: -60,
                position: 'absolute',
                left: type === 'view' ? '26%' : '32%' }}
              label="View Photos"
              icon={<LinkIcon />}
              onClick={() => this.openLightbox(null, { index: 0 })}
            />
          ) : null
        }
        <Lightbox
          onClickThumbnail={i => this.setState({ currentImage: i })}
          showThumbnails
          backdropClosesModal
          currentImage={this.state.currentImage}
          images={photos}
          isOpen={lightboxIsOpen}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
        />
      </div>
    )
  }
}

PhotoGallery.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  })).isRequired,
  type: PropTypes.string.isRequired
}

export default PhotoGallery
