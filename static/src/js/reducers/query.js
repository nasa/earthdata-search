import { UPDATE_SEARCH_QUERY } from '../constants/actionTypes'

const initialState = {
  keyword: '',
  spatial: {},
  temporal: ''
}

const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_QUERY: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default queryReducer
