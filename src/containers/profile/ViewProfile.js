import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { firebaseConnect } from 'react-redux-firebase'
import ViewProfilePage from '../../presentation/profile/ViewProfile'
import * as algoliaActions from '../../redux/actions/creators/algoliaActions'

class ViewProfileContainer extends React.Component {
  render() {
    return (
      <ViewProfilePage {...this.props} />
    )
  }
}

ViewProfileContainer.propTypes = {
  searchIndex: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  enriched: PropTypes.arrayOf(PropTypes.object).isRequired
} 

export default withRouter(connect(
  state => ({ profileIndex: state.algolia.crewQueryResults, enriched: state.algolia.enrichedCrewResults }),
  { ...algoliaActions },
)(ViewProfileContainer))

// export default ViewProfileContainer
