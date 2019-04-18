import { UPDATE_FOCUSED_COLLECTION } from '../constants/actionTypes'

const initialState = {}

const focusedCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FOCUSED_COLLECTION: {
      return action.payload
    }
    default:
      return state
  }
}

export default focusedCollectionReducer
