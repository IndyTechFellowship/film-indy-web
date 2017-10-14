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
    default: return 'There was an issue processing your email. Please try again'
  }
}

const ResetPasswordPage = props => (
  <div >
    <ResetPasswordForm onSubmit={values => props.sendPasswordResetEmail(values.email)} />
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.sendPasswordResetEmailError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.sendPasswordResetEmailError.code'))}
      autoHideDuration={4000}
    />
    <Link to="/login">
      <FlatButton
        label = "Return to Log In"
        primary = {true}
      />
    </Link>
  </div>
)

ResetPasswordPage.propTypes = {
  account: PropTypes.shape({
    sendPasswordResetEmailError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  sendPasswordResetEmail: PropTypes.func.isRequired,
}

ResetPasswordPage.defaultProps = {
  account: {},
}

export default ResetPasswordPage
