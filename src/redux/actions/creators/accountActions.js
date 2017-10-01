import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { SIGN_IN, SIGN_UP, UPDATE_PROFILE } from '../types/accountActionTypes'

/* this an example of how to chain actions together.
This is a function which takes username and email and and returns a function with the argument of dispatch
which can be used inside the function to dispatch events.
In this case we dispatch the signIn actions and then then it is finished we dispatch a push to the router to go the /dashboard */

export const signIn = (email, password) => dispatch => dispatch({
  type: SIGN_IN,
  payload: firebase.auth().signInWithEmailAndPassword(email, password),
}).then(() => dispatch(push('dashboard')));

export const signUp = (fName, lName, email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password),
}).then(() => {updateProfile({displayName: fName + " " + lName, photoURL: ""})});

export const updateProfile = (profile) => dispatch => dispatch({
  type: UPDATE_PROFILE,
  payload: firebase.auth().currentUser.updateProfile(profile),
}).then(() => dispatch(push('dashboard')));
