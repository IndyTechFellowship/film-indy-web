import * as firebase from 'firebase'
import { EDIT_VENDOR_PROFILE_LINK, ADD_VENDOR_PROFILE_LINK, REMOVE_VENDOR_PROFILE_LINK,
  ADD_VENDOR_YOUTUBE, ADD_VENDOR_VIMEO, REMOVE_VENDOR_VIDEO, EDIT_VENDOR_VIDEO, UPDATE_VENDOR_PROFILE } from '../types/vendorActionTypes'

export const updateVendorProfile = (values, vendorId) => {
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)
  return {
    type: UPDATE_VENDOR_PROFILE,
    payload: profileRef.update({ ...values })
  }
}

export const addLinkToVendorProfile = (userLinks, title, url, vendorId) => {
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)
  const links = [...userLinks, { title, url }]
  return {
    type: ADD_VENDOR_PROFILE_LINK,
    payload: profileRef.update({ links })
  }
}

export const removeVendorProfileLink = (userLinks, indexToRemove, vendorId) => {
  userLinks.splice(indexToRemove, 1)
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)
  return {
    type: REMOVE_VENDOR_PROFILE_LINK,
    payload: profileRef.update({ links: userLinks })
  }
}

export const editVendorProfileLink = (userLinks, indexToRemove, newTitle, newUrl, vendorId) => {
  userLinks.splice(indexToRemove, 1)
  const newLinks = [...userLinks, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)
  return {
    type: EDIT_VENDOR_PROFILE_LINK,
    payload: profileRef.update({ links: newLinks })
  }
}
export const addYoutubeToVendorProfile = (youtubeVideo, title, url, vendorId) => {
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)
  const newYoutubeVideo = [{ title, url }]
  return {
    type: ADD_VENDOR_YOUTUBE,
    payload: profileRef.update({ youtubeVideo: newYoutubeVideo })
  }
}

export const addVimeoToVendorProfile = (vimeoVideo, title, url, vendorId) => {
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)
  const newVimeoVideo = [{ title, url }]
  return {
    type: ADD_VENDOR_VIMEO,
    payload: profileRef.update({ vimeoVideo: newVimeoVideo })
  }
}

export const removeVendorVideo = (video, videoType, vendorId) => {
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)

  if (videoType === 1) {
    return {
      type: REMOVE_VENDOR_VIDEO,
      payload: profileRef.update({ youtubeVideo: [] })
    }
  }
  return {
    type: REMOVE_VENDOR_VIDEO,
    payload: profileRef.update({ vimeoVideo: [] })
  }
}

export const editVendorVideo = (video, videoType, newTitle, newUrl, vendorId) => {
  const newVideo = [...video, { title: newTitle, url: newUrl }]
  const profileRef = firebase.database().ref(`/vendorProfiles/${vendorId}`)

  if (videoType === 1) {
    return {
      type: EDIT_VENDOR_VIDEO,
      payload: profileRef.update({ youtubeVideo: newVideo })
    }
  }
  return {
    type: EDIT_VENDOR_VIDEO,
    payload: profileRef.update({ vimeoVideo: newVideo })
  }
}
