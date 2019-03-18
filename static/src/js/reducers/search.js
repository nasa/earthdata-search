const initialState = ''

const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_QUERY': {
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
