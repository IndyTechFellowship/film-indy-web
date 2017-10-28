import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { get, take } from 'lodash'
import PropTypes from 'prop-types'
import '../../App.css'

const aboutText = "Bill Murray is an American actor, comedian, and writer. The fifth of nine children, he was born William James Murray in Wilmette, Illinois, to Lucille (Collins), a mailroom clerk, and Edward Joseph Murray II, who sold lumber. He is of Irish descent. Among his siblings are actors Brian Doyle-Murray, Joel Murray, and John Murray. He and most of his siblings worked as caddies, which paid his tuition to Loyola Academy, a Jesuit school. He played sports and did some acting while in that school, but in his words, mostly 'screwed off.'";

class ViewProfile extends React.Component {

  // constructor(props) {
  //   super(props)
  //   this.state = ({
  //     open: false,
  //   })
  // }

  // componentWillMount() {
  //   const { searchForCrew, location } = this.props
  //   const parsed = QueryString.parse(location.search)
  //   const query = parsed.query
  //   searchForCrew(query)
  // }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location.search !== this.props.location.search) {
  //     const { searchForCrew } = this.props
  //     const parsed = QueryString.parse(nextProps.location.search)
  //     const query = parsed.query
  //     searchForCrew(query)
  //   }
  // }

  render() {
    // const { enriched } = this.props
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
          <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Profile </h1>
        </div>
        <div style={{ display: 'block', margin: 'auto' }}>
              <Card class="profile-card small-card" containerStyle={{ width: 800, paddingBottom: 0, display: 'flex', flexDirection: 'row' }}>
                <CardMedia>
                  <img src={'https://static.comicvine.com/uploads/scale_small/3/35374/804803-bill_murray.jpg'} alt="" style={{ width: 150, height: 150, borderBottomLeftRadius: 2, borderTopLeftRadius: 2 }} />
                </CardMedia>
                <div>
                  <CardText class="crew-name" style={{ fontSize: 25 }}>
                    Bill Murray
                  </CardText>
                  <CardText class="crew-headline">
                    I still totally regret doing The Garfield Movie
                  </CardText>
                  <CardText class="crew-text">
                    44 yrs in industry
                  </CardText>                  
                  <CardText class="crew-text">
                   1-800-GHOSTBUSTERS
                  </CardText>
                </div>
              </Card>
              <Card class="profile-card small-card">
                <CardTitle>About Me</CardTitle>
                <CardText>
                  {aboutText}
                </CardText>
                <CardActions>
                  <RaisedButton label="Portfolio" />
                  <RaisedButton label="Resume" />
                  <RaisedButton label="IMDb" />
                </CardActions>
              </Card>             
              <Card class="profile-card large-card">
                <CardTitle>Credits</CardTitle>
                <div class="role-column">
                  <div class="rounded-header">Actor</div>
                  <div class="credits">
                    <p>1993: Groundhog Day</p>
                    <p>1984: GhostBusters</p>
                    <p>1980: Caddyshack</p>
                    <p>1977: Saturday Night Live</p>
                  </div>
                </div>                
                <div class="role-column">
                  <div class="rounded-header">Writer</div>
                  <div class="credits">
                    <p>1980: Caddyshack</p>
                    <p>1978: Saturday Night Live</p>
                  </div>
                </div>

              </Card>
        </div>
      </div>
    )
  }
}

ViewProfile.propTypes = {
  searchIndex: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  enriched: PropTypes.arrayOf(PropTypes.object).isRequired
}

ViewProfile.defaultProps = {
}

export default ViewProfile
