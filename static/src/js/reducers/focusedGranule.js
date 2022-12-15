import { UPDATE_FOCUSED_GRANULE, RESTORE_FROM_URL } from '../constants/actionTypes'

const initialState = ''

const focusedGranuleReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_FOCUSED_GRANULE: {
      return action.payload
    }
    case RESTORE_FROM_URL: {
      const { focusedGranule = '' } = action.payload

      return focusedGranule
    }
    default:
      return state
  }
}

export default focusedGranuleReducer
