import {
  CLEAR_COLLECTION_GRANULES,
  EXCLUDE_GRANULE_ID,
  UNDO_EXCLUDE_GRANULE_ID,
  CLEAR_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_METADATA,
  TOGGLE_COLLECTION_VISIBILITY,
  UPDATE_COLLECTION_GRANULE_FILTERS,
  RESTORE_FROM_URL,
  STARTED_GRANULES_TIMER,
  LOADING_GRANULES,
  LOADED_GRANULES,
  RESET_GRANULE_RESULTS,
  FINISHED_GRANULES_TIMER,
  UPDATE_GRANULE_RESULTS,
  ADD_MORE_GRANULE_RESULTS,
  UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {}
}

const initialGranuleState = {
  allIds: [],
  byId: {},
  hits: null,
  isCwic: null,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  timerStart: null
}

const processResults = (results) => {
  const byId = {}
  const allIds = []
  results.forEach((result) => {
    const { id } = result
    byId[id] = result
    allIds.push(id)
  })

  return { byId, allIds }
}

const collectionMetadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_COLLECTION_GRANULES: {
      const byId = {}

      state.allIds.forEach((id) => {
        const collection = state.byId[id]
        const {
          excludedGranuleIds,
          metadata,
          ummMetadata,
          formattedMetadata
        } = collection
        byId[id] = {
          ...collection,
          excludedGranuleIds,
          granules: {},
          metadata,
          ummMetadata,
          formattedMetadata
        }
      })

      return {
        ...state,
        byId
      }
    }
    case UPDATE_COLLECTION_METADATA: {
      const allIds = []
      const byId = {
        ...state.byId
      }
      action.payload.forEach((collection, index) => {
        const [collectionId] = Object.keys(collection)
        const {
          metadata,
          ummMetadata,
          formattedMetadata,
          isCwic
        } = action.payload[index][collectionId]

        if (state.allIds.indexOf(collectionId) === -1) allIds.push(collectionId)

        let currentCollectionGranuleParams = {}
        let excludedGranuleIds = []
        let granuleFilters = { sortKey: '-start_date' }
        let granules = {}
        let isVisible = true
        if (state.byId[collectionId]) {
          ({
            currentCollectionGranuleParams,
            excludedGranuleIds,
            granuleFilters,
            granules,
            isVisible
          } = state.byId[collectionId])
        }
        byId[collectionId] = {
          currentCollectionGranuleParams,
          excludedGranuleIds,
          formattedMetadata,
          granuleFilters,
          granules,
          isCwic,
          isVisible,
          metadata,
          ummMetadata
        }
      })

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
    case RESTORE_FROM_URL: {
      const { collections } = action.payload

      return {
        ...state,
        ...collections
      }
    }
    case EXCLUDE_GRANULE_ID: {
      const { collectionId, granuleId } = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            excludedGranuleIds: [
              ...state.byId[collectionId].excludedGranuleIds,
              granuleId
            ]
          }
        }
      }
    }
    case UNDO_EXCLUDE_GRANULE_ID: {
      const collectionId = action.payload
      const excludedGranuleIds = [...state.byId[collectionId].excludedGranuleIds]
      excludedGranuleIds.pop()

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            excludedGranuleIds
          }
        }
      }
    }
    case CLEAR_EXCLUDE_GRANULE_ID: {
      const { allIds } = state
      const byId = {
        ...state.byId
      }

      allIds.forEach((collectionId) => {
        if ('excludedGranuleIds' in byId[collectionId]) {
          byId[collectionId].excludedGranuleIds = []
        }
      })

      return {
        ...state,
        byId
      }
    }
    case TOGGLE_COLLECTION_VISIBILITY: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload]: {
            ...state.byId[action.payload],
            isVisible: !state.byId[action.payload].isVisible
          }
        }
      }
    }
    case UPDATE_COLLECTION_GRANULE_FILTERS: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            granuleFilters: {
              ...action.payload.granuleFilters
            }
          }
        }
      }
    }
    case LOADING_GRANULES: {
      const collectionId = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              isLoading: true,
              isLoaded: false
            }
          }
        }
      }
    }
    case LOADED_GRANULES: {
      const { collectionId, loaded } = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              isLoading: false,
              isLoaded: loaded
            }
          }
        }
      }
    }
    case STARTED_GRANULES_TIMER: {
      const collectionId = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              timerStart: Date.now()
            }
          }
        }
      }
    }
    case FINISHED_GRANULES_TIMER: {
      const collectionId = action.payload

      const { byId } = state
      const { granules } = byId[collectionId]
      const { timerStart } = granules

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              timerStart: null,
              loadTime: Date.now() - timerStart
            }
          }
        }
      }
    }
    case RESET_GRANULE_RESULTS: {
      const collectionId = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }
    case UPDATE_GRANULE_RESULTS: {
      const {
        collectionId,
        hits,
        isCwic,
        results,
        totalSize
      } = action.payload
      const { byId, allIds } = processResults(results)

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              allIds,
              byId,
              hits,
              isCwic,
              totalSize
            }
          }
        }
      }
    }
    case ADD_MORE_GRANULE_RESULTS: {
      const {
        collectionId,
        results
      } = action.payload
      const { byId, allIds } = processResults(results)

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              allIds: [
                ...state.byId[collectionId].granules.allIds,
                ...allIds
              ],
              byId: {
                ...state.byId[collectionId].granules.byId,
                ...byId
              }
            }
          }
        }
      }
    }
    case UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS: {
      const {
        collectionId,
        granuleParams
      } = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            currentCollectionGranuleParams: granuleParams
          }
        }
      }
    }
    default:
      return state
  }
}

export default collectionMetadataReducer
