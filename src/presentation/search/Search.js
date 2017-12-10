import React from 'react'
import QueryString from 'query-string'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import FilterBar from './FilterBar'
import SearchBody from './SearchBody'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { resetAndSearch, location } = this.props
    const parsed = QueryString.parse(location.search)
    const query = parsed.query
    const searchType = get(parsed, 'type', 'plain')
    const rolesToFilter = get(parsed, 'role', [])
    const roleFilters = typeof (rolesToFilter) === 'string' ? [{ type: 'role', role: rolesToFilter }] : rolesToFilter.map(role => ({
      type: 'role',
      role
    }))
    resetAndSearch(query, roleFilters)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const { resetAndSearch } = this.props
      const parsed = QueryString.parse(nextProps.location.search)
      const query = get(parsed, 'query', ' ')
      resetAndSearch(query)
    }
  }
  render() {
    console.log(this.props)
    const { history, addRoleSearchFilter, removeRoleSearchFilter, roleFilters } = this.props
    console.log(roleFilters)
    return (
      <div>
        <FilterBar history={history} addRoleSearchFilter={addRoleSearchFilter} removeRoleSearchFilter={removeRoleSearchFilter} roleFilters={roleFilters} />
        <SearchBody {...this.props} />
      </div>
    )
  }
}

export default Search
