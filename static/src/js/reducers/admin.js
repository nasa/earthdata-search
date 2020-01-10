import {
  SET_ADMIN_RETRIEVALS,
  SET_ADMIN_RETRIEVALS_LOADED,
  SET_ADMIN_RETRIEVALS_LOADING
} from '../constants/actionTypes'

const initialState = {
  retrievals: {
    data: [],
    isLoading: false,
    isLoaded: false
  }
}

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
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
          data: action.payload
        }
      }
    }
    default:
      return state
  }
}

export default adminReducer
