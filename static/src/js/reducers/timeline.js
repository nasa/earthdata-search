import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  RESTORE_FROM_URL
} from '../constants/actionTypes'

const initialState = {
  intervals: {},
  query: {}
}

const timelineReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_TIMELINE_INTERVALS: {
      const newIntervals = {}
      action.payload.results.forEach((result) => {
        const {
          'concept-id': collectionId,
          intervals
        } = result

        newIntervals[collectionId] = intervals
      })

      return {
        ...state,
        intervals: {
          ...state.intervals,
          ...newIntervals
        }
      }
    }
    case UPDATE_TIMELINE_QUERY: {
      const { query: oldQuery } = state
      const { payload } = action

      return {
        ...state,
        query: {
          ...oldQuery,
          ...payload
        }
      }
    }
    case RESTORE_FROM_URL: {
      const { timeline = initialState.query } = action.payload

      return {
        ...state,
        query: {
          ...state.query,
          ...timeline
        }
      }
    }
    default:
      return state
  }
}

export default timelineReducer
