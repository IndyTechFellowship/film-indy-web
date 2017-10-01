import { SIGN_IN } from '../actions/types/accountActionTypes'
import { SIGN_UP } from '../actions/types/accountActionTypes'
import { SEND_PASSWORD_RESET_EMAIL } from '../actions/types/accountActionTypes'

const initalState = {

};

export default (state = initalState, action) => {
  switch (action.type) {
    case `${SIGN_IN}_ERROR`:
      return {
        ...state,
        signInError: action.payload,
      };
    case `${SIGN_UP}_ERROR`:
      return {
        ...state,
        signUpError: action.payload,
    };
    case `${SEND_PASSWORD_RESET_EMAIL}_ERROR`:
      return {
        ...state,
        sendPasswordResetEmailError: action.payload,
      };
    default:
      return state
  }
}
