import React from 'react'
import PropTypes from 'prop-types'
import '../../App.css'
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';



// Material UI SVG icons
import AccountIcon from 'material-ui/svg-icons/action/account-circle'
import HomeIcon from 'material-ui/svg-icons/action/home';
import ListIcon from 'material-ui/svg-icons/action/list';
import PeopleIcon from 'material-ui/svg-icons/social/people';
import PinIcon from 'material-ui/svg-icons/maps/pin-drop';
import SearchIcon from 'material-ui/svg-icons/action/search'
import StoreIcon from 'material-ui/svg-icons/action/store'

// Image importing would only work via require
const Logo = require('./film-indy-logo.jpg')

const homePage = props => (
  <div>
    <AppBar
        iconElementLeft={
            <div>
                <img src={Logo} className="logo"/>
                <Card className="searchCard" style={{width: 400}}>
                        <SearchIcon className="searchIcon" />
                        <TextField
                            className="searchField"
                            hintText="Search FilmIndy"
                            // onBlur={this.handleKeyword}
                            underlineFocusStyle={{borderColor: '#38b5e6'}}
                            floatingLabelFocusStyle={{color: '#38b5e6'}}
                        />
                </Card>
            </div>
        }
        iconElementRight={ <Avatar className="accountIcon" src="https://goo.gl/ybdoo6" size={60} /> }
        zDepth = {2}
    />
    <div className="sidebar">
        <List>
          <ListItem primaryText="Home" leftIcon={<HomeIcon />} />
          <ListItem primaryText="Profile" leftIcon={<AccountIcon />} />
          <ListItem primaryText="Lists" leftIcon={<ListIcon />} />
        </List>
        <Divider />

        <List>
          <ListItem primaryText="Crew" leftIcon={<PeopleIcon />} />
          <ListItem primaryText="Locations" leftIcon={<PinIcon />} />
          <ListItem primaryText="Vendors" leftIcon={<StoreIcon />} />
        </List>
    </div>

    <div className="mainContent">
        <br />
        <RaisedButton className="raisedButton" secondary={true} labelColor="#fff" onTouchTap={props.onButtonClick}>CLICK ME </RaisedButton>
        <h3>
          {`Aww jeez Rick I've been clicked ${props.timesButtonPressed} times`}
       </h3>
   </div>
  </div>
)

homePage.propTypes = {
  onButtonClick: PropTypes.bool.isRequired,
  timesButtonPressed: PropTypes.func.isRequired,
}

export default homePage
