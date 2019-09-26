import {
  ADD_MORE_GRANULE_RESULTS,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  UPDATE_GRANULE_RESULTS,
  ADD_GRANULE_RESULTS_FROM_COLLECTIONS
} from '../constants/actionTypes'

const initialState = {
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

const granuleResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_GRANULES: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case LOADED_GRANULES: {
      return {
        ...state,
        isLoading: false,
        isLoaded: action.payload.loaded
      }
    }
    case STARTED_GRANULES_TIMER: {
      return {
        ...state,
        timerStart: Date.now()
      }
    }
    case FINISHED_GRANULES_TIMER: {
      const { timerStart } = state
      return {
        ...state,
        timerStart: null,
        loadTime: Date.now() - timerStart
      }
    }
    case UPDATE_GRANULE_RESULTS: {
      const { hits, isCwic } = action.payload
      const { byId, allIds } = processResults(action.payload.results)

      return {
        ...state,
        allIds,
        byId,
        hits,
        isCwic
      }
    }
    case ADD_MORE_GRANULE_RESULTS: {
      const { byId, allIds } = processResults(action.payload.results)

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
    case ADD_GRANULE_RESULTS_FROM_COLLECTIONS: {
      const {
        allIds,
        byId,
        isCwic,
        hits
      } = action.payload

      return {
        ...state,
        allIds,
        byId,
        hits,
        isCwic,
        isLoaded: true
      }
    }
    default:
      return state
  }
}

export default granuleResultsReducer
