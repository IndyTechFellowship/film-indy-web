import React from 'react'
import '../../App.css'
import './homePage.css'
import PropTypes from 'prop-types'
import { InstantSearch, Configure } from 'react-instantsearch/dom'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import 'react-instantsearch-theme-algolia/style.css'
import ImageSlider from 'react-slick'
import { Link } from 'react-router-dom'

// Image imports
import LocationsImage from './location5.jpg'
import CrewImage from './crew1.jpg'
import VendorsImage from './vendors4.jpg'

import ProdAsstImage from './crew3.jpg'
import CameraAsstImage from './crew4.jpg'
import PostProdImage from './crew7.jpg'
import CinImage from './crew5.jpg'
import ProdWriterImage from './bg1.jpg'
import LightingImage from './location4.jpg'
import CamDirImage from './vendors3.jpg'
import DirImage from './director.jpg'
import AudioOpImage from './crew8.jpg'
import ProdPhotoImage from './crew9.jpg'
import ScoutImage from './scout.jpg'


// Material UI component imports
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'

const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID

const AutoCompleteBar = connectAutoComplete(
  ({ hits, onItemSelected, onUpdateInput }) => (
    <AutoComplete
      className="searchField"
      fullWidth
      hintText="Search our database..."
      style={{ width: '40em' }}
      onUpdateInput={onUpdateInput}
      id="autocomplete"
      maxSearchResults={10}
      filter={(searchText, key) => {
        if (searchText === '') {
          return false
        }
        return AutoComplete.fuzzyFilter(searchText, key)
      }}
      onNewRequest={onItemSelected}
      dataSource={hits.sort((a, b) => a.roleName.localeCompare(b.roleName)).map(hit => hit.roleName)}
    />
  )
)

const categories = [
  { key: 0, image: LocationsImage, title: 'Locations' },
  { key: 1, image: CrewImage, title: 'Crew' },
  { key: 2, image: VendorsImage, title: 'Vendors' }
]

const roles = [
  { key: 0, image: ProdAsstImage, title: 'Production Assistant' },
  { key: 1, image: CameraAsstImage, title: 'Camera Assistant' },
  { key: 2, image: PostProdImage, title: 'Post Production Editor' },
  { key: 3, image: ProdWriterImage, title: 'Production Writer' },
  { key: 4, image: CinImage, title: 'Cinematographer' },
  { key: 5, image: LightingImage, title: 'Lighting Grip' },
  { key: 6, image: CamDirImage, title: 'Camera Director' },
  { key: 7, image: DirImage, title: 'Director' },
  { key: 8, image: AudioOpImage, title: 'Audio Boom Operator' },
  { key: 9, image: ProdPhotoImage, title: 'Production Photographer' },
  { key: 10, image: ScoutImage, title: 'Location Scout' }
]


const homePage = (props) => {
  const { history } = props
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    swipeToSlide: true,
    slidesToShow: 5,
    slidesToScroll: 3,
    nextArrow: <Arrow direction="nextArrow" />,
    prevArrow: <Arrow direction="prevArrow" />
  }
  return (
    <div className="container">
      <div className="bg-image">
        <div className="header-wrapper">
          <div className="main-header">Film Indy</div>
          <div className="subheader">If it isn't on video,</div>
          <div className="subheader">it didn't happen.</div>
          <Card className="searchCard" style={{ width: 700 }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <SearchIcon className="searchIcon" />
              <InstantSearch
                appId={ALGOLIA_APP_ID}
                apiKey={ALGOLIA_SEARCH_KEY}
                indexName="roles"
              >

                <Configure hitsPerPage={100} />
                <AutoCompleteBar
                  onUpdateInput={query => this.searchQuery = query}
                  onItemSelected={item => history.push({ pathname: '/search', search: `?query=${encodeURIComponent(item)}` })}
                />
              </InstantSearch>
            </div>
            <RaisedButton
              primary
              label="Search"
              style={{ display: 'inline' }}
              onClick={() => {
                if (this.searchQuery !== '') {
                  history.push({ pathname: '/search', search: `?query=${encodeURIComponent(this.searchQuery)}` })
                }
              }}
            />
          </Card>
        </div>
      </div>

      <div className="category-wrapper header">
        <div className="header">Explore Indy</div>
      </div>
      <div className="category-wrapper">
        {
          categories.map(item => (<Card className="category-card" key={item.key}>
            <CardMedia>
              <img src={item.image} alt="Explore Categories" />
            </CardMedia>
            <CardTitle title={item.title} />
          </Card>))
        }
      </div>

      <div className="roles-wrapper header">
        <div className="header">Popular Roles</div>
      </div>
      <div className="roles-wrapper">
        <ImageSlider className="imageSlider" {...sliderSettings}>
          {
            roles.map(item => (
              <Card className="category-card" key={item.key}>
                <Link to={`/search?query=${encodeURIComponent(item.title)}`} style={{ textDecoration: 'none' }}>
                  <CardMedia>
                    <img src={item.image} alt="Explore Roles" />
                  </CardMedia>
                  <CardTitle title={item.title} />
                </Link>
              </Card>))
          }
        </ImageSlider>
      </div>
    </div>
  )
}


const Arrow = ({ className, style, onClick, direction }) => (
  <button
    className={[className, direction].join(' ')}
    style={{ ...style }}
    onClick={onClick}
  />
)


homePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

homePage.defaultProps = {
}

export default homePage

