import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as exampleActions from '../redux/actions/creators/exampleActions'
import HomePage from '../presentation/home/homePage'

class Home extends React.Component {
  render() {
    const { home, homePageButtonPressed } = this.props
    return (
      <HomePage timesButtonPressed={home.timesButtonPressed} onButtonClick={homePageButtonPressed} />
    )
  }
}

Home.propTypes = {
  home: PropTypes.shape({
    timesButtonPressed: PropTypes.bool,
  }).isRequired,
  homePageButtonPressed: PropTypes.func.isRequired,
}

export default connect(
  state => ({ home: state.home }),
  { ...exampleActions },
)(Home)
