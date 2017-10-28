import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { GridList } from 'material-ui/GridList'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import { get, take } from 'lodash'
import PropTypes from 'prop-types'
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
    const { enriched, location, totalHits, searchForCrew, offset, length, history } = this.props
    const parsed = QueryString.parse(location.search)
    const query = get(parsed, 'query', ' ')
    const showOnly = get(parsed, 'show', 'all')
    if (showOnly === 'all') {
      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
            <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Crew </h1>
            {showOnly === 'all' ?
              <RaisedButton
                label="See More"
                labelColor="white"
                backgroundColor={'#38b5e6'}
                onClick={() => {
                  history.push({ pathname: '/search', search: `?query=${encodeURIComponent(query)}&show=crew` })
                }}
                style={{ marginRight: 225, backgroundColor: '#38b5e6' }}
              />
              : null }
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            <GridList style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}padding={4}>
              {take(enriched, 4).map((enrichedResult, i) => (
                <Card key={enrichedResult.objectID} containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row' }} style={{ width: 400, height: 150, marginRight: 20, borderRadius: 10, marginLeft: i === 0 ? 30 : 0 }}>
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
    } else if (showOnly === 'crew') {
      const hasMore = totalHits.hasLoaded && totalHits.profiles !== 0 && totalHits.names !== 0
      // console.log(hasMore)
      return (
        <div style={{ marginTop: 15 }}>
          <MasonryInfiniteScroller
            hasMore
            sizes={[
              { columns: 1, gutter: 5 },
              { columns: 2, mq: '900px', gutter: 10 },
              { columns: 4, mq: '1200px', gutter: 40 }
            ]}
            pageStart={1}
            loadMore={() => {
              if (hasMore) {
                searchForCrew(query, offset + length)
              }
            }}
          >
            {enriched.map(enrichedResult => (
              <Card key={enrichedResult.objectID} containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row' }} style={{ width: 400, height: 150, marginRight: 20, borderRadius: 10, marginLeft: 30 }}>
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
          </MasonryInfiniteScroller>
        </div>
      )
    }
    return (
      <div> test </div>
    )
  }
}

Search.propTypes = {
  searchForCrew: PropTypes.func.isRequired,
  resetAndSearch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  enriched: PropTypes.arrayOf(PropTypes.object).isRequired,
  offset: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  totalHits: PropTypes.shape({
    profiles: PropTypes.number,
    names: PropTypes.number
  }).isRequired
}

Search.defaultProps = {
}

export default Search
