import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import { get } from 'lodash'


const validate = (values) => {
  const errors = {}

  if (!values.password || !values.confirmPassword) {
    if (!values.newPassword) {
      errors.newPassword = 'You forgot to enter a password'
    }
    if (!values.confirmNewPassword) {
      errors.confirmNewPassword = 'You forgot to confirm your password'
    }
  }
  if (values.newPassword && values.confirmNewPassword && !(values.newPassword === values.confirmNewPassword)) {
    errors.confirmNewPassword = 'Passwords do not match'
  }

  return errors
}

const ResetPasswordForm = (props) => {
  const { handleSubmit, auth } = props
  const uid = get(auth, 'uid')
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="newPassword"
          component={TextField}
          hintText="New Password"
          floatingLabelText="New Password"
          type="password"
        />
      </div>
      <div>
        <Field
          name="confirmNewPassword"
          component={TextField}
          hintText="Confirm New Password"
          floatingLabelText="Confirm New Password"
          type="password"
        />
      </div>
      <RaisedButton type="submit" >Reset Password</RaisedButton>
    </form>
  )
};
ResetPasswordForm.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};


const ResetPasswordFormEnriched = reduxForm({
  form: 'resetPassword',
  validate
})(ResetPasswordForm);

export default ResetPasswordFormEnriched
