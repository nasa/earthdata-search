import { UPDATE_FOCUSED_COLLECTION, RESTORE_FROM_URL } from '../constants/actionTypes'

const initialState = ''

const focusedCollectionReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_FOCUSED_COLLECTION: {
      return action.payload
    }
    case RESTORE_FROM_URL: {
      const { focusedCollection = '' } = action.payload

      return focusedCollection
    }
    default:
      return state
  }
}

export default focusedCollectionReducer
