import React from 'react'
import { get } from 'lodash'
import { Card, CardMedia, CardText, CardTitle, CardActions } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit'
import './VendorProfile.css'
import LinkIcon from 'material-ui/svg-icons/content/link'
import RaisedButton from 'material-ui/RaisedButton'

const defaultImage = 'https://images.vexels.com/media/users/3/144866/isolated/preview/927c4907bbd0598c70fb79de7af6a35c-business-building-silhouette-by-vexels.png'

function formatPhoneNumber(s) {
  const s2 = (`${s}`).replace(/\D/g, '')
  const m = s2.match(/^(\d{3})(\d{3})(\d{4})$/)
  return (!m) ? null : `(${m[1]}) ${m[2]}-${m[3]}`
}

function linkToEmbed(link, type) {
  if (link) {
    switch (type) {
      case 'youtube':
        const youtubeRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        const youtubeMatch = link.match(youtubeRegExp)
        const youtubeVideoID = youtubeMatch[7]

        return `https://www.youtube.com/embed/${youtubeVideoID}`

      case 'vimeo':
        // Source: http://jsbin.com/asuqic/184/edit?html,js,output
        const vimeoRegExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/
        const vimeoMatch = link.match(vimeoRegExp)
        const vimeoVideoID = vimeoMatch[3]

        return `https://player.vimeo.com/video/${vimeoVideoID}?color=ffffff&portrait=0`

      default:
        return ''
    }
  } else {
    return ''
  }
}

const VendorProfilePage = (props) => {
  const uid = get(props, 'auth.uid', '')
  const vendorId = get(props, 'match.params.vendorId', '')
  const vendorProfile = get(props, `data.vendorProfiles.${vendorId}`)
  const vendorCreator = get(vendorProfile, 'creator', '')
  const vendorPhone = formatPhoneNumber(get(vendorProfile, 'phone', ''))
  const vendorName = get(vendorProfile, 'name', '')
  const profileImageUrl = get(vendorProfile, 'profileImage', defaultImage)
  const vendorEmail = get(vendorProfile, 'email', '')
  const vendorBio = get(vendorProfile, 'aboutUs', '')
  const vendorLinks = get(vendorProfile, 'links', [])
  const vendorStreet = get(vendorProfile, 'addressLine1', '')
  const vendorCityState = get(vendorProfile, 'addressLine2', '')
  const video = get(vendorProfile, 'video', '')
  const youtubeVideo = get(vendorProfile, 'youtubeVideo', '')
  const vimeoVideo = get(vendorProfile, 'vimeoVideo', '')
  if (vendorProfile) {
    return (
      <div>
        {
          vendorCreator === uid ? (
            <div style={{ textAlign: 'right', marginRight: 20, marginTop: 10 }}>
              <Link to={`/vendor/${vendorId}/edit`}>
                <RaisedButton label="Edit Profile" icon={<ModeEditIcon />} />
              </Link>
            </div>
          ) : null
        }
        <Card className="profile-card vendor-profile" containerStyle={{ paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <CardMedia className="crew-image">
            <img src={profileImageUrl} alt="" style={{ width: 200, height: 200, objectFit: 'contain', borderBottomLeftRadius: 2, borderTopLeftRadius: 2 }} />
          </CardMedia>
          <div style={{ minWidth: '200px', width: '100%' }}>
            <CardTitle title={vendorName} titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
            { vendorStreet ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '0px', width: '100%' }}>
                {vendorStreet}
                <br />
                {vendorCityState}
              </CardText>
            ) : null
            }
            { vendorPhone ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '8px', width: '100%' }}>
                {vendorPhone}
              </CardText>
            ) : null
            }
            { vendorEmail ? (
              <CardText className="vendor-text" style={{ paddingBottom: '8px', paddingTop: '8px', width: '100%' }}>
                {vendorEmail}
              </CardText>
            ) : null
            }
          </div>
        </Card>

        <Card className="profile-card vendor-bio" containerStyle={{ width: '95%', paddingBottom: 0, display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
          <div>
            <CardTitle title={'About Us'} titleStyle={{ fontWeight: 500, fontSize: '20px' }} />
            { vendorBio ? (
              <CardText style={{ paddingBottom: '40px' }}>
                {vendorBio}
              </CardText>
            ) : (
              <CardText style={{ paddingBottom: '48px' }}>
                                Contact us directly for more information.
              </CardText>
            )
            }

            <CardActions>
              {vendorLinks.map(link => (
                <RaisedButton primary key={link.title} label={link.title} target="_blank" href={link.url} icon={<LinkIcon />} />
              ))}
            </CardActions>
          </div>
        </Card>

        { youtubeVideo ? (
          <Card className="profile-card big-card">
            <CardTitle title="Featured Video" style={{ paddingLeft: '0px' }} titleStyle={{ fontWeight: 500, fontSize: '20px', textAlign: 'left' }} />
            <embed width="100%" height="500px" src={linkToEmbed(youtubeVideo, 'youtube')} />
          </Card>
        ) : null}

        { vimeoVideo ? (
          <Card className="profile-card big-card">
            <CardTitle title="Featured Video" style={{ paddingLeft: '0px' }} titleStyle={{ fontWeight: 500, fontSize: '20px', textAlign: 'left' }} />
            <embed width="100%" height="500px" src={linkToEmbed(vimeoVideo, 'vimeo')} />
          </Card>
        ) : null}

        { video ? (
          <Card className="profile-card big-card">
            <CardTitle title="Featured Video" style={{ paddingLeft: '0px' }} titleStyle={{ fontWeight: 500, fontSize: '20px', textAlign: 'left' }} />
            <embed width="100%" height="500px" src={video} />
          </Card>
        ) : null}
      </div>

    )
  }
  return null
}

VendorProfilePage.propTypes = {
}

VendorProfilePage.defaultProps = {
}

export default VendorProfilePage
