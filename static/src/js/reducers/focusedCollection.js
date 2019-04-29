import { UPDATE_FOCUSED_COLLECTION } from '../constants/actionTypes'

const initialState = {
  collectionId: null,
  metadata: {}
}

const focusedCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FOCUSED_COLLECTION: {
      const value = action.payload ? action.payload : { ...initialState }
      return value
    }
    default:
      return state
  }
}

export default focusedCollectionReducer
