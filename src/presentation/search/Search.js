import React from 'react'
import QueryString from 'query-string'
import { get } from 'lodash'
import Tabs, { Tab } from 'material-ui-next/Tabs'
import PropTypes from 'prop-types'
import FilterBar from './FilterBar'
import LocationFilterBar from './LocationFilterBar'
import SearchBody from './SearchBody'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { resetAndSearch, location } = this.props
    const parsed = QueryString.parse(location.search)
    const query = parsed.query
    const rolesToFilter = get(parsed, 'role', [])
    const locationTypesToFilter = get(parsed, 'locationType', [])
    const expMin = get(parsed, 'expMin')
    const expMax = get(parsed, 'expMax')
    const parsedExpMin = expMin ? Number.parseInt(expMin, 10) : undefined
    const parsedExpMax = expMax ? Number.parseInt(expMax, 10) : undefined
    const experienceFilter = { min: parsedExpMin, max: parsedExpMax }
    const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
      type: 'role',
      role
    }))
    const locationTypeFilters = typeof (locationTypesToFilter) === 'string' ? [{ type: 'location', locationType: locationTypesToFilter }] : locationTypesToFilter.map(locationType => ({
      type: 'location',
      locationType
    }))
    const qs = get(location, 'search', '')
    const parsedQs = QueryString.parse(qs)
    const show = get(parsedQs, 'show', '')
    resetAndSearch(show, query, roleFilters, experienceFilter, locationTypeFilters)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const { resetAndSearch } = this.props
      const parsed = QueryString.parse(nextProps.location.search)
      const query = get(parsed, 'query', '')
      const rolesToFilter = get(parsed, 'role', [])
      const locationTypesToFilter = get(parsed, 'locationType', [])
      const expMin = get(parsed, 'expMin')
      const expMax = get(parsed, 'expMax')
      const parsedExpMin = expMin ? Number.parseInt(expMin, 10) : undefined
      const parsedExpMax = expMax ? Number.parseInt(expMax, 10) : undefined
      const experienceFilter = { min: parsedExpMin, max: parsedExpMax }
      const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
        type: 'role',
        role
      }))
      const locationTypeFilters = typeof (locationTypesToFilter) === 'string' ? [{ type: 'location', locationType: locationTypesToFilter }] : locationTypesToFilter.map(locationType => ({
        type: 'location',
        locationType
      }))
      const qs = get(nextProps, 'location.search', '')
      const parsedQs = QueryString.parse(qs)
      const show = get(parsedQs, 'show', '')
      resetAndSearch(show, query, roleFilters, experienceFilter, locationTypeFilters)
    }
  }
  render() {
    const {
      history, addRoleSearchFilter, removeRoleSearchFilter,
      addLocationTypeSearchFilter, removeLocationTypeSearchFilter, locationTypeFilters,
      roleFilters, addExperienceSearchFilter, experienceFilter, location } = this.props
    const qs = get(location, 'search', '')
    const parsedQs = QueryString.parse(qs)
    const show = get(parsedQs, 'show', '')
    return (
      <div>
        { location.pathname === '/search' ?
          (
            <div style={{ backgroundColor: '#004b8d' }}>
              <Tabs
                indicatorColor="#38b5e6"
                onChange={(event, value) => {
                  const newQs = QueryString.stringify({ ...parsedQs, show: value })
                  history.push({ pathname: '/search', search: newQs })
                }}
                style={{ backgroundColor: '#004b8d', marginLeft: '8%' }}
                tabItemContainerStyle={{ width: '100%' }}
                value={show}
              >
                <Tab
                  style={{ zIndex: 0, color: '#ffff' }}
                  label="All"
                  value="all"
                  onActive={() => {
                    const newQs = QueryString.stringify({ ...parsedQs, show: 'all' })
                    history.push({ pathname: '/search', search: newQs })
                  }}
                />
                <Tab
                  style={{ zIndex: 0, color: '#ffff' }}
                  label="Crew"
                  value="crew"
                  onActive={() => {
                    const newQs = QueryString.stringify({ ...parsedQs, show: 'crew' })
                    history.push({ pathname: '/search', search: newQs })
                  }}
                />
                <Tab
                  style={{ zIndex: 0, color: '#ffff' }}
                  label="Vendors"
                  value="vendors"
                  onActive={() => {
                    const newQs = QueryString.stringify({ ...parsedQs, show: 'vendors' })
                    history.push({ pathname: '/search', search: newQs })
                  }}
                />
                <Tab
                  style={{ zIndex: 0, color: '#ffff' }}
                  label="Locations"
                  value="locations"
                  onActive={() => {
                    const newQs = QueryString.stringify({ ...parsedQs, show: 'locations' })
                    history.push({ pathname: '/search', search: newQs })
                  }}
                />
              </Tabs>
            </div>

          ) : null }
        {
          show === 'crew' ? (
            <FilterBar
              history={history}
              addRoleSearchFilter={addRoleSearchFilter}
              removeRoleSearchFilter={removeRoleSearchFilter}
              onExperienceFilterChange={({ min, max }) => {
                addExperienceSearchFilter(min, max)
              }}
              onExperienceFilterApplyToggle={() => {
              }}
              roleFilters={roleFilters}
              experienceFilter={experienceFilter}
            />
          ) : null
        }
        {
          show === 'locations' ? (
            <LocationFilterBar
              history={history}
              addLocationTypeSearchFilter={addLocationTypeSearchFilter}
              removeLocationTypeSearchFilter={removeLocationTypeSearchFilter}
              locationTypeFilters={locationTypeFilters}
            />
          ) : null
        }
        <SearchBody {...this.props} show={show} />
      </div>
    )
  }
}

Search.propTypes = {
  browser: PropTypes.shape({
    mediaType: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  removeRoleSearchFilter: PropTypes.func.isRequired,
  addRoleSearchFilter: PropTypes.func.isRequired,
  addLocationTypeSearchFilter: PropTypes.func.isRequired,
  removeLocationTypeSearchFilter: PropTypes.func.isRequired,
  addExperienceSearchFilter: PropTypes.func.isRequired,
  resetAndSearch: PropTypes.func.isRequired,
  experienceFilter: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number
  }).isRequired,
  roleFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  locationTypeFilters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Search
