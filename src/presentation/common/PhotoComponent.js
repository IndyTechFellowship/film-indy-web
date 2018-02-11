import React from 'react'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const cont = {
  overflow: 'hidden',
  float: 'left',
  position: 'relative'
}

const SelectedImage = ({ index, onClick, photo, margin }) => (
  <div style={{ margin, width: photo.width, ...cont }}>
    <IconButton onClick={e => onClick(e, { index, photo })}>
      <DeleteIcon />
    </IconButton>
    <img alt="" {...photo} />
  </div>
)

export default SelectedImage
