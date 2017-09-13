import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

const SignInForm = (props) => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="email"
          component={TextField}
          hintText="Email"
          floatingLabelText="Email"
          type="email"
        />
      </div>
      <div>
        <Field
          name="password"
          component={TextField}
          hintText="Password"
          floatingLabelText="Password"
          type="password"
        />
      </div>
      <RaisedButton type="submit">Login</RaisedButton>
    </form>
  )
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

const SignInFormEnriched = reduxForm({
  form: 'signIn',
})(SignInForm)

export default SignInFormEnriched
