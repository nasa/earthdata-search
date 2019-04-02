import { queryParamsFromUrlString } from '../util/url'

const initialState = ''

const facetsParamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SELECTED_FACET': {
      return queryParamsFromUrlString(action.payload)
    }
    case 'REMOVE_SELECTED_FACET': {
      return queryParamsFromUrlString(action.payload)
    }
    default:
      return state
  }
}

export default facetsParamsReducer
