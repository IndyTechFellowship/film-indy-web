import React from 'react'
import PropTypes from 'prop-types'
import '../../App.css'
import './homePage.css'
import RaisedButton from 'material-ui/RaisedButton'

const homePage = props => (
  <div>
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
