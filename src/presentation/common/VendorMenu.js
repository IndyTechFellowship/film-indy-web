import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router-dom'
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'

const VendorMenu = ({ vendors, onAddVendorClick }) => {
  if (vendors) {
    const menuItems = Object.keys(vendors).map((key) => {
      const vendor = vendors[key]
      return (
        <Link to={`/vendor/${key}`}> <MenuItem primaryText={vendor.name} /> </Link>
      )
    })
    const moreMenuItems = [
      ...menuItems,
      <MenuItem primaryText="Add Vendor" onClick={onAddVendorClick} />
    ]
    return (
      <MenuItem
        primaryText="Vendors"
        leftIcon={<ArrowDropLeft />}
        menuItems={moreMenuItems}
      />)
  }
  return null
}

VendorMenu.propTypes = {
  onAddVendorClick: PropTypes.func.isRequired,
  vendors: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.shape({
      creator: PropTypes.string,
      name: PropTypes.string
    }))
  ])
}

VendorMenu.defaultProps = {
  vendors: PropTypes.any
}

export default VendorMenu
