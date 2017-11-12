import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
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

class VendorcreateModal extends React.Component {
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
    const { open } = this.state
    const { submitVendorCreate, handleSubmit } = this.props
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
      <div style={{ paddingTop: 10 }}>
        <RaisedButton label="Add" primary onClick={this.handleOpen} />
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
      </div>
    )
  }
}

export default reduxForm({
  form: 'addVendor'
})(VendorcreateModal)
