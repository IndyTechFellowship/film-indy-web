import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router-dom'
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'

const LocationMenu = ({ locations, onAddLocationClick }) => {
  const defaultMenu = [
    <MenuItem primaryText="Add Location" onClick={onAddLocationClick} />
  ]
  if (locations) {
    const menuItems = Object.keys(locations).map((key) => {
      const location = locations[key]
      return (
        <Link to={`/location/${key}`}> <MenuItem primaryText={location.name} /> </Link>
      )
    })
    const moreMenuItems = [
      ...menuItems,
      ...defaultMenu
    ]
    return (
      <MenuItem
        primaryText="Locations"
        leftIcon={<ArrowDropLeft />}
        menuItems={moreMenuItems}
      />)
  }
  return (
    <MenuItem
      primaryText="Locations"
      leftIcon={<ArrowDropLeft />}
      menuItems={defaultMenu}
    />
  )
}

LocationMenu.propTypes = {
  onAddLocationClick: PropTypes.func.isRequired,
  locations: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.shape({
      creator: PropTypes.string,
      name: PropTypes.string
    }))
  ])
}

LocationMenu.defaultProps = {
  locations: PropTypes.any
}

export default LocationMenu
