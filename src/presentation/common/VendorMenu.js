import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router-dom'
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'

class VendorMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  }

  handleClick(event) {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose() {
    this.setState({
      open: false
    })
  }

  render() {
    const { vendors, onAddVendorClick, closeDropdown } = this.props
    const menuItems = Object.keys(vendors || []).map((key) => {
      const location = vendors[key]
      return (
        <Link onClick={closeDropdown} to={`/vendor/${key}`}> <MenuItem primaryText={location.name} /> </Link>
      )
    })
    return (
      <div>
        <div
          className="locationMenu"
          style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 16, height: 48 }}
          role="button"
          onClick={this.handleClick}
        >
          <ArrowDropLeft />
          <div style={{ marginLeft: 32 }}>
            Vendors
          </div>
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            {menuItems}
            <MenuItem primaryText="Add Location" onClick={onAddVendorClick} />
          </Menu>
        </Popover>
      </div>
    )
  }
}


VendorMenu.propTypes = {
  closeDropdown: PropTypes.func.isRequired,
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
