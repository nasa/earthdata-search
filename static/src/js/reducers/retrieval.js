import { UPDATE_RETRIEVAL, UPDATE_RETRIEVAL_COLLECTION } from '../constants/actionTypes'

const initialState = {
  id: null,
  collections: {}
}

const retrievalReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RETRIEVAL: {
      return {
        ...state,
        ...action.payload
      }
    }
    case UPDATE_RETRIEVAL_COLLECTION: {
      const {
        id
      } = action.payload

      return {
        ...state,
        collections: {
          ...state.collections,
          byId: {
            ...state.collections.byId,
            [id]: {
              ...action.payload
            }
          }
        }
      }
    }
    default:
      return state
  }
}

export default retrievalReducer
