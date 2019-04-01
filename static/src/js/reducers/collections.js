import {
  UPDATE_COLLECTIONS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS,
  STARTED_TIMER,
  FINISHED_TIMER
} from '../constants/actionTypes'

const initialState = {
  keyword: false,
  hits: null,
  byId: {},
  allIds: [],
  isLoading: false,
  isLoaded: false,
  timerStart: null,
  loadTime: 0
}

const resultToStateObj = result => result

const collectionsReducer = (state = initialState, action) => {
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
    case STARTED_TIMER: {
      return {
        ...state,
        timerStart: Date.now()
      }
    }
    case FINISHED_TIMER: {
      const { timerStart } = state
      return {
        ...state,
        timerStart: null,
        loadTime: Date.now() - timerStart
      }
    }
    case UPDATE_COLLECTIONS: {
      const byId = {}
      const allIds = []
      action.payload.results.forEach((result, i) => {
        byId[i] = resultToStateObj(result)
        allIds.push(i)
      })

      return {
        ...state,
        keyword: action.payload.keyword,
        hits: action.payload.hits,
        byId,
        allIds
      }
    }
    default:
      return state
  }
}

export default collectionsReducer
