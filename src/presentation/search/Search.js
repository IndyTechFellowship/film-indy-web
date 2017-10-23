import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { GridList } from 'material-ui/GridList'
import { get, take } from 'lodash'
import PropTypes from 'prop-types'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { searchForCrew, location } = this.props
    const parsed = QueryString.parse(location.search)
    const query = parsed.query
    searchForCrew(query)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const { searchForCrew } = this.props
      const parsed = QueryString.parse(nextProps.location.search)
      const query = parsed.query
      searchForCrew(query)
    }
  }
  render() {
    const { enriched } = this.props
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
          <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Crew </h1>
          <RaisedButton label="See More" labelColor="white" backgroundColor={'#38b5e6'} style={{ marginRight: 225, backgroundColor: '#38b5e6' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <GridList style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}padding={4}>
            {take(enriched, 5).map((enrichedResult, i) => (
              <Card key={enrichedResult.objectID} containerStyle={{ width: 400, paddingBottom: 0, display: 'flex', flexDirection: 'row' }} style={{ width: 400, height: 150, marginRight: 20, borderRadius: 10, marginLeft: i === 0 ? 30 : 0 }}>
                <CardMedia>
                  <img src={get(enrichedResult, 'photoURL', 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png')} alt="" style={{ width: 150, height: 150, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} />
                </CardMedia>
                <div>
                  <CardText style={{ fontSize: 25 }}>
                    {`${get(enrichedResult, 'firstName', '')} ${get(enrichedResult, 'lastName', '')}`}
                  </CardText>
                  <CardText>
                Headline
                  </CardText>
                </div>
              </Card>
            ))}
          </GridList>
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  searchIndex: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  enriched: PropTypes.arrayOf(PropTypes.object).isRequired
}

Search.defaultProps = {
}

export default Search
