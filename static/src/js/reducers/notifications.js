import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DIMISSED
} from '../constants/actionTypes'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case PUSHING_NOTIFICATION:
      return state
    case NOTIFICATION_PUSHED:
      return state
    case NOTIFICATION_DIMISSED:
      return state
    default:
      return state
  }
}
