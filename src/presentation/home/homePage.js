import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../logo.svg';
import '../../App.css';

const homePage = props => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to React</h2>
    </div>
    <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    <button onClick={props.onButtonClick}>CLICK ME </button>
    <h1>
      {`I've been clicked ${props.timesButtonPressed} times`}
    </h1>
  </div>
);

homePage.propTypes = {
  onButtonClick: PropTypes.bool.isRequired,
  timesButtonPressed: PropTypes.func.isRequired,
};

export default homePage;
