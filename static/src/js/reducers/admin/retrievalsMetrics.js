import {
  SET_ADMIN_RETRIEVALS_METRICS,
  SET_ADMIN_RETRIEVALS_METRICS_LOADING,
  SET_ADMIN_RETRIEVALS_METRICS_LOADED,
  UPDATE_ADMIN_RETRIEVALS_METRICS_START_DATE,
  UPDATE_ADMIN_RETRIEVALS_METRICS_END_DATE
} from '../../constants/actionTypes'

const initialState = {
  allAccessMethodTypes: [],
  accessMethodType: {},
  multCollectionResponse: [],
  isLoading: false,
  isLoaded: false,
  startDate: '',
  endDate: ''
}

const processResults = (results) => {
  const { retrievalResponse, multCollectionResponse } = results
  const byAccessMethodType = {}
  const allAccessMethodTypes = []

  retrievalResponse.forEach((response) => {
    const { access_method_type: accessMethodType } = response

    byAccessMethodType[accessMethodType] = response
    allAccessMethodTypes.push(accessMethodType)
  })

  return {
    byAccessMethodType,
    allAccessMethodTypes,
    multCollectionResponse
  }
}

const adminRetrievalsMetricsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADMIN_RETRIEVALS_METRICS_LOADED: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false
      }
    }

    case SET_ADMIN_RETRIEVALS_METRICS_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }

    case SET_ADMIN_RETRIEVALS_METRICS: {
      const {
        byAccessMethodType,
        allAccessMethodTypes,
        multCollectionResponse
      } = processResults(action.payload)

      return {
        ...state,
        byAccessMethodType,
        allAccessMethodTypes,
        multCollectionResponse
      }
    }

    case UPDATE_ADMIN_RETRIEVALS_METRICS_START_DATE: {
      return {
        ...state,
        startDate: action.payload
      }
    }

    case UPDATE_ADMIN_RETRIEVALS_METRICS_END_DATE: {
      return {
        ...state,
        endDate: action.payload
      }
    }

    default:
      return state
  }
}

export default adminRetrievalsMetricsReducer
