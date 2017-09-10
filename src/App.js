import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Film Indy Project</h2>
        </div>
        <div className="App-subheader">
            <h3>Built with <a href="https://github.com/facebookincubator/create-react-app" className="App-docs">React,</a>
                <a href="http://redux.js.org/" className="App-docs">Redux,</a>
                <a href="https://firebase.google.com/docs/" className="App-docs">& Firebase</a>
            </h3>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

      </div>
    );
  }
}

export default App;
