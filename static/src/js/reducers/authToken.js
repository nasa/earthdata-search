import { UPDATE_AUTH } from '../constants/actionTypes'

const initialState = ''

const authTokenReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_AUTH: {
      return action.payload
    }
    default:
      return state
  }
}

export default authTokenReducer
