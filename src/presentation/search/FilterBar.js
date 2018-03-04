import React from 'react'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'
import Popover from 'react-simple-popover'
import InputRange from 'react-input-range'
import QueryString from 'query-string'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import 'react-input-range/lib/css/index.css'
import SearchAndSelectRoles from '../common/SearchAndSelectRoles'

class FilterBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { menuOpen: false, experienceMenuOpen: false, experience: { min: 0, max: 30 }, applyExperienceFilter: false }
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.openExperienceMenu = this.openExperienceMenu.bind(this)
    this.closeExperienceMenu = this.closeExperienceMenu.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    const { experienceFilter } = nextProps
    if (experienceFilter.min >= 0 && experienceFilter.max >= 0) {
      this.setState({ experience: { min: experienceFilter.min, max: experienceFilter.max }, applyExperienceFilter: true })
    }
  }
  openMenu(event) {
    event.preventDefault()
    this.setState({ menuOpen: true, anchorEl: event.currentTarget })
  }
  closeMenu() {
    this.setState({ menuOpen: false })
  }
  openExperienceMenu(event) {
    event.preventDefault()
    this.setState({ experienceMenuOpen: true, anchorEl: event.currentTarget })
  }
  closeExperienceMenu() {
    this.setState({ experienceMenuOpen: false })
  }
  render() {
    const { menuOpen, experienceMenuOpen, applyExperienceFilter, experience } = this.state
    const { history, addRoleSearchFilter, removeRoleSearchFilter, roleFilters, onExperienceFilterChange } = this.props
    return (
      <Paper>
        <Toolbar style={{ backgroundColor: '#FFFFF' }}>
          <ToolbarGroup style={{ marginLeft: 220 }}>
            <div role="button" style={{ color: 'black' }} onClick={this.openMenu} >
              <ToolbarTitle text="Roles" />
              {
                menuOpen ?
                  (<NavigationExpandLessIcon style={{ color: 'black', verticalAlign: 'text-bottom' }} />)
                  : (<NavigationExpandMoreIcon style={{ color: 'black', verticalAlign: 'text-bottom' }} />)
              }
              <Popover
                placement="bottom"
                container={this}
                target={this.state.anchorEl}
                show={menuOpen}
                onHide={this.closeMenu}
              >
                <Paper style={{ marginTop: 125, position: 'fixed', zIndex: 2100, overflowY: 'auto' }}>
                  <SearchAndSelectRoles
                    page="search"
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
            <div role="button" style={{ color: 'black', marginLeft: 10 }} onClick={this.openExperienceMenu} >
              <ToolbarTitle text="Experience" />
              {
                experienceMenuOpen ?
                  (<NavigationExpandLessIcon style={{ color: 'black', verticalAlign: 'text-bottom' }} />)
                  : (<NavigationExpandMoreIcon style={{ color: 'black', verticalAlign: 'text-bottom' }} />)
              }
              <Popover
                placement="bottom"
                container={this}
                target={this.state.anchorEl}
                show={experienceMenuOpen}
                onHide={this.closeExperienceMenu}
              >
                <Paper style={{ marginTop: 125, position: 'fixed', zIndex: 2100, overflowY: 'auto' }}>
                  <h4 style={{ fontWeight: 300, fontSize: 18 }}>
                    {`< ${this.state.experience.min} years - ${this.state.experience.max >= 30 ? '30+' : this.state.experience.max} years`}
                  </h4>
                  <div style={{ width: 400, height: 70, marginLeft: 60, marginRight: 60, marginTop: 40 }}>
                    <InputRange
                      formatLabel={(value) => {
                        if (value >= 30) {
                          return '30+'
                        }
                        return value
                      }}
                      style={{ width: '50%' }}
                      minValue={0}
                      maxValue={30}
                      value={this.state.experience}
                      onChange={(value) => {
                        const parsedQs = QueryString.parse(window.location.search)
                        const expMin = value.min
                        const expMax = value.max >= 30 ? 100 : value.max
                        const newQs = QueryString.stringify({ ...parsedQs, expMin, expMax })
                        history.push({ pathname: '/search', search: newQs })
                        this.setState({ experience: value, applyExperienceFilter: true })
                        onExperienceFilterChange(value)
                      }}
                    />
                  </div>
                  <Toggle
                    label="Apply"
                    style={{ width: '20%', paddingBottom: 10 }}
                    toggled={applyExperienceFilter}
                    onToggle={() => {
                      const parsedQs = QueryString.parse(window.location.search)
                      if (applyExperienceFilter) {
                        const newQs = QueryString.stringify({ ...parsedQs, expMin: undefined, expMax: undefined })
                        history.push({ pathname: '/search', search: newQs })
                      } else {
                        const newQs = QueryString.stringify({ ...parsedQs, expMin: experience.min, expMax: experience.max })
                        history.push({ pathname: '/search', search: newQs })
                      }
                      this.setState({ applyExperienceFilter: !applyExperienceFilter })
                    }}
                  />
                </Paper>
              </Popover>
            </div>
          </ToolbarGroup>
        </Toolbar>
      </Paper>
    )
  }
}

FilterBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  removeRoleSearchFilter: PropTypes.func.isRequired,
  addRoleSearchFilter: PropTypes.func.isRequired,
  onExperienceFilterChange: PropTypes.func.isRequired,
  onExperienceFilterApplyToggle: PropTypes.func.isRequired,
  roleFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  experienceFilter: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number
  }).isRequired
}

export default FilterBar
