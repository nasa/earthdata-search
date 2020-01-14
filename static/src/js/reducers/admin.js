import {
  SET_ADMIN_RETRIEVAL,
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVAL_LOADED,
  SET_ADMIN_RETRIEVAL_LOADING,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING,
  SET_ADMIN_IS_AUTHORIZED,
  UPDATE_ADMIN_RETRIEVALS_SORT_KEY,
  UPDATE_ADMIN_RETRIEVALS_PAGE_NUM,
  SET_ADMIN_RETRIEVALS_PAGINATION
} from '../constants/actionTypes'

const initialState = {
  isAuthorized: false,
  retrievals: {
    allIds: [],
    byId: {},
    isLoading: false,
    isLoaded: false,
    sortKey: '-created_at',
    pagination: {
      pageSize: 20,
      pageNum: 1,
      pageCount: null,
      totalResults: null
    }
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

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN_IS_AUTHORIZED: {
      return {
        ...state,
        isAuthorized: action.payload
      }
    }
    case SET_ADMIN_RETRIEVALS_LOADED: {
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          isLoaded: true,
          isLoading: false
        }
      }
    }
    case SET_ADMIN_RETRIEVALS_LOADING: {
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          isLoaded: false,
          isLoading: true
        }
      }
    }
    case SET_ADMIN_RETRIEVALS: {
      const { byId, allIds } = processResults(action.payload)

      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          byId,
          allIds
        }
      }
    }
    case SET_ADMIN_RETRIEVAL_LOADED: {
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          [action.payload]: {
            ...state.retrievals.byId,
            isLoading: false,
            isLoaded: true
          }
        }
      }
    }
    case SET_ADMIN_RETRIEVAL_LOADING: {
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          [action.payload]: {
            ...state.retrievals.byId,
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
        retrievals: {
          ...state.retrievals,
          byId: {
            ...state.retrievals.byId,
            [id]: {
              ...action.payload,
              isLoading: false,
              isLoaded: true
            }
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
        retrievals: {
          ...state.retrievals,
          pagination: {
            ...state.retrievals.pagination,
            pageNum,
            pageSize,
            pageCount,
            totalResults
          }
        }
      }
    }
    case UPDATE_ADMIN_RETRIEVALS_SORT_KEY: {
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          sortKey: action.payload
        }
      }
    }
    case UPDATE_ADMIN_RETRIEVALS_PAGE_NUM: {
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          pagination: {
            ...state.retrievals.pagination,
            pageNum: action.payload
          }
        }
      }
    }
    default:
      return state
  }
}

export default adminReducer
