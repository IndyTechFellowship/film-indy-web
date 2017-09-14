import { HOME_PAGE_BUTTON_PRESSED } from '../actions/types/exampleActionTypes'

const initalState = {
  timesButtonPressed: 0,
}

export default (state = initalState, action) => {
  switch (action.type) {
    case HOME_PAGE_BUTTON_PRESSED:
      return {
        ...state,
        timesButtonPressed: state.timesButtonPressed + 1,
      }
    default:
      return state
  }
}
