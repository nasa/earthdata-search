import {
  SET_RETRIEVAL_LOADING,
  UPDATE_RETRIEVAL,
  UPDATE_RETRIEVAL_COLLECTION,
  SET_RETRIEVAL_COLLECTION_LOADING
} from '../constants/actionTypes'

const initialState = {
  id: null,
  collections: {},
  isLoading: false,
  isLoaded: false
}

const retrievalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_RETRIEVAL_LOADING: {
      return {
        ...state,
        isLoading: true
      }
    }
    case UPDATE_RETRIEVAL: {
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isLoaded: true
      }
    }
    case SET_RETRIEVAL_COLLECTION_LOADING: {
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
              ...state.collections.byId[id],
              isLoading: true
            }
          }
        }
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
              ...action.payload,
              isLoading: false,
              isLoaded: true
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
