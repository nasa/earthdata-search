import {
  UPDATE_GRANULE_METADATA
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {}
}

const granuleMetadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULE_METADATA: {
      const [granuleId] = Object.keys(action.payload)
      const allIds = [granuleId]
      const byId = {
        [granuleId]: action.payload[granuleId]
      }

      return {
        ...state,
        allIds: [
          ...state.allIds,
          ...allIds
        ],
        byId: {
          ...state.byId,
          ...byId
        }
      }
    }
    default:
      return state
  }
}

export default granuleMetadataReducer
