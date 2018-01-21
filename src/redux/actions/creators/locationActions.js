import * as firebase from 'firebase'
import { EDIT_LOCATION_PROFILE_LINK, ADD_LOCATION_PROFILE_LINK, REMOVE_LOCATION_PROFILE_LINK,
  ADD_LOCATION_YOUTUBE, ADD_LOCATION_VIMEO, REMOVE_LOCATION_VIDEO, EDIT_LOCATION_VIDEO, UPDATE_LOCATION_PROFILE } from '../types/locationActionTypes'

export const updateLocationProfile = (values, locationId) => {
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)
  return {
    type: UPDATE_LOCATION_PROFILE,
    payload: profileRef.update({ ...values })
  }
}

export const addLinkToLocationProfile = (userLinks, title, url, locationId) => {
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)
  const links = [...userLinks, { title, url }]
  return {
    type: ADD_LOCATION_PROFILE_LINK,
    payload: profileRef.update({ links })
  }
}

export const removeLocationProfileLink = (userLinks, indexToRemove, locationId) => {
  userLinks.splice(indexToRemove, 1)
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)
  return {
    type: REMOVE_LOCATION_PROFILE_LINK,
    payload: profileRef.update({ links: userLinks })
  }
}

export const editLocationProfileLink = (userLinks, indexToRemove, newTitle, newUrl, locationId) => {
  userLinks.splice(indexToRemove, 1)
  const newLinks = [...userLinks, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)
  return {
    type: EDIT_LOCATION_PROFILE_LINK,
    payload: profileRef.update({ links: newLinks })
  }
}
export const addYoutubeToLocationProfile = (youtubeVideo, title, url, locationId) => {
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)
  const newYoutubeVideo = [{ title, url }]
  return {
    type: ADD_LOCATION_YOUTUBE,
    payload: profileRef.update({ video: newYoutubeVideo })
  }
}

export const addVimeoToLocationProfile = (vimeoVideo, title, url, locationId) => {
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)
  const newVimeoVideo = [{ title, url }]
  return {
    type: ADD_LOCATION_VIMEO,
    payload: profileRef.update({ video: newVimeoVideo })
  }
}

export const removeLocationVideo = (video, locationId) => {
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)

    return {
      type: REMOVE_LOCATION_VIDEO,
      payload: profileRef.update({ video: [] })
    }
}

export const editLocationVideo = (video, newTitle, newUrl, locationId) => {
  const newVideo = [...video, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/locationProfiles/${locationId}`)

    return {
      type: EDIT_LOCATION_VIDEO,
      payload: profileRef.update({ video: newVideo })
    }
}
