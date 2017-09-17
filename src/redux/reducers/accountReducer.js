import { SIGN_IN } from '../actions/types/accountActionTypes'

const initalState = {

}

export default (state = initalState, action) => {
  switch (action.type) {
    case `${SIGN_IN}_ERROR`:
      return {
        ...state,
        signInError: action.payload,
      }
    default:
      return state
  }
}
