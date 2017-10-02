import React from 'react'
import { Card, CardTitle } from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import '../../App.css'

const styles = {
  card: {
    width: '40%',
    height: 'auto',
    marginTop: '1em',
    display: 'block',
    margin: 'auto',
    padding: '1em'
  },
  chipStyle: {
    margin: 6
  }
}

const RoleChipDisplays = (roles, selected, onClick = () => {}) => roles.map((role) => {
  const isSelected = selected.includes(role.roleId)
  const chipStyle = isSelected ? { ...styles.chipStyle, backgroundColor: 'blue' } : styles.chipStyle
  return (
    <Chip id={role.roleId} key={role.roleId} onClick={onClick} style={chipStyle} >{role.roleName}</Chip>
  )
})
class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({ dialogOpen: false })
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }
  handleOpen() {
    this.setState({ dialogOpen: true, selectedRoles: [] })
  }
  handleClose() {
    const { auth, firebase } = this.props
    const uid = get(auth, 'uid', '')
    const { selectedRoles } = this.state
    const roles = Object.keys(get(this.props, 'data.roles', {}))
    const userProfile = get(this.props, `data.userProfiles.${uid}`)
    const roleNames = Object.keys(roles).map(roleId => roles[roleId].roleName)
    const userRoleIds = get(userProfile, 'roles', [])
    const userProfileRolePath = `/userProfiles/${uid}`
    const allRoles = [...userRoleIds, ...selectedRoles]
    this.props.firebase.set(userProfileRolePath, { roles: allRoles })
    this.setState({ dialogOpen: false })
  }
  render() {
    const { auth, profile } = this.props
    const selectedRoles = get(this.state, 'selectedRoles', [])
    const roles = get(this.props, 'data.roles', {})
    const userProfile = get(this.props, `data.userProfiles.${auth.uid}`)
    const roleNames = Object.keys(roles).map(roleId => roles[roleId].roleName)
    const userRoles = get(userProfile, 'roles', []).map(roleId => ({ roleName: get(roles, `${roleId}.roleName`, ''), roleId }))
    const profileImageUrl = get(profile, 'photoURL', '')
    const name = `${get(profile, 'firstName', '')} ${get(profile, 'lastName', '')}`
    const email = get(auth, 'email', '')
    const possibleRolesToAdd = Object.keys(roles).reduce((acc, roleId) => {
      const roleName = get(roles, `${roleId}.roleName`, '')
      const r = userRoles.map(role => role.roleName)
      if (r.includes(roleName)) {
        return acc
      }
      return [...acc, { roleName, roleId }]
    }, [])
    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onClick={this.handleClose}
      />
    ]
    return (
      <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
        <div>
          <Card style={styles.card}>
            <CardTitle title="Edit Profile" />
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
              <Avatar src={profileImageUrl} size={150} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <div style={{ fontWeight: 'bold' }}>{name}</div>
                <div>{email}</div>
              </div>
            </div>
          </Card>
        </div>
        <div style={{ paddingTop: 30 }}>
          <Card style={styles.card}>
            <CardTitle title="Roles" />
            <Divider />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {RoleChipDisplays(userRoles, [])}
            </div>
            <div>
              <RaisedButton label="Add Roles" onClick={this.handleOpen} />
              <Dialog
                title="Add Roles"
                actions={dialogActions}
                modal
                autoScrollBodyContent
                open={this.state.dialogOpen}
              >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  {RoleChipDisplays(possibleRolesToAdd, selectedRoles, (event) => {
                    const roleId = event.currentTarget.id
                    if (selectedRoles.includes(roleId)) {
                      const newRoles = selectedRoles.filter(id => id !== roleId)
                      this.setState({ selectedRoles: newRoles })
                    } else {
                      this.setState({ selectedRoles: [...selectedRoles, roleId] })
                    }
                  })}
                </div>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

EditProfile.propTypes = {
}

EditProfile.defaultProps = {
  account: {}
}

export default EditProfile
