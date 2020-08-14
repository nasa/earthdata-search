import {
  CLEAR_FILTERS,
  EXCLUDE_GRANULE_ID,
  INITIALIZE_COLLECTION_GRANULES_QUERY,
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
    case INITIALIZE_COLLECTION_GRANULES_QUERY: {
      const collectionId = action.payload

      const { collection = {} } = state
      const { byId = {} } = collection
      const { [collectionId]: focusedCollection = {} } = byId
      const { granules: focusedCollectionGranules = {} } = focusedCollection

      return {
        ...state,
        collection: {
          ...state.collection,
          byId: {
            ...state.collection.byId,
            [collectionId]: {
              ...focusedCollection,
              granules: {
                ...initialGranuleState,
                ...focusedCollectionGranules
              }
            }
          }

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
      const { granules = {} } = currentCollection

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
                ...granules,
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
