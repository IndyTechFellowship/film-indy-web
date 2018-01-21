import * as firebase from 'firebase'
import { initialize } from 'redux-form'
import { ADD_PROFILE_LINK, EDIT_PROFILE_LINK, REMOVE_PROFILE_LINK, ADD_PROFILE_YOUTUBE_VIDEO, ADD_PROFILE_VIMEO_VIDEO, EDIT_PROFILE_VIDEO, REMOVE_PROFILE_VIDEO, ADD_CREDIT } from '../types/profileActionTypes'

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
    payload: profileRef.update({ video: newYoutubeVideo })
  }
}

export const addVimeoToProfile = (vimeoVideo, title, url, uid) => {
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)
  const newVimeoVideo = [{ title, url }]
  return {
    type: ADD_PROFILE_VIMEO_VIDEO,
    payload: profileRef.update({ video: newVimeoVideo })
  }
}

export const removeVideo = (video, uid) => {
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)

    return {
      type: REMOVE_PROFILE_VIDEO,
      payload: profileRef.update({ video: video })
    }
}

export const editVideo = (video, newTitle, newUrl, uid) => {
  const newVideo = [...video, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/userProfiles/${uid}`)

    return {
      type: EDIT_PROFILE_VIDEO,
      payload: profileRef.update({ video: newVideo })
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

export const initForm = (formName, data) => dispatch => (dispatch(initialize(formName, data)))

