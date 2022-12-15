import { SET_DATA_QUALITY_SUMMARIES } from '../constants/actionTypes'

const initialState = {}

const dataQualitySummariesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DATA_QUALITY_SUMMARIES: {
      const { catalogItemId, dataQualitySummaries } = action.payload

      return {
        ...state,
        [catalogItemId]: dataQualitySummaries
      }
    }
    default:
      return state
  }
}

export default dataQualitySummariesReducer
