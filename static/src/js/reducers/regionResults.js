import {
  ERRORED_REGIONS,
  UPDATE_REGION_RESULTS,
  LOADING_REGIONS,
  LOADED_REGIONS,
  STARTED_REGIONS_TIMER,
  FINISHED_REGIONS_TIMER
} from '../constants/actionTypes'

const initialState = {
  keyword: '',
  hits: null,
  byId: {},
  allIds: [],
  isLoading: false,
  isLoaded: false,
  error: null,
  timerStart: null,
  loadTime: 0
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

const regionResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_REGIONS: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case LOADED_REGIONS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: action.payload.loaded
      }
    }
    case STARTED_REGIONS_TIMER: {
      return {
        ...state,
        timerStart: Date.now()
      }
    }
    case FINISHED_REGIONS_TIMER: {
      const { timerStart } = state
      return {
        ...state,
        timerStart: null,
        loadTime: Date.now() - timerStart
      }
    }
    case UPDATE_REGION_RESULTS: {
      const { byId, allIds } = processResults(action.payload.results)

      return {
        ...state,
        error: null,
        keyword: action.payload.keyword,
        hits: action.payload.hits,
        byId,
        allIds
      }
    }
    case ERRORED_REGIONS: {
      const [message] = action.payload

      return {
        ...state,
        error: message,
        hits: 0,
        byId: {},
        allIds: []
      }
    }
    default:
      return state
  }
}

export default regionResultsReducer
