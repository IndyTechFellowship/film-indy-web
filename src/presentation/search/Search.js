import React from 'react'
import QueryString from 'query-string'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import FilterBar from './FilterBar'
import SearchBody from './SearchBody'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { resetAndSearch, location, addRoleSearchFilter, addExperienceSearchFilter } = this.props
    const parsed = QueryString.parse(location.search)
    const query = parsed.query
    const rolesToFilter = get(parsed, 'role', [])
    const expMin = get(parsed, 'expMin')
    const expMax = get(parsed, 'expMax')
    const parsedExpMin = expMin ? Number.parseInt(expMin, 10) : undefined
    const parsedExpMax = expMax ? Number.parseInt(expMax, 10) : undefined
    const experienceFilter = { min: parsedExpMin, max: parsedExpMax }
    const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
      type: 'role',
      role
    }))
    resetAndSearch(query, roleFilters, experienceFilter)
    addExperienceSearchFilter(parsedExpMin, parsedExpMax)
    addRoleSearchFilter(roleFilters.map(filter => filter.role))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const { resetAndSearch, addRoleSearchFilter, addExperienceSearchFilter } = this.props
      const parsed = QueryString.parse(nextProps.location.search)
      const query = get(parsed, 'query', ' ')
      const rolesToFilter = get(parsed, 'role', [])
      const expMin = get(parsed, 'expMin')
      const expMax = get(parsed, 'expMax')
      const parsedExpMin = expMin ? Number.parseInt(expMin, 10) : undefined
      const parsedExpMax = expMax ? Number.parseInt(expMax, 10) : undefined
      const experienceFilter = { min: parsedExpMin, max: parsedExpMax }
      const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
        type: 'role',
        role
      }))
      addRoleSearchFilter(roleFilters.map(filter => filter.role))
      addExperienceSearchFilter(parsedExpMin, parsedExpMax)
      resetAndSearch(query, roleFilters, experienceFilter)
    }
  }
  render() {
    const { history, addRoleSearchFilter, removeRoleSearchFilter, roleFilters, addExperienceSearchFilter, experienceFilter, location } = this.props
    const qs = get(location, 'search', '')
    const parsedQs = QueryString.parse(qs)
    const show = get(parsedQs, 'show', '')
    return (
      <div>
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
        <SearchBody {...this.props} />
      </div>
    )
  }
}

Search.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  removeRoleSearchFilter: PropTypes.func.isRequired,
  addRoleSearchFilter: PropTypes.func.isRequired,
  addExperienceSearchFilter: PropTypes.func.isRequired,
  resetAndSearch: PropTypes.func.isRequired,
  experienceFilter: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number
  }).isRequired,
  roleFilters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Search
