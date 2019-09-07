import { findIndex } from 'lodash'
import { SET_RETRIEVAL_HISTORY, REMOVE_RETRIEVAL_HISTORY } from '../constants/actionTypes'

const initialState = []

const retrievalHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RETRIEVAL_HISTORY: {
      return [
        ...action.payload
      ]
    }
    case REMOVE_RETRIEVAL_HISTORY: {
      const index = findIndex(state, r => r.id === action.payload)

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]
    }
    default:
      return state
  }
}

export default retrievalHistoryReducer
