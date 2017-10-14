import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'

const validate = (values) => {
  const errors = {}

  if (!values.password || !values.confirmPassword) {
    if (!values.password) {
      errors.password = 'You forgot to enter a password'
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'You forgot to confirm your password'
    }
  }
  if (values.password && values.confirmPassword && !(values.password === values.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

const ResetPasswordForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name="newPassword"
          component={TextField}
          hintText="New Password"
          floatingLabelText="New Password"
          type="newPassword"
        />
      </div>
      <div>
        <Field
          name="confirmNewPassword"
          component={TextField}
          hintText="Confirm New Password"
          floatingLabelText="Confirm New Password"
          type="newPassword"
        />
      </div>
      <RaisedButton type="submit">Reset Password</RaisedButton>
    </form>
  )
};
ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

const ResetPasswordFormEnriched = reduxForm({
  form: 'resetPassword',
  validate
})(ResetPasswordForm);

export default ResetPasswordFormEnriched
