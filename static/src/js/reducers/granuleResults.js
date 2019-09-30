import {
  ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  ADD_MORE_GRANULE_RESULTS,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  RESET_GRANULE_RESULTS,
  STARTED_GRANULES_TIMER,
  UPDATE_GRANULE_RESULTS
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
    case RESET_GRANULE_RESULTS: {
      return {
        ...initialState
      }
    }
    case UPDATE_GRANULE_RESULTS: {
      const { hits, isCwic, results } = action.payload
      const { byId, allIds } = processResults(results)

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
        hits,
        loadTime
      } = action.payload

      return {
        ...state,
        allIds,
        byId,
        hits,
        isCwic,
        loadTime,
        isLoaded: true
      }
    }
    default:
      return state
  }
}

export default granuleResultsReducer
