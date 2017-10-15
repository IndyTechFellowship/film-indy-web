import React from 'react'
import '../../App.css'
import './homePage.css'
import PropTypes from 'prop-types'
import { InstantSearch, Configure } from 'react-instantsearch/dom'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import 'react-instantsearch-theme-algolia/style.css'
import ImageSlider from 'react-slick'

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
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'

// Material UI SVG Icons
import SearchIcon from 'material-ui/svg-icons/action/search'

const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID

const AutoCompleteBar = connectAutoComplete(
  ({ hits, onItemSelected }) => (
    <AutoComplete
      id="autocomplete"
      filter={AutoComplete.fuzzyFilter}
      onNewRequest={onItemSelected}
      dataSource={hits.map(hit => hit.roleName)}
      textFieldStyle={{ width: '400', float: "left", marginLeft: "25px" }}
      hintText="Search our database..."
    />
  )
)

const categories = [
	{key: 0, image: LocationsImage, title: "Locations"},
	{key: 1, image: CrewImage, title: "Crew"},
	{key: 2, image: VendorsImage, title: "Vendors"},
]

const roles = [
	{key: 0, image: ProdAsstImage, title: "Production Assistant"},
	{key: 1, image: CameraAsstImage, title: "Camera Assistant"},
	{key: 2, image: PostProdImage, title: "Post Production Editor"},
	{key: 3, image: ProdWriterImage, title: "Production Writer"},
	{key: 4, image: CinImage, title: "Cinematographer"},
	{key: 5, image: LightingImage, title: "Lighting Grip"},
	{key: 6, image: CamDirImage, title: "Camera Director"},
	{key: 7, image: DirImage, title: "Director"},
	{key: 8, image: AudioOpImage, title: "Audio Boom Operator"},
	{key: 9, image: ProdPhotoImage, title: "Production Photographer"},
	{key: 10, image: ScoutImage, title: "Location Scout"},
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
	  nextArrow: <NextArrow />,
	  prevArrow: <PrevArrow />,
	};
	return (
		<div className="container">
			<div className="bg-image">
				<div className="header-wrapper">
					<div className="main-header">Film Indy</div>
					<div className="subheader">If it isn't on video,</div>
					<div className="subheader">It didn't happen</div>
					<Card className="searchCard" style={{ width: 700 }}>
					  <SearchIcon className="searchIcon" />
					  <InstantSearch
					    appId={ALGOLIA_APP_ID}
					    apiKey={ALGOLIA_SEARCH_KEY}
					    indexName="roles"
					  >

					    <Configure hitsPerPage={100} />
					    <AutoCompleteBar onItemSelected={item => history.push({ pathname: '/search', search: `?query=${encodeURIComponent(item)}` })} />
					  </InstantSearch>
					  <RaisedButton primary label="Search" style={{display: 'inline'}}/>
					</Card>
				</div>
			</div>

			<div className="category-wrapper header">
				<div className="header">Explore Indy</div>
			</div>
			<div className="category-wrapper">
				{
					categories.map( (item) => {
						return <Card className="category-card" key={item.key}>
							   		<CardMedia>
										<img src={item.image} alt="Explore Categories"/>
									</CardMedia>
									<CardTitle title={item.title} />
								</Card>
					})
				}
			</div>

			<div className="roles-wrapper header">
				<div className="header">Popular Roles</div>
			</div>
			<div className="roles-wrapper">
				<ImageSlider className="imageSlider" {...sliderSettings}>
				{
					roles.map( (item) => {
						return <Card className="category-card" key={item.key}>
							   		<CardMedia>
										<img src={item.image} alt="Explore Roles"/>
									</CardMedia>
									<CardTitle title={item.title} />
								</Card>
					})
				}
				</ImageSlider>
			</div>
		</div>
	)
}

function NextArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
      className={[className, "nextArrow"].join(' ')}
      style={{...style}}
      onClick={onClick}
    ></div>
  )
}

function PrevArrow(props) {
  const {className, style, onClick} = props
  return (
    <div
    className={[className, "prevArrow"].join(' ')}
      style={{...style}}
      onClick={onClick}
    ></div>
  )
}

homePage.propTypes = {
	history: PropTypes.shape({
	  push: PropTypes.func
	}).isRequired,
};

homePage.defaultProps = {
};

export default homePage