import React from 'react'
import QueryString from 'query-string'
import '../../App.css'

const Search = (props) => {
  console.log(props)
  const parsed = QueryString.parse(props.location.search)
  const query = parsed.query
  const searchResults = props.profileIndex.search(query).then((content) => {
    console.log(content)
  })
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
