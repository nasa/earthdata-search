import { SET_USER } from '../constants/actionTypes'

const initialState = {}

const userReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_USER: {
      const { username } = action.payload
      return {
        username
      }
    }
    default:
      return state
  }
}

export default userReducer
