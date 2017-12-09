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
    resetAndSearch(query)
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
    return (
      <div>
        <FilterBar />
        <SearchBody {...this.props} />
      </div>
    )
  }
}

export default Search
