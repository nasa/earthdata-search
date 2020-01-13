import {
  SET_ADMIN_RETRIEVAL,
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVAL_LOADED,
  SET_ADMIN_RETRIEVAL_LOADING,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING,
  SET_ADMIN_IS_AUTHORIZED
} from '../constants/actionTypes'

const initialState = {
  isAuthorized: false,
  retrievals: {
    byId: {},
    isLoading: false,
    isLoaded: false,
    pageSize: 20,
    pageNum: 1
  }
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
      return {
        ...state,
        retrievals: {
          ...state.retrievals,
          byId: {
            ...state.retrievals.byId,
            ...action.payload
          }
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
    default:
      return state
  }
}

export default adminReducer
