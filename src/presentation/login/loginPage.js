import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from 'material-ui/Snackbar'
import { get } from 'lodash'
import '../../App.css'
import SignInForm from './signInForm'

const firebaseErrorCodeToFriendlyMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/wrong-password': return 'Invalid Password'
    case 'auth/user-not-found': return 'No user with that email exists'
    default: return 'There was an issue signing in. Please try again'
  }
}

const LoginPage = props => (
  <div >
    <SignInForm onSubmit={values => props.signIn(values.email, values.password)} />
    <Snackbar
      bodyStyle={{ backgroundColor: '#F44336' }}
      open={props.account.signInError !== undefined}
      message={firebaseErrorCodeToFriendlyMessage(get(props, 'account.signInError.code'))}
      autoHideDuration={4000}
    />
  </div>
)

LoginPage.propTypes = {
  account: PropTypes.shape({
    signInError: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  signIn: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
  account: {},
}

export default LoginPage
