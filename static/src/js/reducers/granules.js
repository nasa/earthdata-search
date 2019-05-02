import {
  ADD_MORE_GRANULES,
  UPDATE_GRANULES,
  LOADING_GRANULES,
  LOADED_GRANULES,
  STARTED_GRANULES_TIMER,
  FINISHED_GRANULES_TIMER
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  allIds: [],
  hits: null,
  isLoading: false,
  isLoaded: false,
  timerStart: null,
  loadTime: 0,
  isCwic: null
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

const granulesReducer = (state = initialState, action) => {
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
    case UPDATE_GRANULES: {
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
    case ADD_MORE_GRANULES: {
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
    default:
      return state
  }
}

export default granulesReducer
