import { UPDATE_MAP } from '../constants/actionTypes'

const initialState = {}

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAP: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default mapReducer
