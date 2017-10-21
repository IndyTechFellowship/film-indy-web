import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { connect } from 'react-redux'
import './signUp.css'

const validate = (values) => {
  const errors = {}

  if (!values.email || !values.password || !values.confirmPassword) {
    if (!values.email) {
      errors.email = 'You forgot to enter an email!'
    }
    if (!values.password) {
      errors.password = 'You forgot to enter a password!'
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'You forgot to confirm your password!'
    }
  }
  if (values.password && values.confirmPassword && !(values.password === values.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match'
  }

  return errors
}

const adaptFileEventToValue = delegate =>
  e => delegate(e.target.files[0])

const FileInput = ({
  input: {
    value: omitValue,
    onChange,
    onBlur,
    ...inputProps
  },
  meta: omitMeta,
  ...props
}) => (
  <div id="fileContainer">
    <div id="fileText">
      Profile Picture
    </div>
    <div id="fileInput">
      <input
        onChange={adaptFileEventToValue(onChange)}
        onBlur={adaptFileEventToValue(onBlur)}
        type="file"
        {...inputProps}
        {...props}
      />
    </div>
  </div>
)

class SignUpForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }
  handleOpen() {
    this.setState({ open: true })
  }
  handleClose() {
    this.setState({ open: false })
  }
  render() {
    const { handleSubmit, error, submitting, pristine, sendSubmit } = this.props
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        disabled={error || pristine || submitting}
        onClick={() => {
          sendSubmit()
        }}
      />
    ]
    return (
      <div>
        <FlatButton label="Sign Up" style={{ color: 'white' }} onClick={this.handleOpen} />
        <Dialog
          title="Sign Up"
          actions={actions}
          modal
          open={this.state.open}
          autoScrollBodyContent
        >
          <form
            onSubmit={handleSubmit}
          >
            <div>
              <Field
                name="firstName"
                component={TextField}
                floatingLabelText="First Name"
              />
            </div>
            <div>
              <Field
                name="lastName"
                component={TextField}
                floatingLabelText="Last Name"
              />
            </div>
            <br />
            <div>
              <Field
                name="photoFile"
                component={FileInput}
                type="file"
              />
            </div>
            <div>
              <Field
                name="email"
                component={TextField}
                floatingLabelText="Email"
                type="email"
              />
            </div>
            <div>
              <Field
                name="password"
                component={TextField}
                floatingLabelText="Password"
                type="password"
              />
            </div>
            <div id="confirmPasswordInput">
              <Field
                name="confirmPassword"
                component={TextField}
                floatingLabelText="Confirm Password"
                type="password"
              />
            </div>
          </form>
        </Dialog>
      </div>
    )
  }
}
/*
const SignUpForm = (props) => {
  const { handleSubmit, submitting } = props
  return (
    <form
      onSubmit={handleSubmit}
    >
      <div>
        <Field
          name="firstName"
          component={TextField}
          floatingLabelText="First Name"
        />
      </div>
      <div>
        <Field
          name="lastName"
          component={TextField}
          floatingLabelText="Last Name"
        />
      </div>
      <br />
      <div>
        <Field
          name="photoFile"
          component={FileInput}
          type="file"
        />
      </div>
      <div>
        <Field
          name="email"
          component={TextField}
          floatingLabelText="Email"
          type="email"
        />
      </div>
      <div>
        <Field
          name="password"
          component={TextField}
          floatingLabelText="Password"
          type="password"
        />
      </div>
      <div id="confirmPasswordInput">
        <Field
          name="confirmPassword"
          component={TextField}
          floatingLabelText="Confirm Password"
          type="password"
        />
      </div>
      <RaisedButton type="submit" disabled={props.error || submitting}>Sign Up</RaisedButton>
    </form>
  )
}
*/


SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  sendSubmit: PropTypes.func.isRequired
}

const SignUpFormFormEnriched = reduxForm({
  form: 'signUp',
  validate
})(SignUpForm)

// Decorate with redux-form
const selector = formValueSelector('signUp') // <-- same as form name
const SignUpFormFormConnected = connect(
  (state) => {
    // can select values individually
    const photoFile = selector(state, 'photoFile')
    return {
      photoFile
    }
  }
)(SignUpFormFormEnriched)

export default SignUpFormFormConnected

