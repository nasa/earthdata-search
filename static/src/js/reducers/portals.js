import { ADD_PORTAL } from '../constants/actionTypes'

const initialState = {
  portalId: ''
}

const portalsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_PORTAL: {
      return action.payload
    }
    default:
      return state
  }
}

export default portalsReducer
