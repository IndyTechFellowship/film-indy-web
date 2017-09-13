import React from 'react'
import PropTypes from 'prop-types'
import '../../App.css'

const homePage = props => (
  <div >
    <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    <button onClick={props.onButtonClick}>CLICK ME </button>
    <h1>
      {`I've been clicked ${props.timesButtonPressed} times`}
    </h1>
  </div>
)

homePage.propTypes = {
  onButtonClick: PropTypes.bool.isRequired,
  timesButtonPressed: PropTypes.func.isRequired,
}

export default homePage
