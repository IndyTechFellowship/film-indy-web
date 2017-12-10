import React from 'react'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Paper from 'material-ui/Paper'
import Popover from 'react-simple-popover'
import QueryString from 'query-string'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import SearchAndSelectRoles from '../common/SearchAndSelectRoles'

class FilterBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { menuOpen: false }
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }
  openMenu(event) {
    event.preventDefault()
    this.setState({ menuOpen: true, anchorEl: event.currentTarget })
  }
  closeMenu() {
    this.setState({ menuOpen: false })
  }
  render() {
    const { menuOpen } = this.state
    const { history, addRoleSearchFilter, removeRoleSearchFilter, roleFilters } = this.props
    return (
      <Toolbar style={{ backgroundColor: '#004b8d' }}>
        <ToolbarGroup>
          <div role="button" style={{ color: 'white' }} onClick={this.openMenu} >
            <ToolbarTitle text="Roles" />
            <NavigationExpandMoreIcon style={{ color: 'white' }} />
            <Popover
              placement="bottom"
              container={this}
              target={this.state.anchorEl}
              show={menuOpen}
              onHide={this.closeMenu}
            >
              <Paper style={{ marginTop: 75, position: 'fixed', zIndex: 2100, overflowY: 'auto' }}>
                <SearchAndSelectRoles
                  roleFilters={roleFilters}
                  onItemSelected={(selectedItem, itemSelected, type) => {
                    const parsedQs = QueryString.parse(window.location.search)
                    const rolesFromQs = get(parsedQs, 'role', [])
                    const roles = typeof (rolesFromQs) === 'string' ? [rolesFromQs] : rolesFromQs
                    if (type === 'add') {
                      addRoleSearchFilter([itemSelected.roleName])
                      const newRoles = [...roles, itemSelected.roleName]
                      const newQs = QueryString.stringify({ ...parsedQs, role: newRoles })
                      history.push({ pathname: '/search', search: newQs })
                    } else if (type === 'remove') {
                      removeRoleSearchFilter(itemSelected.roleName)
                      const newRoles = roles.filter(role => role !== itemSelected.roleName)
                      const newQs = QueryString.stringify({ ...parsedQs, role: newRoles })
                      history.push({ pathname: '/search', search: newQs })
                    }
                  }}
                />
              </Paper>
            </Popover>
          </div>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

FilterBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  removeRoleSearchFilter: PropTypes.func.isRequired,
  addRoleSearchFilter: PropTypes.func.isRequired,
  roleFilters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default FilterBar
