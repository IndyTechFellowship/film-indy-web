import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { Field, reduxForm } from 'redux-form'

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

class VendorCreateModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.handleClose = this.handleClose.bind(this)
  }


  handleClose() {
    const { onCancel } = this.props
    onCancel()
  }

  render() {
    const { submitVendorCreate, handleSubmit, open } = this.props
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={() => {
          submitVendorCreate()
          this.setState({ open: false })
        }}
      />
    ]

    return (
      <Dialog
        title="Create a Vendor"
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={this.handleClose}
      >
        <form onSubmit={handleSubmit}>
          <div className="fields">
            <div>
              <Field
                name="name"
                component={renderTextField}
                floatingLabelText="Name"
                type="text"
              />
            </div>
          </div>
        </form>
      </Dialog>
    )
  }
}

VendorCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitVendorCreate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'addVendor'
})(VendorCreateModal)

