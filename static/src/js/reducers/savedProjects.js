import { findIndex } from 'lodash'

import {
  SET_SAVED_PROJECTS,
  SET_SAVED_PROJECTS_LOADING,
  REMOVE_SAVED_PROJECT
} from '../constants/actionTypes'

const initialState = {
  projects: [],
  isLoading: false,
  isLoaded: false
}

const savedProjectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVED_PROJECTS_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }
    case SET_SAVED_PROJECTS: {
      return {
        ...state,
        projects: [
          ...action.payload
        ],
        isLoaded: true,
        isLoading: false
      }
    }
    case REMOVE_SAVED_PROJECT: {
      const { projects } = state

      const index = findIndex(projects, (project) => project.id === action.payload)

      return {
        ...state,
        projects: [
          ...projects.slice(0, index),
          ...projects.slice(index + 1)
        ]
      }
    }
    default:
      return state
  }
}

export default savedProjectsReducer
