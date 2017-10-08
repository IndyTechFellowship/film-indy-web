import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { SIGN_IN, SIGN_UP, SIGN_OUT } from '../types/accountActionTypes'
import * as algoliaActions from './algoliaActions'

/* this an example of how to chain actions together.
 This is a function which takes username and email and and returns a function with the argument of dispatch
 which can be used inside the function to dispatch events.
 In this case we dispatch the signIn actions and then then it is finished we dispatch a push to the router to go the /dashboard */

// const migrateOrUpdate = (firstName, lastName, photoFile, email) => {
//   const userMigrationRef = firebase.database().ref('/userMigration')
//   userMigrationRef.orderByChild('email').equalTo(email).once('value').then((snapshot) => {
//     const dataToMigrate = snapshot.val()
//     if (dataToMigrate !== null) {
//       const uid = firebase.auth().currentUser.uid
//       const key = Object.keys(dataToMigrate)[0]
//       const userToMigrate = dataToMigrate[key]
//       const roles = userToMigrate.roles
//       const firstName = userToMigrate.firstName
//       const lastName = userToMigrate.lastName
//       const profilesRef = firebase.database().ref(`/userProfiles/${uid}/roles`)
//       const accountRef = firebase.database().ref(`/userAccount/${uid}`)
//       profilesRef.set(roles)
//       accountRef.set({
//         firstName,
//         lastName,
//       })
//     }
//   })
//   const uid = firebase.auth().currentUser.uid
//   const accountRef = firebase.database().ref(`/userAccount/${uid}`)
//   accountRef.set({
//     firstName,
//     lastName,
//     photoFile
//   })
// }

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

export const signUp = (firstName, lastName, photoFile, email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password)
}).then(result => migrate(email, result, dispatch))

export const signOut = () => dispatch => dispatch({
  type: SIGN_OUT,
  payload: firebase.auth().signOut()
}).then(() => dispatch(push('home')))
