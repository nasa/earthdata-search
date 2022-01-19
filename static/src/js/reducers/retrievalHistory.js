import { findIndex } from 'lodash'
import {
  SET_RETRIEVAL_HISTORY,
  SET_RETRIEVAL_HISTORY_LOADING,
  REMOVE_RETRIEVAL_HISTORY
} from '../constants/actionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  history: []
}

const retrievalHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RETRIEVAL_HISTORY_LOADING: {
      return {
        ...state,
        isLoading: true
      }
    }
    case SET_RETRIEVAL_HISTORY: {
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        history: [
          ...action.payload
        ]
      }
    }
    case REMOVE_RETRIEVAL_HISTORY: {
      const { history } = state
      const index = findIndex(history, (r) => r.id === action.payload)

      return {
        ...state,
        history: [
          ...history.slice(0, index),
          ...history.slice(index + 1)
        ]
      }
    }
    default:
      return state
  }
}

export default retrievalHistoryReducer
