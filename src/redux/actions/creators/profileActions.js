import * as firebase from 'firebase'
import { initialize } from 'redux-form'
import * as algoliaActions from './algoliaActions'
import { ADD_PROFILE_LINK, EDIT_PROFILE_LINK, REMOVE_PROFILE_LINK, ADD_PROFILE_YOUTUBE_VIDEO, ADD_PROFILE_VIMEO_VIDEO, EDIT_PROFILE_VIDEO, REMOVE_PROFILE_VIDEO, ADD_CREDIT, DELETE_CREDIT, DELETE_ROLE } from '../types/profileActionTypes'

export const addLinkToProfile = (userLinks, title, url, uid) => {
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  const links = [...userLinks, { title, url }]
  return {
    type: ADD_PROFILE_LINK,
    payload: profileRef.update({ links })
  }
}

export const removeProfileLink = (userLinks, indexToRemove, uid) => {
  userLinks.splice(indexToRemove, 1)
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  return {
    type: REMOVE_PROFILE_LINK,
    payload: profileRef.update({ links: userLinks })
  }
}

export const editProfileLink = (userLinks, indexToRemove, newTitle, newUrl, uid) => {
  userLinks.splice(indexToRemove, 1)
  const newLinks = [...userLinks, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  return {
    type: EDIT_PROFILE_LINK,
    payload: profileRef.update({ links: newLinks })
  }
}

export const addYoutubeToProfile = (youtubeVideo, title, url, uid) => {
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  const newYoutubeVideo = [{ title, url }]
  return {
    type: ADD_PROFILE_YOUTUBE_VIDEO,
    payload: profileRef.update({ youtubeVideo: newYoutubeVideo })
  }
}

export const addVimeoToProfile = (vimeoVideo, title, url, uid) => {
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  const newVimeoVideo = [{ title, url }]
  return {
    type: ADD_PROFILE_VIMEO_VIDEO,
    payload: profileRef.update({ vimeoVideo: newVimeoVideo })
  }
}

export const removeVideo = (video, videoType, uid) => {
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)

  if (videoType === 1) {
    return {
      type: REMOVE_PROFILE_VIDEO,
      payload: profileRef.update({ youtubeVideo: video })
    }
  }
  return {
    type: REMOVE_PROFILE_VIDEO,
    payload: profileRef.update({ vimeoVideo: video })
  }
}

export const editVideo = (video, videoType, newTitle, newUrl, uid) => {
  const newVideo = [...video, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)

  if (videoType === 1) {
    return {
      type: EDIT_PROFILE_VIDEO,
      payload: profileRef.update({ youtubeVideo: newVideo })
    }
  }
  return {
    type: EDIT_PROFILE_VIDEO,
    payload: profileRef.update({ vimeoVideo: newVideo })
  }
}


export const addCredit = (userCredits, credit, uid) => {
  const credits = [...userCredits, credit]
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  return {
    type: ADD_CREDIT,
    payload: profileRef.update({ credits })
  }
}

export const deleteRole = (userRoles, userCredits, role, uid) => (dispatch) => {
  const newCredits = userCredits.filter(credit => credit.roleId !== role.roleId)
  const newRoles = userRoles.filter(userRole => userRole.roleId !== role.roleId)
  const rolesNames = newRoles.map(newRole => newRole.roleName)
  const roleIds = newRoles.map(newRole => newRole.roleId)
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  return dispatch({
    type: DELETE_ROLE,
    payload: profileRef.update({ credits: newCredits, roles: roleIds })
  }).then(() => dispatch(algoliaActions.deleteRolesFromProfile(rolesNames, uid)))
}

export const deleteCredit = (userCredits, credit, uid) => {
  const credits = userCredits.filter(userCredit => userCredit.roleId !== credit.roleId)
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  return {
    type: DELETE_CREDIT,
    payload: profileRef.update({ credits })
  }
}

export const initForm = (formName, data) => dispatch => (dispatch(initialize(formName, data)))

