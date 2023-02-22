import { SET_DATA_QUALITY_SUMMARIES } from '../constants/actionTypes'

const initialState = {}
// TODO: We need to use this to put in the data quality-summary data
const dataQualitySummariesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DATA_QUALITY_SUMMARIES: {
      const { catalogItemId, dataQualitySummaries } = action.payload
      console.log('this is the payload that hte reducer is getting', action.payload)
      console.log('This is the dataQualitySummaries in the reducer payload', dataQualitySummaries)
      console.log('This is the catalogItemId in the reducer payload', catalogItemId)
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
