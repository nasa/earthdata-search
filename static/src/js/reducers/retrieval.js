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
        id,
        access_method: accessMethod
      } = action.payload

      const {
        type
      } = accessMethod

      const collectionKey = `${type.toLowerCase().replace(/ /g, '_')}`

      return {
        ...state,
        collections: {
          ...state.collections,
          [collectionKey]: {
            ...state.collections[collectionKey],
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
