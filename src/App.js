import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/home'
import Login from './containers/login/login'
import Dashboard from './containers/dashboard/dashboard'
import './App.css'
import logo from './logo.svg'

const App = () => (
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
    <Route exact path="/" component={Home} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/login" component={Login} />
  </div>
)

export default App
