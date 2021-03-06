import React from 'react'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'

const validate = (values) => {
  const errors = {}

  if (!values.title) {
    errors.title = 'A title is required'
  }
  if (!values.url) {
    errors.url = 'A url is required'
  }
  return errors
}

const renderTextField = ({ input, name, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    hintStyle={{ float: 'left' }}
    textareaStyle={{ float: 'left' }}
    floatingLabelText={label}
    errorText={touched && error}
    multiLine={input.name === 'bio'}
    fullWidth
    {...input}
    {...custom}
  />
)

const EditLinkForm = ({ handleSubmit, onDelete }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Field
        name="title"
        component={renderTextField}
        floatingLabelText="Title"
        type="text"
      />
      <Field
        name="url"
        component={renderTextField}
        floatingLabelText="Url"
        type="url"
      />
      <RaisedButton
        style={{ marginTop: 10 }}
        primary
        onClick={onDelete}
        label="Delete"
      />
    </div>
  </form>
)

EditLinkForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'EditLinkForm',
  validate
})(EditLinkForm)
