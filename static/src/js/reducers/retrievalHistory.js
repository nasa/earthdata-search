import { SET_RETRIEVAL_HISTORY } from '../constants/actionTypes'

const initialState = []

const retrievalHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RETRIEVAL_HISTORY: {
      return [
        ...action.payload
      ]
    }
    default:
      return state
  }
}

export default retrievalHistoryReducer
