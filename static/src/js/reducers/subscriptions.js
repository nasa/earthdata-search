import {
  ERRORED_SUBSCRIPTIONS,
  UPDATE_SUBSCRIPTION_RESULTS,
  LOADING_SUBSCRIPTIONS,
  LOADED_SUBSCRIPTIONS,
  STARTED_SUBSCRIPTIONS_TIMER,
  FINISHED_SUBSCRIPTIONS_TIMER
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  isLoading: false,
  isLoaded: false,
  error: null,
  timerStart: null,
  loadTime: 0
}

const processResults = (results) => {
  const byId = {}

  results.forEach((result) => {
    const { conceptId } = result

    byId[conceptId] = result
  })

  return byId
}

const subscriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_SUBSCRIPTIONS: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case LOADED_SUBSCRIPTIONS: {
      return {
        ...state,
        isLoading: false,
        isLoaded: action.payload.loaded
      }
    }
    case STARTED_SUBSCRIPTIONS_TIMER: {
      return {
        ...state,
        timerStart: Date.now()
      }
    }
    case FINISHED_SUBSCRIPTIONS_TIMER: {
      const { timerStart } = state
      return {
        ...state,
        timerStart: null,
        loadTime: Date.now() - timerStart
      }
    }
    case UPDATE_SUBSCRIPTION_RESULTS: {
      const byId = processResults(action.payload)

      return {
        ...state,
        error: null,
        byId
      }
    }
    case ERRORED_SUBSCRIPTIONS: {
      const [firstError] = action.payload

      const { message } = firstError

      return {
        ...state,
        error: message,
        byId: {}
      }
    }
    default:
      return state
  }
}

export default subscriptionsReducer
