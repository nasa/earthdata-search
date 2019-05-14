import { UPDATE_FOCUSED_GRANULE } from '../constants/actionTypes'

const initialState = ''

const focusedGranuleReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FOCUSED_GRANULE: {
      return action.payload
    }
    default:
      return state
  }
}

export default focusedGranuleReducer
