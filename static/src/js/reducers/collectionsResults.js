import {
  ADD_MORE_COLLECTION_RESULTS,
  ADD_MORE_GRANULE_RESULTS,
  FINISHED_COLLECTIONS_TIMER,
  FINISHED_GRANULES_TIMER,
  INITIALIZE_COLLECTION_GRANULES_RESULTS,
  LOADED_COLLECTIONS,
  LOADED_GRANULES,
  LOADING_COLLECTIONS,
  LOADING_GRANULES,
  RESET_GRANULE_RESULTS,
  STARTED_COLLECTIONS_TIMER,
  STARTED_GRANULES_TIMER,
  UPDATE_COLLECTION_RESULTS,
  UPDATE_GRANULE_RESULTS
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  hits: null,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  timerStart: null
}

export const initialGranuleState = {
  allIds: [],
  excludedGranuleIds: [],
  hits: null,
  isOpenSearch: null,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  timerStart: null
}

const processResults = (results) => {
  const allIds = []

  results.forEach((result) => {
    const { id } = result

    allIds.push(id)
  })

  return allIds
}

const collectionsResultsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOADING_COLLECTIONS: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case LOADED_COLLECTIONS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: action.payload.loaded
      }
    }
    case STARTED_COLLECTIONS_TIMER: {
      return {
        ...state,
        timerStart: Date.now()
      }
    }
    case FINISHED_COLLECTIONS_TIMER: {
      const { timerStart } = state
      return {
        ...state,
        timerStart: null,
        loadTime: Date.now() - timerStart
      }
    }
    case UPDATE_COLLECTION_RESULTS: {
      const { payload } = action
      const { hits, keyword, results } = payload

      const allIds = processResults(results)

      return {
        ...state,
        keyword,
        hits,
        allIds
      }
    }
    case ADD_MORE_COLLECTION_RESULTS: {
      const allIds = processResults(action.payload.results)

      return {
        ...state,
        allIds: [
          ...state.allIds,
          ...allIds
        ]
      }
    }
    case INITIALIZE_COLLECTION_GRANULES_RESULTS: {
      const collectionId = action.payload

      const { byId = {} } = state
      const { [collectionId]: focusedCollection = {} } = byId

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...focusedCollection,
            granules: initialGranuleState
          }
        }
      }
    }
    case STARTED_GRANULES_TIMER: {
      const { payload: collectionId } = action

      const { byId = {} } = state
      const { [collectionId]: focusedCollection = {} } = byId
      const {
        granules = {
          ...initialGranuleState
        }
      } = focusedCollection

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...focusedCollection,
            granules: {
              ...granules,
              timerStart: Date.now()
            }
          }
        }
      }
    }
    case FINISHED_GRANULES_TIMER: {
      const collectionId = action.payload

      const { byId = {} } = state
      const { [collectionId]: focusedCollection = {} } = byId
      const { granules = {} } = focusedCollection
      const { timerStart } = granules

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...focusedCollection,
            granules: {
              ...granules,
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
    case UPDATE_GRANULE_RESULTS: {
      const {
        collectionId,
        hits,
        isOpenSearch,
        results,
        totalSize,
        singleGranuleSize
      } = action.payload

      const allIds = processResults(results)

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              ...state.byId[collectionId].granules,
              allIds,
              hits,
              isOpenSearch,
              totalSize,
              singleGranuleSize
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

      const newIds = processResults(results)

      const { byId = {} } = state
      const { [collectionId]: focusedCollection = {} } = byId
      const { granules = {} } = focusedCollection
      const { allIds } = granules

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...focusedCollection,
            granules: {
              ...granules,
              allIds: [
                ...allIds,
                ...newIds
              ]
            }
          }
        }
      }
    }
    default:
      return state
  }
}

export default collectionsResultsReducer
