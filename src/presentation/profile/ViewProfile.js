import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText, CardTitle, CardActions, CardHeader } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { get, take } from 'lodash'
import PropTypes from 'prop-types'
import '../../App.css'
import './ViewProfile.css'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline'

const name = "Bill Murray"
const aboutText = "Bill Murray is an American actor, comedian, and writer. The fifth of nine children, he was born William James Murray in Wilmette, Illinois, to Lucille (Collins), a mailroom clerk, and Edward Joseph Murray II, who sold lumber. He is of Irish descent. Among his siblings are actors Brian Doyle-Murray, Joel Murray, and John Murray. He and most of his siblings worked as caddies, which paid his tuition to Loyola Academy, a Jesuit school. He played sports and did some acting while in that school, but in his words, mostly 'screwed off.'";
const headline = "I'm a nut, but not just a nut."
const photo = 'https://static.comicvine.com/uploads/scale_small/3/35374/804803-bill_murray.jpg'
const defaultImage = 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png'

const portfolioURL = "http://www.imdb.com/name/nm0000195/bio"
const resumeURL = "https://codepen.io/gabrielhidalgow/details/yoWyEx"
const imdbURL = "http://www.imdb.com/name/nm0000195/bio"

const creditsArray = [
  {
    role: "Actor",
    credits: [
      { year: "1993",
        title: "Groundhog Day"
      },      
      { year: "1984",
        title: "Ghostbusters"
      },      
      { year: "1980",
        title: "Caddyshack"
      },
      { year: "1977",
        title: "Saturday Night Live"
      },
    ]
  },  
  {
    role: "Writer",
    credits: [
      { year: "2015",
        title: "A Very Murray Christmas"
      },      
      { year: "1977",
        title: "Saturday Night Live"
      },      
    ]
  },
]

class ViewProfile extends React.Component {

  render() {
    return (
      <div className="ViewProfile">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
          <h1 style={{ textAlign: 'left', paddingLeft: 40, margin: 0 }}> Profile </h1>
        </div>
        <div style={{ display: 'block', margin: 'auto' }}>
              <Card className="profile-card top-card" containerStyle={{ width: '50%', paddingBottom: 0, display: 'flex', flexDirection: 'row' }}>
                <CardMedia className="crew-image">
                  <img src={photo} alt="" style={{ objectFit: 'cover', borderBottomLeftRadius: 2, borderTopLeftRadius: 2 }} />
                </CardMedia>
                <div>
                  <CardTitle title={name} titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={headline} subtitleStyle={{ width: '100%' }} >
                  </CardTitle>
                  <CardText className="crew-text">
                    44 yrs in industry
                  </CardText>
                  <CardText className="crew-text">
                   billmurray@gmail.com
                  </CardText>                
                  <CardText className="crew-text">
                   1-800-GHOSTBUSTERS
                  </CardText>
                </div>
              </Card>

              <Card className="profile-card small-card">
                <CardTitle title="About Me" titleStyle={{ fontWeight: 500, fontSize: '20px' }}></CardTitle>
                <CardText>
                  {aboutText}
                </CardText>
                <CardActions>
                  <RaisedButton primary label="Portfolio" target="_blank" href={portfolioURL} />
                  <RaisedButton primary label="Resume" target="_blank" href={resumeURL} />
                  <RaisedButton primary label="IMDb" target="_blank" href={imdbURL} />
                </CardActions>
              </Card>   

              <Card className="profile-card big-card">
                <CardTitle title="Credits" titleStyle={{ fontWeight: 500, fontSize: '20px' }}></CardTitle>
                <div className="roles">
                { 
                  creditsArray.map(item => (
                    <div className="role-column">
                      <div className="rounded-header"><span>{item.role}</span></div>
                      <div className="credits">
                        { item.credits.map(credit => (
                            <p>{credit.year} : {credit.title}</p>
                          ) 
                        )}
                      </div>
                    </div> 
                  ))
                }
                </div>
                <CardActions style={{ textAlign: 'center' }}>
                  <RaisedButton primary label="Add Role" icon={<AddIcon />} />
                  <RaisedButton primary label="Add Credit" icon={<AddIcon />} />
                </CardActions>
              </Card>
      </div>
    </div>
    )
  }
}

ViewProfile.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    photoURL: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object
  }).isRequired,
  firebase: PropTypes.shape({
    set: PropTypes.func
  }).isRequired,
}

ViewProfile.defaultProps = {
}

export default ViewProfile
