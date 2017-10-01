import * as firebase from 'firebase'
import { push } from 'react-router-redux'
import { SIGN_IN } from '../types/accountActionTypes'
import { SIGN_UP } from '../types/accountActionTypes'
import { SEND_PASSWORD_RESET_EMAIL} from '../types/accountActionTypes'

/* this an example of how to chain actions together.
This is a function which takes username and email and and returns a function with the argument of dispatch
which can be used inside the function to dispatch events.
In this case we dispatch the signIn actions and then then it is finished we dispatch a push to the router to go the /account */

export const signIn = (email, password) => dispatch => dispatch({
  type: SIGN_IN,
  payload: firebase.auth().signInWithEmailAndPassword(email, password),
}).then(() => dispatch(push('account')));

export const signUp = (email, password) => dispatch => dispatch({
  type: SIGN_UP,
  payload: firebase.auth().createUserWithEmailAndPassword(email, password),
}).then(() => dispatch(push('account')));

export const sendPasswordResetEmail = (emailAddress) => dispatch => dispatch ({
  type: SEND_PASSWORD_RESET_EMAIL,
  payload: firebase.auth().sendPasswordResetEmail(emailAddress),
}).then(() => dispatch(push('account')));
