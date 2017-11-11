import { replace } from 'react-router-redux'
import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect'

export default connectedReduxRedirect({
  redirectPath: '/',
  allowRedirectBack: true,
  authenticatingSelector: ({ firebase: { auth, isInitializing } }) =>
    !auth.isLoaded || isInitializing === true,
  authenticatedSelector: ({ firebase: { auth } }) =>
    auth && auth.isLoaded && !auth.isEmpty,
  wrapperDisplayName: 'UserIsAuthenticated',
  redirectAction: replace
})
