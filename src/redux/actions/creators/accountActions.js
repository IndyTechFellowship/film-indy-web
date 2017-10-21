import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { omitBy } from 'lodash'
import { submit } from 'redux-form'
import { SIGN_IN, SIGN_UP, SIGN_OUT, SEND_PASSWORD_RESET_EMAIL } from '../types/accountActionTypes'
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

const migrateOrCreateUserAccountEntry = (uid, emailKey, snapshot, accountDataToSave, accountRef, dispatch) => {
  const val = snapshot.val()
  if (val) {
    // an account already exists, migrate the account
    const accountData = omitBy(accountDataToSave, i => !i)
    const nameUpdates = omitBy({ firstName: accountDataToSave.firstName, lastName: accountDataToSave.lastName, public: true }, i => !i)
    // migrate the name index with the new uid
    dispatch(algoliaActions.migrateName(uid, emailKey, nameUpdates))
    accountRef.child(emailKey).remove()
    if (accountData.photoFile) {
      firebase.uploadFile(`/images/users/account/${uid}/account_image`, accountData.photoFile).then((response) => {
        accountRef.child(uid).set({
          ...val,
          ...accountData,
          photoURL: response.downloadURL,
          public: true
        })
      })
    } else {
      accountRef.child(uid).set({
        ...val,
        ...accountData,
        public: true
      })
    }
  } else {
    // no row in the userAccount table exists with that email, totally new user
    const accountData = omitBy(accountDataToSave, i => !i)
    const nameUpdates = omitBy({ firstName: accountDataToSave.firstName, lastName: accountDataToSave.lastName }, i => !i)
    dispatch(algoliaActions.addToNameIndex(uid, { ...nameUpdates, public: false }))
    if (accountData.photoFile) {
      firebase.uploadFile(`/images/users/account/${uid}/account_image`, accountData.photoFile).then((response) => {
        accountRef.child(uid).set({
          ...accountData,
          photoURL: response.downloadURL,
          public: false
        })
      })
    } else {
      accountRef.child(uid).set({
        ...accountData,
        public: false
      })
    }
  }
}

const migrate = (accountDataToSave, signUpResult, dispatch) => {
  const uid = firebase.auth().currentUser.uid
  const emailKey = encodeAsFirebaseKey(accountDataToSave.email)
  const accountRef = firebase.database().ref('/userAccount')
  const profilesRef = firebase.database().ref('/userProfiles')
  accountRef.child(emailKey).once('value').then((snapshot) => {
    migrateOrCreateUserAccountEntry(uid, emailKey, snapshot, accountDataToSave, accountRef, dispatch)
  })
  profilesRef.child(emailKey).once('value').then((snapshot) => {
    const val = snapshot.val()
    if (val) {
      profilesRef.child(emailKey).remove()
      profilesRef.child(uid).set(val)
      dispatch(algoliaActions.migrateProfile(uid, emailKey))
    } else {
      profilesRef.child(uid).set({
        public: false
      }).then(() => dispatch(algoliaActions.createProfileRecord(uid, { public: false, roles: [] })))
    }
  })
  return dispatch(push('account'))
}

export const signIn = (email, password) => dispatch => dispatch({
  type: SIGN_IN,
  payload: firebase.auth().signInWithEmailAndPassword(email, password)
}).then(() => dispatch(push('account')))

export const signUp = (firstName, lastName, photoFile, email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password)
}).then((result) => {
  const accountDataToSave = {
    firstName,
    lastName,
    email,
    photoFile
  }
  migrate(accountDataToSave, result, dispatch)
})

export const signOut = () => dispatch => dispatch({
  type: SIGN_OUT,
  payload: firebase.auth().signOut()
}).then(() => dispatch(push('home')))

export const sendPasswordResetEmail = emailAddress => dispatch => dispatch({
  type: SEND_PASSWORD_RESET_EMAIL,
  payload: firebase.auth().sendPasswordResetEmail(emailAddress)
}).then(() => dispatch(push('login')))

export const updateAuth = result => dispatch => dispatch({
  type: '@@reactReduxFirebase/AUTH_UPDATE_SUCCESS',
  auth: result
})

export const submitSignUp = () => dispatch => dispatch(submit('signUp'))
