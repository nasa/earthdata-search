import {
  SET_ADMIN_RETRIEVAL,
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVAL_LOADED,
  SET_ADMIN_RETRIEVAL_LOADING,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING,
  UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
  UPDATE_ADMIN_RETRIEVALS_PAGE_NUM,
  SET_ADMIN_RETRIEVALS_PAGINATION
} from '../../constants/actionTypes'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { defaultCmrPageSize } = getApplicationConfig()

const initialState = {
  allIds: [],
  byId: {},
  isLoading: false,
  isLoaded: false,
  sortKey: '',
  pagination: {
    pageSize: defaultCmrPageSize,
    pageNum: 1,
    pageCount: null,
    totalResults: null
  }
}

const processResults = (results) => {
  const byId = {}
  const allIds = []

  results.forEach((result) => {
    const { obfuscated_id: obfuscatedId } = result

    byId[obfuscatedId] = result
    allIds.push(obfuscatedId)
  })

  return { byId, allIds }
}

const adminRetrievalsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ADMIN_RETRIEVALS_LOADED: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false
      }
    }
    case SET_ADMIN_RETRIEVALS_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }
    case SET_ADMIN_RETRIEVALS: {
      const { byId, allIds } = processResults(action.payload)

      return {
        ...state,
        byId,
        allIds
      }
    }
    case SET_ADMIN_RETRIEVAL_LOADED: {
      const id = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            isLoading: false,
            isLoaded: true
          }
        }
      }
    }
    case SET_ADMIN_RETRIEVAL_LOADING: {
      const id = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            isLoading: true,
            isLoaded: false
          }
        }
      }
    }
    case SET_ADMIN_RETRIEVAL: {
      const {
        obfuscated_id: id
      } = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            ...action.payload,
            isLoading: false,
            isLoaded: true
          }
        }
      }
    }
    case SET_ADMIN_RETRIEVALS_PAGINATION: {
      const {
        page_num: pageNum,
        page_size: pageSize,
        page_count: pageCount,
        total_results: totalResults
      } = action.payload

      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageNum,
          pageSize,
          pageCount,
          totalResults
        }
      }
    }
    case UPDATE_ADMIN_RETRIEVALS_SORT_KEY: {
      return {
        ...state,
        sortKey: action.payload
      }
    }
    case UPDATE_ADMIN_RETRIEVALS_PAGE_NUM: {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageNum: action.payload
        }
      }
    }
    default:
      return state
  }
}

export default adminRetrievalsReducer
