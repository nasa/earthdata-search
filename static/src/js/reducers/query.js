import {
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_QUERY,
  UPDATE_REGION_QUERY,
  RESTORE_FROM_URL
} from '../constants/actionTypes'

const initialState = {
  collection: {
    pageNum: 1,
    spatial: {},
    temporal: {},
    gridName: '',
    hasGranulesOrCwic: true
  },
  granule: {
    pageNum: 1,
    gridCoords: ''
  },
  region: {
    exact: false
  }
}

const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COLLECTION_QUERY: {
      return {
        ...state,
        collection: {
          ...state.collection,
          ...action.payload
        }
      }
    }
    case UPDATE_GRANULE_QUERY: {
      return {
        ...state,
        granule: {
          ...state.granule,
          ...action.payload
        }
      }
    }
    case UPDATE_REGION_QUERY: {
      return {
        ...state,
        region: {
          ...state.region,
          ...action.payload
        }
      }
    }
    case RESTORE_FROM_URL: {
      const { query } = action.payload

      return {
        ...state,
        ...query
      }
    }
    default:
      return state
  }
}

export default queryReducer
