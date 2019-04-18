import {
  UPDATE_TIMELINE_GRANULES,
  UPDATE_TIMELINE_QUERY,
  UPDATE_TIMELINE_STATE
} from '../constants/actionTypes'

const initialState = {
  collectionId: '',
  intervals: [],
  query: {},
  state: {}
}

const timelineReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TIMELINE_GRANULES: {
      let collectionId
      let intervals
      action.payload.results.forEach((result) => {
        ({ intervals } = result)
        collectionId = result['concept-id']
      })

      return {
        ...state,
        collectionId,
        intervals
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
    case UPDATE_TIMELINE_STATE: {
      const { state: oldState } = state
      const { payload } = action
      return {
        ...state,
        state: {
          ...oldState,
          ...payload
        }
      }
    }
    default:
      return state
  }
}

export default timelineReducer
