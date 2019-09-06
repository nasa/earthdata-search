import { SET_SAVED_PROJECTS } from '../constants/actionTypes'

const initialState = []

const savedProjectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVED_PROJECTS: {
      return [
        ...action.payload
      ]
    }
    default:
      return state
  }
}

export default savedProjectsReducer
