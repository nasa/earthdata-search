import { RESTORE_FROM_URL } from '../constants/actionTypes'

const initialState = {
  portalId: ''
}

const portalsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case RESTORE_FROM_URL: {
      const { portal } = action.payload

      return portal
    }

    default:
      return state
  }
}

export default portalsReducer
