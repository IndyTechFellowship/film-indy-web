import React from 'react'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import Path from 'path-parser'
import { replace } from 'react-router-redux'
import { get, isEmpty } from 'lodash'

const LoadingScreen = () => (
  <div> Loading </div>
)

export default connectedRouterRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  AuthenticatingComponent: LoadingScreen,
  allowRedirectBack: false,
  redirectPath: '/',
  authenticatingSelector: ({ firebase: { auth, isInitializing, data } }) => {
    if (auth.isLoaded || isInitializing === false) {
      if (!isEmpty(data.usersVendors)) {
        return false
      }
      return true
    }
    return true
  },
  authenticatedSelector: ({ firebase: { auth, data } }) => {
    const p = new Path('/vendor/:vendorId/edit')
    const maybeVendorId = p.test(window.location.pathname)
    const vendorId = get(maybeVendorId, 'vendorId', '')
    if (auth.isLoaded && !auth.isEmpty) {
      const userOwnsVendors = Object.keys(data.usersVendors || []).find(vId => vId === vendorId)
      if (userOwnsVendors) {
        return true
      }
      return false
    }
    return false
  },
  redirectAction: newLoc => (dispatch) => {
    dispatch(replace(newLoc))
    dispatch({ type: 'UNAUTHED_REDIRECT' })
  }
})
