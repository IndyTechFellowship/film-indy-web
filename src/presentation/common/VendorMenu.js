import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'

class VendorMenu extends React.Component {
  render() {
    const { vendors } = this.props
    if (vendors) {
      const menuItems = Object.keys(vendors).map((key) => {
        const vendor = vendors[key]
        return (
          <MenuItem primaryText={vendor.name} />
        )
      })
      return (
        <MenuItem
          primaryText="Vendors"
          leftIcon={<ArrowDropLeft />}
          menuItems={menuItems}
        />)
    }
    return null
  }
}

VendorMenu.propTypes = {
  vendors: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.shape({
      creator: PropTypes.string,
      name: PropTypes.string
    }))
  ]).isRequired
}

VendorMenu.defaultProps = {
  vendors: PropTypes.any
}

export default VendorMenu
