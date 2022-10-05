import {
  CLEAR_FILTERS,
  EXCLUDE_GRANULE_ID,
  INITIALIZE_COLLECTION_GRANULES_QUERY,
  RESTORE_FROM_URL,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_FILTERS,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_REGION_QUERY
} from '../constants/actionTypes'

const initialState = {
  collection: {
    byId: {},
    keyword: '',
    hasGranulesOrCwic: true,
    pageNum: 1,
    spatial: {},
    temporal: {},
    sortKey: ['-usage_score']
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

const queryReducer = (state = initialState, action = {}) => {
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
      const { collectionId, granuleSortPreference } = action.payload

      const { collection = {} } = state
      const { byId = {} } = collection
      const { [collectionId]: focusedCollection = {} } = byId
      const { granules: focusedCollectionGranules = {} } = focusedCollection

      const initialGranuleStateWithPreferences = initialGranuleState
      if (granuleSortPreference !== 'default') {
        initialGranuleStateWithPreferences.sortKey = granuleSortPreference
      }

      return {
        ...state,
        collection: {
          ...state.collection,
          byId: {
            ...state.collection.byId,
            [collectionId]: {
              ...focusedCollection,
              granules: {
                ...initialGranuleStateWithPreferences,
                ...focusedCollectionGranules
              }
            }
          }

        }
      }
    }
    // Updates the granule search query, throwing out all existing values
    case UPDATE_GRANULE_FILTERS: {
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
    // Updates the granule search query, keeping existing values
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
                ],
                pageNum: 1
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

      const { collection, collectionSortPreference } = query

      const initialCollectionQueryWithPreferences = { ...initialState.collection }
      if (collectionSortPreference !== 'default') {
        initialCollectionQueryWithPreferences.sortKey = collectionSortPreference === 'relevance' ? undefined : [collectionSortPreference]
      }

      return {
        ...state,
        ...query,
        collection: {
          ...initialCollectionQueryWithPreferences,
          ...collection
        }
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
