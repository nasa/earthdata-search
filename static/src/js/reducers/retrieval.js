import { UPDATE_RETRIEVAL } from '../constants/actionTypes'

const initialState = {
  id: null,
  collections: {
    download: []
  }
}

const retrievalReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RETRIEVAL: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default retrievalReducer
