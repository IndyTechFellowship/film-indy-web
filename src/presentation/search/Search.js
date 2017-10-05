import React from 'react'
import QueryString from 'query-string'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { get } from 'lodash'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { searchIndex } = this.props
    const parsed = QueryString.parse(this.props.location.search)
    const query = parsed.query
    searchIndex('profiles', query, 'userAccount')
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const { searchIndex } = this.props
      const parsed = QueryString.parse(nextProps.location.search)
      const query = parsed.query
      searchIndex('profiles', query, 'userAccount')
    }
  }
  render() {
    const parsed = QueryString.parse(this.props.location.search)
    const query = parsed.query
    return (
      <div>
        {`Results for: ${query}`}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 }}>
          <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Crew </h1>
          <RaisedButton label="See More" backgroundColor={'#38b5e6'} style={{ marginRight: 500, backgroundColor: '#38b5e6' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', paddingLeft: 40 }}>
          {this.props.enriched.map(enriched => (
            <Card key={enriched.objectID} containerStyle={{ width: 400, paddingBottom: 0, display: 'flex', flexDirection: 'row' }} style={{ width: 500, height: 300, marginRight: 20, borderRadius: 10 }}>
              <CardMedia>
                <img src={get(enriched, 'photoURL', 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png')} alt="" style={{ width: 300, height: 300, borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }} />
              </CardMedia>
              <div>
                <CardText style={{ fontSize: 25 }}>
                  {`${get(enriched, 'firstName', '')} ${get(enriched, 'lastName', '')}`}
                </CardText>
                <CardText>
                Headline
                </CardText>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
}

Search.propTypes = {

}

Search.defaultProps = {
}

export default Search
