const initialState = '0!0!2!1!0!0,2'

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MAP_PARAM':
      return action.payload
    default:
      return state
  }
}

export default mapReducer
