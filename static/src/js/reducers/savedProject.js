import {
  UPDATE_SAVED_PROJECT
} from '../constants/actionTypes'

const initialState = {
  projectId: null,
  name: '',
  path: null
}

const savedProjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SAVED_PROJECT: {
      const {
        projectId = state.projectId,
        name = state.name,
        path = state.path
      } = action.payload

      return {
        ...state,
        projectId,
        name,
        path
      }
    }
    default:
      return state
  }
}

export default savedProjectReducer
