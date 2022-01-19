import ProjectRequest from '../util/request/projectRequest'

import {
  SET_SAVED_PROJECTS,
  SET_SAVED_PROJECTS_LOADING,
  REMOVE_SAVED_PROJECT
} from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'

export const setSavedProjects = (payload) => ({
  type: SET_SAVED_PROJECTS,
  payload
})

export const setSavedProjectsLoading = () => ({
  type: SET_SAVED_PROJECTS_LOADING
})

export const removeSavedProject = (payload) => ({
  type: REMOVE_SAVED_PROJECT,
  payload
})

/**
 * Fetch a retrieval from the database
 */
export const fetchSavedProjects = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setSavedProjectsLoading())

  const requestObject = new ProjectRequest(authToken, earthdataEnvironment)

  const response = requestObject.all()
    .then((response) => {
      const { data } = response

      dispatch(setSavedProjects(data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchSavedProjects',
        resource: 'saved projects',
        requestObject
      }))
    })

  return response
}
