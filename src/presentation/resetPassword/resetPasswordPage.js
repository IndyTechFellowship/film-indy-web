import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
import { get } from 'lodash'
import '../../App.css'
import ResetPasswordForm from './resetPasswordForm'
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'



const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found': return 'A valid email is required.'
    default: return 'There was an issue resetting your password. Please try again'
  }
}

const ResetPasswordPage = props => (

  <div >
    <ResetPasswordForm onSubmit={values => props.resetPassword(values.newPassword)} />
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.resetPasswordError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.resetPasswordError.code'))}
      autoHideDuration={4000}
    />
    <Link to="/account">
      <FlatButton
        label = "Return to Account Settings"
        primary = {true}
      />
    </Link>
  </div>
)

ResetPasswordPage.propTypes = {
  account: PropTypes.shape({
    resetPasswordError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  resetPassword: PropTypes.func.isRequired,
}

ResetPasswordPage.defaultProps = {
  account: {},
}

export default ResetPasswordPage
