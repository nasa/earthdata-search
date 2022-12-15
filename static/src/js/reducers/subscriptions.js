import {
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  REMOVE_SUBSCRIPTION_DISABLED_FIELDS,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_COLLECTION_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  isLoading: false,
  isLoaded: false,
  error: null,
  timerStart: null,
  loadTime: 0,
  disabledFields: {
    collection: {},
    granule: {}
  }
}

const processResults = (results) => {
  const byId = {}

  results.forEach((result) => {
    const { conceptId } = result

    byId[conceptId] = result
  })

  return byId
}

const subscriptionsReducer = (state = initialState, action = {}) => {
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
    case UPDATE_COLLECTION_SUBSCRIPTION: {
      const { payload } = action
      const { conceptId } = payload

      const { byId } = state

      return {
        ...state,
        error: null,
        byId: {
          ...byId,
          [conceptId]: {
            ...byId[conceptId],
            ...payload
          }
        }
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
    case REMOVE_SUBSCRIPTION: {
      const conceptId = action.payload

      const { byId } = state
      delete byId[conceptId]

      return {
        ...state,
        byId: {
          ...byId
        }
      }
    }
    case UPDATE_SUBSCRIPTION_DISABLED_FIELDS: {
      return {
        ...state,
        disabledFields: {
          collection: {
            ...state.disabledFields.collection,
            ...action.payload.collection
          },
          granule: {
            ...state.disabledFields.granule,
            ...action.payload.granule
          }
        }
      }
    }
    case REMOVE_SUBSCRIPTION_DISABLED_FIELDS: {
      return {
        ...state,
        disabledFields: {
          ...initialState.disabledFields
        }
      }
    }
    default:
      return state
  }
}

export default subscriptionsReducer
