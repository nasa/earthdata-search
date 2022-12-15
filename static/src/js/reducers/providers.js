import {
  SET_PROVIDERS
} from '../constants/actionTypes'

const initialState = []

const providersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_PROVIDERS: {
      return action.payload
    }
    default:
      return state
  }
}

export default providersReducer
