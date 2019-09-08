import { findIndex } from 'lodash'

import { SET_SAVED_PROJECTS, REMOVE_SAVED_PROJECT } from '../constants/actionTypes'

const initialState = []

const savedProjectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVED_PROJECTS: {
      return [
        ...action.payload
      ]
    }
    case REMOVE_SAVED_PROJECT: {
      const index = findIndex(state, project => project.id === action.payload)

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]
    }
    default:
      return state
  }
}

export default savedProjectsReducer
