import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  RESTORE_FROM_URL,
  TOGGLE_TIMELINE
} from '../constants/actionTypes'

const initialState = {
  intervals: {},
  query: {},
  isOpen: true
}

const timelineReducer = (state = initialState, action) => {
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
      const { timeline = initialState } = action.payload

      return {
        ...state,
        query: {
          ...state.query,
          ...timeline
        }
      }
    }
    case TOGGLE_TIMELINE: {
      return {
        ...state,
        isOpen: action.payload
      }
    }
    default:
      return state
  }
}

export default timelineReducer
