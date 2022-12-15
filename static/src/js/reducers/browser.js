import {
  UPDATE_BROWSER_VERSION
} from '../constants/actionTypes'

const initialState = {}

const browserReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_BROWSER_VERSION: {
      const { payload } = action
      return {
        ...payload
      }
    }
    default:
      return state
  }
}

export default browserReducer
