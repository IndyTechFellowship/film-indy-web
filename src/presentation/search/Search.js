import React from 'react'
import QueryString from 'query-string'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import FilterBar from './FilterBar'
import SearchBody from './SearchBody'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { resetAndSearch, location, addRoleSearchFilter } = this.props
    const parsed = QueryString.parse(location.search)
    const query = parsed.query
    const rolesToFilter = get(parsed, 'role', [])
    const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
      type: 'role',
      role
    }))
    resetAndSearch(query, roleFilters)
    addRoleSearchFilter(roleFilters.map(filter => filter.role))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const { resetAndSearch, addRoleSearchFilter } = this.props
      const parsed = QueryString.parse(nextProps.location.search)
      const query = get(parsed, 'query', ' ')
      const rolesToFilter = get(parsed, 'role', [])
      const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
        type: 'role',
        role
      }))
      addRoleSearchFilter(roleFilters.map(filter => filter.role))
      resetAndSearch(query, roleFilters)
    }
  }
  render() {
    const { history, addRoleSearchFilter, removeRoleSearchFilter, roleFilters } = this.props
    return (
      <div>
        <FilterBar history={history} addRoleSearchFilter={addRoleSearchFilter} removeRoleSearchFilter={removeRoleSearchFilter} roleFilters={roleFilters} />
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
  resetAndSearch: PropTypes.func.isRequired,
  roleFilters: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Search
