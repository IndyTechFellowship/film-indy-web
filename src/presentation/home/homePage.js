import React from 'react'
import '../../App.css'
import './homePage.css'
import PropTypes from 'prop-types'
import { InstantSearch, Configure } from 'react-instantsearch/dom'
import { connectAutoComplete } from 'react-instantsearch/connectors'
import 'react-instantsearch-theme-algolia/style.css'

// Image imports
import LocationsImage from './location1.jpg'
import CrewImage from './crew1.jpg'
import VendorsImage from './vendors4.jpg'
import LightingImage from './location4.jpg'
import CameraAsstImage from './vendors1.jpg'
import PostProdImage from './vendors3.jpg'


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



const homePage = (props) => {
	const { history } = props
	return (
		<div className="container">
			<div className="wrapper">
				<div className="header">Film Indy</div>
				<div className="subheader">If it isn't on video</div>
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

			<div className="wrapper explore">
				<div className="header">Explore Indy</div>
			</div>
			<div className="wrapper categories">
				<Card className="category-card">
					<CardMedia>
						<img src={LocationsImage} alt="Search Locations"/>
					</CardMedia>
					<CardTitle title="Locations" />
				</Card>
				<Card className="category-card">
					<CardMedia>
						<img src={CrewImage} alt="Search Crew"/>
					</CardMedia>
					<CardTitle title="Crew" />
				</Card>
				<Card className="category-card">
					<CardMedia>
						<img src={VendorsImage} alt="Search Vendors" />
					</CardMedia>
					<CardTitle title="Vendors" />
				</Card>
			</div>

			<div className="wrapper roles-header">
				<div className="header">Popular Roles</div>
			</div>
			<div className="wrapper roles">
				<Card className="category-card">
					<CardMedia>
						<img src={CameraAsstImage} alt="Search Locations"/>
					</CardMedia>
					<CardTitle title="Camera Assistant" />
				</Card>
				<Card className="category-card">
					<CardMedia>
						<img src={PostProdImage} alt="Search Crew"/>
					</CardMedia>
					<CardTitle title="Post Production Editor" />
				</Card>
				<Card className="category-card">
					<CardMedia>
						<img src={LightingImage} alt="Search Vendors" />
					</CardMedia>
					<CardTitle title="Lighting Grip" />
				</Card>
			</div>
		</div>
	)
};

homePage.propTypes = {
	history: PropTypes.shape({
	  push: PropTypes.func
	}).isRequired,
};

homePage.defaultProps = {
};

export default homePage