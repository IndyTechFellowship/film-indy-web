import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import './signInForm.css'
import { Link } from 'react-router-dom'

class SignInForm extends React.Component {
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
    const { handleSubmit, error, pristine, submitting, sendSubmit } = this.props
    const actions = [
      <div id="actionContainer">
        <FlatButton
          id="signInCancel"
          style={{ textAlign: 'center' }}
          label="Cancel"
          primary
          onClick={this.handleClose}
        />
        <FlatButton
          id="signInSubmit"
          label="Login"
          primary
          disabled={error || pristine || submitting}
          onClick={() => {
            sendSubmit()
          }}
        />
      </div>
    ]
    return (
      <div>
        <FlatButton label="Login" style={{ color: 'white' }} labelStyle={{ fontSize: '12pt' }} onClick={this.handleOpen} />
        <Dialog
          contentStyle={{ width: '100%', marginBottom: 150 }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          title="Sign In"
          actions={actions}
          modal
          open={this.state.open}
          autoScrollBodyContent
        >
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
          </form>
          <div id="forgotPasswordContainer">
            <Link to="/forgotpassword">
              <FlatButton
                label="Forgot Password?"
                onClick={this.handleClose}
              />
            </Link>
          </div>
        </Dialog>
      </div>
    )
  }
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  sendSubmit: PropTypes.func.isRequired
}

const SignInFormEnriched = reduxForm({
  form: 'signIn'
})(SignInForm)

export default SignInFormEnriched
