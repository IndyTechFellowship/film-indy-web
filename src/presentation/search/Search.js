import React from 'react'
import QueryString from 'query-string'
import '../../App.css'

const Search = (props) => {
  const parsed = QueryString.parse(props.location.search)
  const query = parsed.query
  return (
    <div>
      {`You searched ${query}`}
    </div>
  )
}

Search.propTypes = {

}

Search.defaultProps = {
}

export default Search
