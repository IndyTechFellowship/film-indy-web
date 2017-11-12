import React from 'react'
import QueryString from 'query-string'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import '../../App.css'
import './ViewProfile.css'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline'
import WebsiteIcon from 'material-ui/svg-icons/hardware/laptop-mac'


//// Dummy filler data 

// const bio = "Bill Murray is an American actor, comedian, and writer. The fifth of nine children, he was born William James Murray in Wilmette, Illinois, to Lucille (Collins), a mailroom clerk, and Edward Joseph Murray II, who sold lumber. He is of Irish descent. Among his siblings are actors Brian Doyle-Murray, Joel Murray, and John Murray. He and most of his siblings worked as caddies, which paid his tuition to Loyola Academy, a Jesuit school. He played sports and did some acting while in that school, but in his words, mostly 'screwed off.'";
// const headline = "I'm a nut, but not just a nut."
// const experience = "44 years in industry"
// const phone = "1-800-GHOSTBUSTERS"
// const video = 'https://www.youtube.com/embed/cUsOjj8m02o'
// const website = "http://www.imdb.com/name/nm0000195/bio"
const defaultImage = 'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png'

// const vimeo = 'https://player.vimeo.com/video/47839264'


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
] /// end dummy data

class ViewProfile extends React.Component {

  render() {

    const { data, location } = this.props

    // gets uid of current public profile from URL
    const parsed = QueryString.parse(location.search)
    const uid = parsed.query 

    // grabs data using uid to populate page
    const roles = get(data, 'roles', {})
    const userProfile = get(data, `userProfiles.${uid}`)
    const userAccount = get(data, `userAccount.${uid}`)

    const userRoles = get(userProfile, 'roles', [])
      .map(roleId => ({ roleName: get(roles, `${roleId}.roleName`, ''), roleId }))
      .sort((a, b) => {
        const aCaps = a.roleName.toUpperCase()
        const bcaps = b.roleName.toUpperCase()
        if (aCaps < bcaps) {
          return -1
        } else if (aCaps > bcaps) {
          return 1
        }
        return 0
      })
    const bio = get(userProfile, 'bio');
    const experience = get(userProfile, 'experience')
    const currentDate = new Date();
    const numYears = currentDate.getFullYear() - experience;
    const headline = get(userProfile, 'headline')
    const video = get(userProfile, 'video', '')
    const website = get(userProfile, 'website')

    const profileImageUrl = get(userAccount, 'photoURL')
    const email = get(userAccount, 'email')
    const name = `${get(userAccount, 'firstName', '')} ${get(userAccount, 'lastName', '')}`
    const phone = get(userAccount, 'phone')


    return (
      <div className="ViewProfile">
        <div style={{ display: 'block', margin: 'auto' }}>
              <Card className="profile-card top-card" containerStyle={{ width: '50%', paddingBottom: 0, display: 'flex', flexDirection: 'row' }}>
                <CardMedia className="crew-image">
                  <img src={get(profileImageUrl, profileImageUrl, defaultImage )} alt="" style={{ width: 250, height: 250, objectFit: 'cover', borderBottomLeftRadius: 2, borderTopLeftRadius: 2 }} />
                </CardMedia>
                <div>
                  <CardTitle title={name} titleStyle={{ fontWeight: 500, fontSize: '20px' }} subtitle={headline} subtitleStyle={{ minWidth: '250%', fontStyle: 'italic' }} >
                  </CardTitle>
                  <CardText className="crew-text">
                    {numYears} years in industry
                  </CardText>
                  <CardText className="crew-text">
                    {phone}
                  </CardText>                
                  <CardText className="crew-text">
                    {email}
                  </CardText>
                </div>
              </Card>

              <Card className="profile-card small-card">
                <CardTitle title="About Me" titleStyle={{ fontWeight: 500, fontSize: '20px' }}></CardTitle>
                <CardText>
                  {bio}
                </CardText>
                <CardActions>
                  <RaisedButton primary label="Website" target="_blank" href={website} icon={<WebsiteIcon />}/>
                </CardActions>
              </Card>   

              <Card className="profile-card big-card">
                <CardTitle title="Featured Video" titleStyle={{ fontWeight: 500, fontSize: '20px' }}></CardTitle>
                <embed width="100%" height="500px" src={video} />
              </Card>

              <Card className="profile-card big-card">
                <CardTitle title="Credits" titleStyle={{ fontWeight: 500, fontSize: '20px' }}></CardTitle>
                <div className="roles">
                { 
                  userRoles.map(role => (
                    <div className="role-column" key={role.roleId}>
                      <div className="rounded-header"><span>{role.roleName}</span></div>
                      <div className="credits">
                        { creditsArray[0].credits.map(credit => (
                            <p key={credit.title}>{credit.year} : {credit.title}</p>
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
