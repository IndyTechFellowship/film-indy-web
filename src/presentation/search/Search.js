import React from 'react'
import QueryString from 'query-string'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { get } from 'lodash'
import '../../App.css'

class Search extends React.Component {
  componentWillMount() {
    const { searchIndex } = this.props
    const parsed = QueryString.parse(this.props.location.search)
    const query = parsed.query
    searchIndex('profiles', query, 'userAccount')
  }
  render() {
    console.log(this.props.enriched)
    const parsed = QueryString.parse(this.props.location.search)
    const query = parsed.query
    return (
      <div>
        {`Results for: ${query}`}
        <div style={{ textAlign: 'left', paddingLeft: 40 }}>
          <h1> Crew </h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', paddingLeft: 40 }}>
          {this.props.enriched.map(enriched => (
            <Card key={enriched.objectID} containerStyle={{ width: 220, paddingBottom: 0, display: 'flex', flexDirection: 'row' }} style={{ width: 400, borderRadius: 10 }}>
              <CardMedia>
                <img src={get(enriched, 'photoURL', 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png')} alt="" />
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
