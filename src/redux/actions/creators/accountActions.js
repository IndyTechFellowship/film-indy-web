import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { SIGN_IN, SIGN_UP, SIGN_OUT, SEND_PASSWORD_RESET_EMAIL  } from '../types/accountActionTypes'
import * as algoliaActions from './algoliaActions'

/* this an example of how to chain actions together.
This is a function which takes username and email and and returns a function with the argument of dispatch
which can be used inside the function to dispatch events.
In this case we dispatch the signIn actions and then then it is finished we dispatch a push to the router to go the /dashboard */

const encodeAsFirebaseKey = string => string.replace(/%/g, '%25')
  .replace(/\./g, '%2E')
  .replace(/#/g, '%23')
  .replace(/\$/g, '%24')
  .replace(/\//g, '%2F')
  .replace(/\[/g, '%5B')
  .replace(/\]/g, '%5D')

const migrate = (email, signUpResult, dispatch) => {
  const uid = signUpResult.value.uid
  const emailKey = encodeAsFirebaseKey(email)
  const accountRef = firebase.database().ref('/userAccount')
  const profilesRef = firebase.database().ref('/userProfiles')
  accountRef.child(emailKey).once('value').then((snapshot) => {
    const val = snapshot.val()
    if (val) {
      accountRef.child(emailKey).remove()
      accountRef.child(uid).set(val)
    }
  })
  profilesRef.child(emailKey).once('value').then((snapshot) => {
    const val = snapshot.val()
    if (val) {
      profilesRef.child(emailKey).remove()
      profilesRef.child(uid).set(val)
    }
  })
  return dispatch(algoliaActions.migrateProfile(uid, emailKey)).then(() => dispatch(push('account'))).catch(() => dispatch(push('account')))
}

export const signIn = (email, password) => dispatch => dispatch({
  type: SIGN_IN,
  payload: firebase.auth().signInWithEmailAndPassword(email, password)
}).then(() => dispatch(push('account')))

export const signUp = (email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password)
}).then(result => migrate(email, result, dispatch))

export const signOut = () => dispatch => dispatch({
  type: SIGN_OUT,
  payload: firebase.auth().signOut()
}).then(() => dispatch(push('home')))

export const sendPasswordResetEmail = (emailAddress) => dispatch => dispatch ({
  type: SEND_PASSWORD_RESET_EMAIL,
  payload: firebase.auth().sendPasswordResetEmail(emailAddress),
}).then(() => dispatch(push('home')))
