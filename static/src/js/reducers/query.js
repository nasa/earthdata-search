import {
  CLEAR_EXCLUDE_GRANULE_ID,
  CLEAR_FILTERS,
  EXCLUDE_GRANULE_ID,
  RESTORE_FROM_URL,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_REGION_QUERY
} from '../constants/actionTypes'

const initialState = {
  collection: {
    byId: {},
    gridName: '',
    keyword: '',
    hasGranulesOrCwic: true,
    pageNum: 1,
    spatial: {},
    temporal: {}
  },
  region: {
    exact: false
  }
}

export const initialGranuleState = {
  excludedGranuleIds: [],
  gridCoords: '',
  pageNum: 1,
  sortKey: '-start_date'
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
    case UPDATE_GRANULE_SEARCH_QUERY: {
      const { payload } = action
      const {
        collectionId
      } = payload

      const { collection = {} } = state
      const { byId: collectionQueryById = {} } = collection
      const { [collectionId]: currentCollection = {} } = collectionQueryById

      return {
        ...state,
        collection: {
          ...state.collection,
          byId: {
            ...collectionQueryById,
            [collectionId]: {
              ...currentCollection,
              granules: {
                ...initialGranuleState,
                ...payload
              }
            }
          }
        }
      }
    }
    case EXCLUDE_GRANULE_ID: {
      const { collectionId, granuleId } = action.payload

      const { collection = {} } = state
      const { byId = {} } = collection
      const { [collectionId]: focusedCollection = {} } = byId
      const { granules = {} } = focusedCollection
      const { excludedGranuleIds = [] } = granules

      return {
        ...state,
        collection: {
          ...collection,
          byId: {
            ...byId,
            [collectionId]: {
              ...focusedCollection,
              granules: {
                ...granules,
                excludedGranuleIds: [
                  ...excludedGranuleIds,
                  granuleId
                ]
              }
            }
          }
        }
      }
    }
    case UNDO_EXCLUDE_GRANULE_ID: {
      const collectionId = action.payload

      const { collection = {} } = state
      const { byId = {} } = collection
      const { [collectionId]: focusedCollection = {} } = byId
      const { granules = {} } = focusedCollection
      const { excludedGranuleIds = [] } = granules

      excludedGranuleIds.pop()

      return {
        ...state,
        collection: {
          ...collection,
          byId: {
            ...byId,
            [collectionId]: {
              ...focusedCollection,
              granules: {
                ...granules,
                excludedGranuleIds
              }
            }
          }
        }
      }
    }
    case CLEAR_EXCLUDE_GRANULE_ID: {
      const { collection = {} } = state
      const { byId = {} } = collection

      const byIdWithNoExcludedGranuleIds = {}

      Object.keys(byId).forEach((id) => {
        const { [id]: focusedCollection = {} } = byId
        const { granules = {} } = focusedCollection

        byIdWithNoExcludedGranuleIds[id] = {
          ...focusedCollection,
          granules: {
            ...granules,
            excludedGranuleIds: []
          }
        }
      })

      return {
        ...state,
        collection: {
          ...collection,
          byId: byIdWithNoExcludedGranuleIds
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
    case CLEAR_FILTERS: {
      return initialState
    }
    default:
      return state
  }
}

export default queryReducer
