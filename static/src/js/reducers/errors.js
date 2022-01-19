import { ADD_ERROR, REMOVE_ERROR } from '../constants/actionTypes'

const initialState = []

const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ERROR: {
      return [
        ...state,
        action.payload
      ]
    }
    case REMOVE_ERROR: {
      const id = action.payload
      const errors = state.filter((error) => error.id !== id)

      return errors
    }
    default:
      return state
  }
}

export default errorsReducer
