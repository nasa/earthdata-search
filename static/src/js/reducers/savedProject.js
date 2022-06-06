import {
  UPDATE_SAVED_PROJECT,
  LOCATION_CHANGE
} from '../constants/actionTypes'

import { isPath } from '../util/isPath'
import {
  urlPathsWithoutUrlParams,
  isSavedProjectsPage
} from '../util/url/url'

const initialState = {
  projectId: null,
  name: '',
  path: null
}

const savedProjectReducer = (state = initialState, action = {}) => {
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
    case LOCATION_CHANGE: {
      // If we are navigating to downloads, contact info, or saved projects,
      // forget about the current saved project
      const { payload } = action
      const { isFirstRendering, location } = payload
      if (isFirstRendering) return state

      const { pathname } = location
      if (isPath(pathname, urlPathsWithoutUrlParams) || isSavedProjectsPage(location)) {
        return initialState
      }

      return state
    }
    default:
      return state
  }
}

export default savedProjectReducer
