import {
  // SET_ADMIN_METRICS_RETRIEVAL,
  SET_ADMIN_METRICS_RETRIEVALS,
  // SET_ADMIN_METRICS_RETRIEVAL_LOADED,
  SET_ADMIN_METRICS_RETRIEVALS_LOADING,
  SET_ADMIN_METRICS_RETRIEVALS_LOADED,
  UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE,
  UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE
  // SET_ADMIN_METRICS_RETRIEVAL_LOADING,
  // UPDATE_ADMIN_METRICS_RETRIEVALS_SORT_KEY,
  // UPDATE_ADMIN_METRICS_RETRIEVALS_PAGE_NUM,
  // SET_ADMIN_METRICS_RETRIEVALS_PAGINATION
} from '../../constants/actionTypes'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { defaultCmrPageSize } = getApplicationConfig()

const initialState = {
  allAccessMethodTypes: [],
  accessMethodType: {},
  multCollectionResponse: [],
  isLoading: false,
  isLoaded: false,
  sortKey: '',
  pagination: {
    pageSize: defaultCmrPageSize,
    pageNum: 1,
    pageCount: null,
    totalResults: null
  },
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

  return { byAccessMethodType, allAccessMethodTypes, multCollectionResponse }
}

const adminMetricsRetrievalsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADMIN_METRICS_RETRIEVALS_LOADED: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false
      }
    }
    case SET_ADMIN_METRICS_RETRIEVALS_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }
    case SET_ADMIN_METRICS_RETRIEVALS: {
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

    case UPDATE_ADMIN_METRICS_RETRIEVALS_START_DATE: {
      return {
        ...state,
        startDate: action.payload
      }
    }

    case UPDATE_ADMIN_METRICS_RETRIEVALS_END_DATE: {
      return {
        ...state,
        endDate: action.payload
      }
    }

    // case SET_ADMIN_METRICS_RETRIEVAL_LOADED: {
    //   const id = action.payload

    //   return {
    //     ...state,
    //     accessMethodType: {
    //       ...state.accessMethodType,
    //       [id]: {
    //         ...state.accessMethodType[id],
    //         isLoading: false,
    //         isLoaded: true
    //       }
    //     }
    //   }
    // }
    // case SET_ADMIN_METRICS_RETRIEVAL_LOADING: {
    //   const id = action.payload

    //   return {
    //     ...state,
    //     accessMethodType: {
    //       ...state.accessMethodType,
    //       [id]: {
    //         ...state.accessMethodType[id],
    //         isLoading: true,
    //         isLoaded: false
    //       }
    //     }
    //   }
    // }
    // case SET_ADMIN_METRICS_RETRIEVAL: {
    //   const {
    //     access_method_type: accessMethodType
    //   } = action.payload

    //   return {
    //     ...state,
    //     accessMethodType: {
    //       ...state.accessMethodType,
    //       [accessMethodType]: {
    //         ...state.accessMethodType[accessMethodType],
    //         ...action.payload,
    //         isLoading: false,
    //         isLoaded: true
    //       }
    //     }
    //   }
    // }
    // case SET_ADMIN_METRICS_RETRIEVALS_PAGINATION: {
    //   const {
    //     page_num: pageNum,
    //     page_size: pageSize,
    //     page_count: pageCount,
    //     total_results: totalResults
    //   } = action.payload

    //   return {
    //     ...state,
    //     pagination: {
    //       ...state.pagination,
    //       pageNum,
    //       pageSize,
    //       pageCount,
    //       totalResults
    //     }
    //   }
    // }
    // case UPDATE_ADMIN_METRICS_RETRIEVALS_SORT_KEY: {
    //   return {
    //     ...state,
    //     sortKey: action.payload
    //   }
    // }
    // case UPDATE_ADMIN_METRICS_RETRIEVALS_PAGE_NUM: {
    //   return {
    //     ...state,
    //     pagination: {
    //       ...state.pagination,
    //       pageNum: action.payload
    //     }
    //   }
    // }
    default:
      return state
  }
}

export default adminMetricsRetrievalsReducer
