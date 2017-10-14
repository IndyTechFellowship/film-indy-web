import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as accountActions from '../../redux/actions/creators/accountActions'
import ResetPasswordPage from '../../presentation/resetPassword/resetPasswordPage'

class ResetPassword extends React.Component {
  render() {
    return (
      <ResetPasswordPage {...this.props} />
    )
  }
}

ResetPassword.propTypes = {
  sendPasswordResetEmail: PropTypes.func.isRequired
}

export default withRouter(connect(
  state => ({ home: state.home, account: state.account }),
  { ...accountActions },
)(ResetPassword))
