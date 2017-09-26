import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
import { get } from 'lodash'
import '../../App.css'
import ForgotPasswordForm from './ForgotPasswordForm'

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email': return 'No user with that email exists'
    default: return 'There was an issue processing your email. Please try again'
  }
}

const ForgotPasswordPage = props => (
  <div >
    <ForgotPasswordForm onSubmit={values => props.sendPasswordResetEmail(values.email)} />
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.sendPasswordResetEmailError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.sendPasswordResetEmailErrorError.code'))}
      autoHideDuration={4000}
    />
  </div>
)

ForgotPasswordPage.propTypes = {
  account: PropTypes.shape({
    sendPasswordResetEmailError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  sendPasswordResetEmail: PropTypes.func.isRequired,
}

ForgotPasswordPage.defaultProps = {
  account: {},
}

export default ForgotPasswordPage
