import { SET_ADMIN_IS_AUTHORIZED } from '../../constants/actionTypes'

const initialState = false

const adminIsAuthorizedReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADMIN_IS_AUTHORIZED: {
      return action.payload
    }
    default:
      return state
  }
}

export default adminIsAuthorizedReducer
