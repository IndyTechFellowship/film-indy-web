import React from 'react'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import PropTypes from 'prop-types'
import { TextField } from 'redux-form-material-ui'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { FacebookLoginButton } from 'react-social-login-buttons'
import SocialLoginButton from 'react-social-login-buttons/lib/buttons/SocialLoginButton'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { Grid, Row, Col } from 'react-flexbox-grid'
import AvatarPicker from './AvatarPicker'
import './signUp.css'
import { MenuItem } from 'material-ui'

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
  if (!values.avatar && !values.photoFile) {
    errors.photoFile = 'Please choose an photo from the list or upload one'
  }
  if (values.password && values.confirmPassword && !(values.password === values.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match'
  }

  return errors
}

const GoogleLoginButton = (props) => {
  const customProps = {
    style: {
      background: 'white',
      color: '#808080'
    },
    activeStyle: {
      background: '#eeeeee'
    }
  }

  return (<SocialLoginButton {...{ ...customProps, ...props }}>
    <img
      alt=""
      style={{ verticalAlign: 'middle', height: 26, paddingRight: 10 }}
      src="https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-128.png"
    />
    <span style={{ verticalAlign: 'middle' }}>Sign up with Google</span>
  </SocialLoginButton>)
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
    {
      omitMeta.error && omitMeta.touched ? (
        <div>
          <div style={{ color: 'red' }}> {omitMeta.error} </div>
        </div>
      ) : null
    }
  </div>
)

const fireBaseErrorCode = (code) => {
  switch (code) {
    case 'auth/account-exists-with-different-credential':
      return 'An account is already associated with this email. Please enter your email and password'
    case 'auth/email-already-in-use': return 'This email is already in use'
    case 'auth/weak-password': return 'Your password must be at least 6 characters'

    default:
      return 'Error Signing In'
  }
}

class SignUpForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, continueWithEmail: false }
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }
  componentWillMount() {
    const { getDefaultAccountImages } = this.props
    getDefaultAccountImages()
  }
  handleOpen() {
    this.setState({ open: true })
  }
  handleClose() {
    this.setState({ open: false, continueWithEmail: false })
  }
  render() {
    const {
      account, handleSubmit, error, submitting, pristine, sendSubmit, browser,
      signUpWithGoogle, signUpWithFacebook, defaultAccountImages, mobile } = this.props
    const { continueWithEmail } = this.state
    const lessThanSmall = get(browser, 'lessThan.small', '')
    const socialSignInError = get(account, 'socialSignInError.code')
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
        {
          !mobile ? (
            <div>
              <FlatButton label="Sign Up" style={{ color: 'white' }} labelStyle={{ fontSize: '12pt' }} onClick={this.handleOpen} />
              <Dialog
                contentStyle={{ marginBottom: 150, width: '100%' }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                title="Sign Up"
                actions={continueWithEmail ? actions : []}
                modal={false}
                open={this.state.open}
                autoScrollBodyContent
                onRequestClose={this.handleClose}
              >
                {continueWithEmail ? (
                  <Grid>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="firstName"
                            component={TextField}
                            floatingLabelText="First Name"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} >
                          <Field
                            name="lastName"
                            component={TextField}
                            floatingLabelText="Last Name"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="photoFile"
                            component={FileInput}
                            type="file"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="avatar"
                            component={props => (
                              <AvatarPicker
                                value={props.input.value}
                                onChange={(value) => {
                                  props.input.onChange(value)
                                }}
                                images={defaultAccountImages}
                              />)}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={12}>
                          <Field
                            name="email"
                            component={TextField}
                            floatingLabelText="Email"
                            type="email"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="password"
                            component={TextField}
                            floatingLabelText="Password"
                            type="password"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <Row id="confirmPasswordInput">
                        <Col xs={12}>
                          <Field
                            name="confirmPassword"
                            component={TextField}
                            floatingLabelText="Confirm Password"
                            type="password"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </form>
                  </Grid>
                ) : (
                  <Grid>
                    <Row>
                      <Col xs={12} sm={5} style={{ paddingTop: 40 }}>
                        <FacebookLoginButton onClick={() => signUpWithFacebook()} text="Sign up with Facebook" style={{ marginBottom: 20 }} />
                        <GoogleLoginButton onClick={() => signUpWithGoogle()} />
                      </Col>
                      <Col xs={12} sm={2}>
                        {
                          !lessThanSmall ? (
                            <div>
                              <Row style={{ marginLeft: 45, marginTop: 10, border: '1px solid #979797', height: 60, width: 0 }} />
                              <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 22, width: 48, height: 48, borderRadius: '50%', border: '1px solid grey' }}> OR </Row>
                              <Row style={{ marginLeft: 45, border: '1px solid #979797', height: 60, width: 0 }} />
                            </div>
                          ) : (
                            <Row style={{ marginTop: 16, marginBottom: -7, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Col xs={5} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <hr style={{ height: 0, width: '100%', marginTop: 22 }} />
                              </Col>
                              <Col xs={2} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <div className="circle-responsive">
                                  <div className="circle-content">OR</div>
                                </div>
                              </Col>
                              <Col xs={5} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <hr style={{ height: 0, width: '100%', marginTop: 22 }} />
                              </Col>
                            </Row>
                          )
                        }
                      </Col>
                      <Col xs={12} sm={5} style={{ paddingTop: 80 }}>
                        <RaisedButton style={{ width: lessThanSmall ? '100%' : '90%', marginLeft: lessThanSmall ? 0 : 25 }} onClick={() => this.setState({ continueWithEmail: true })}>
                      Sign Up with Email
                        </RaisedButton>
                      </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 10, color: 'red' }}>
                      {socialSignInError ? fireBaseErrorCode(socialSignInError) : ''}
                    </div>
                  </Grid>
                )}
              </Dialog>
            </div>
          ) : (
            <MenuItem onClick={this.handleOpen}>
              <Dialog
                contentStyle={{ marginBottom: 150, width: '100%' }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                title="Sign Up"
                actions={continueWithEmail ? actions : []}
                modal={false}
                open={this.state.open}
                autoScrollBodyContent
                onRequestClose={this.handleClose}
              >
                {continueWithEmail ? (
                  <Grid>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="firstName"
                            component={TextField}
                            floatingLabelText="First Name"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} >
                          <Field
                            name="lastName"
                            component={TextField}
                            floatingLabelText="Last Name"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="photoFile"
                            component={FileInput}
                            type="file"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="avatar"
                            component={props => (
                              <AvatarPicker
                                value={props.input.value}
                                onChange={(value) => {
                                  props.input.onChange(value)
                                }}
                                images={defaultAccountImages}
                              />)}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={12}>
                          <Field
                            name="email"
                            component={TextField}
                            floatingLabelText="Email"
                            type="email"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Field
                            name="password"
                            component={TextField}
                            floatingLabelText="Password"
                            type="password"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                      <Row id="confirmPasswordInput">
                        <Col xs={12}>
                          <Field
                            name="confirmPassword"
                            component={TextField}
                            floatingLabelText="Confirm Password"
                            type="password"
                            onKeyPress={(ev) => {
                              if (ev.key === 'Enter') {
                                sendSubmit()
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </form>
                  </Grid>
                ) : (
                  <Grid>
                    <Row>
                      <Col xs={12} sm={5} style={{ paddingTop: 40 }}>
                        <FacebookLoginButton onClick={() => signUpWithFacebook()} text="Sign up with Facebook" style={{ marginBottom: 20 }} />
                        <GoogleLoginButton onClick={() => signUpWithGoogle()} />
                      </Col>
                      <Col xs={12} sm={2}>
                        {
                          !lessThanSmall ? (
                            <div>
                              <Row style={{ marginLeft: 45, marginTop: 10, border: '1px solid #979797', height: 60, width: 0 }} />
                              <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 22, width: 48, height: 48, borderRadius: '50%', border: '1px solid grey' }}> OR </Row>
                              <Row style={{ marginLeft: 45, border: '1px solid #979797', height: 60, width: 0 }} />
                            </div>
                          ) : (
                            <Row style={{ marginTop: 16, marginBottom: -7, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Col xs={5} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <hr style={{ height: 0, width: '100%', marginTop: 22 }} />
                              </Col>
                              <Col xs={2} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <div className="circle-responsive">
                                  <div className="circle-content">OR</div>
                                </div>
                              </Col>
                              <Col xs={5} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <hr style={{ height: 0, width: '100%', marginTop: 22 }} />
                              </Col>
                            </Row>
                          )
                        }
                      </Col>
                      <Col xs={12} sm={5} style={{ paddingTop: 80 }}>
                        <RaisedButton style={{ width: lessThanSmall ? '100%' : '90%', marginLeft: lessThanSmall ? 0 : 25 }} onClick={() => this.setState({ continueWithEmail: true })}>
                      Sign Up with Email
                        </RaisedButton>
                      </Col>
                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 10, color: 'red' }}>
                      {socialSignInError ? fireBaseErrorCode(socialSignInError) : ''}
                    </div>
                  </Grid>
                )}
              </Dialog>
              Sign Up
            </MenuItem>
          )
        }
      </div>
    )
  }
}

SignUpForm.propTypes = {
  mobile: PropTypes.bool,
  browser: PropTypes.shape({
    lessThan: PropTypes.shape({
      small: PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  cancelSignInUpForm: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  defaultAccountImages: PropTypes.arrayOf(PropTypes.string).isRequired,
  getDefaultAccountImages: PropTypes.func.isRequired,
  signUpWithGoogle: PropTypes.func.isRequired,
  signUpWithFacebook: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  sendSubmit: PropTypes.func.isRequired
}

SignUpForm.defaultProps = {
  mobile: false
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
