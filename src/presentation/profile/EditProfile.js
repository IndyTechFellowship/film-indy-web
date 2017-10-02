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

const RoleChipDisplays = (roles, selected, onClick = () => {}, onDelete) => roles.map((role) => {
  const isSelected = selected.includes(role.roleId)
  const chipStyle = isSelected ? { ...styles.chipStyle, backgroundColor: '#707070' } : styles.chipStyle
  const deleteFunc = onDelete !== undefined ? onDelete.bind(this, role.roleId) : onDelete
  return (
    <Chip id={role.roleId} key={role.roleId} onRequestDelete={deleteFunc} onClick={onClick} style={chipStyle} >{role.roleName}</Chip>
  )
})
class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({ dialogOpen: false })
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleOpen() {
    this.setState({ dialogOpen: true, selectedRoles: [] })
  }
  handleSubmit() {
    const { auth, firebase } = this.props
    const uid = get(auth, 'uid', '')
    const { selectedRoles } = this.state
    const userProfile = get(this.props, `data.userProfiles.${uid}`)
    const userRoleIds = get(userProfile, 'roles', [])
    const userProfileRolePath = `/userProfiles/${uid}`
    const allRoles = [...userRoleIds, ...selectedRoles]
    firebase.set(userProfileRolePath, { roles: allRoles })
    this.setState({ dialogOpen: false })
  }
  handleClose() {
    this.setState({ dialogOpen: false })
  }
  render() {
    const { auth, profile, firebase, data } = this.props
    const uid = get(auth, 'uid', '')
    const selectedRoles = get(this.state, 'selectedRoles', [])
    const roles = get(data, 'roles', {})
    const userProfile = get(data, `userProfiles.${auth.uid}`)
    const userRoles = get(userProfile, 'roles', [])
      .map(roleId => ({ roleName: get(roles, `${roleId}.roleName`, ''), roleId }))
      .sort((a, b) => {
        const aCaps = a.roleName.toUpperCase()
        const bcaps = b.roleName.toUpperCase()
        if (aCaps < bcaps) {
          return -1
        } else if (aCaps > bcaps) {
          return 1
        }
        return 0
      })
    const profileImageUrl = get(profile, 'photoURL', '')
    const name = `${get(profile, 'firstName', '')} ${get(profile, 'lastName', '')}`
    const email = get(auth, 'email', '')
    const userProfileRolePath = `/userProfiles/${uid}`
    const possibleRolesToAdd = Object.keys(roles).reduce((acc, roleId) => {
      const roleName = get(roles, `${roleId}.roleName`, '')
      const r = userRoles.map(role => role.roleName)
      if (r.includes(roleName)) {
        return acc
      }
      return [...acc, { roleName, roleId }]
    }, []).sort((a, b) => {
      const aCaps = a.roleName.toUpperCase()
      const bcaps = b.roleName.toUpperCase()
      if (aCaps < bcaps) {
        return -1
      } else if (aCaps > bcaps) {
        return 1
      }
      return 0
    })
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
        disabled={selectedRoles.length === 0}
        onClick={this.handleSubmit}
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
              {RoleChipDisplays(userRoles, [], () => {}, (roleId) => {
                const filteredRoles = userRoles.filter(role => role.roleId !== roleId).map(role => role.roleId)
                firebase.set(userProfileRolePath, {
                  roles: filteredRoles
                })
              })}
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
  auth: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  profile: PropTypes.shape({
    photoURL: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired,
  data: PropTypes.shape({
    roles: PropTypes.object,
    userProfile: PropTypes.object
  }).isRequired,
  firebase: PropTypes.shape({
    set: PropTypes.func
  }).isRequired
}

EditProfile.defaultProps = {
  account: {}
}

export default EditProfile
