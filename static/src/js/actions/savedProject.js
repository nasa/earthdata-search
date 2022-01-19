import { replace } from 'connected-react-router'

import { UPDATE_SAVED_PROJECT } from '../constants/actionTypes'

import ProjectRequest from '../util/request/projectRequest'
import { addToast } from '../util/addToast'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'
import { removeSavedProject } from './savedProjects'

export const updateSavedProject = (payload) => ({
  type: UPDATE_SAVED_PROJECT,
  payload
})

/**
 * Action called when the project name is being updated
 * @param {String} name New project name
 */
export const updateProjectName = (name) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const {
    authToken,
    router,
    savedProject
  } = state

  const {
    path,
    projectId: savedProjectId
  } = savedProject

  const { location } = router
  const { pathname, search } = location

  // If there isn't a path saved yet, get it from the URL
  let realPath = path
  if (!path) realPath = pathname + search

  const requestObject = new ProjectRequest(undefined, earthdataEnvironment)

  const response = requestObject.save({
    authToken,
    name,
    path: realPath,
    projectId: savedProjectId
  })
    .then((response) => {
      const { data } = response
      const {
        project_id: projectId,
        path
      } = data

      dispatch(updateSavedProject({
        name,
        path,
        projectId
      }))

      // If the URL didn't contain a projectId before, change the URL to a project URL
      if (search.indexOf('?projectId=') === -1) dispatch(replace(`${pathname}?projectId=${projectId}`))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'updateProjectName',
        resource: 'project name',
        verb: 'updating',
        requestObject
      }))
    })

  return response
}

/**
 * Action called when deleting a saved project
 * @param {String} projectId Project Id to delete
 */
export const deleteSavedProject = (projectId) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const requestObject = new ProjectRequest(authToken, earthdataEnvironment)

  try {
    const response = requestObject.remove(projectId)
      .then(() => {
        dispatch(removeSavedProject(projectId))
        addToast('Project removed', {
          appearance: 'success',
          autoDismiss: true
        })
      })
      .catch((error) => {
        dispatch(handleError({
          error,
          action: 'deleteSavedProject',
          resource: 'saved project',
          verb: 'deleting',
          requestObject
        }))
      })

    return response
  } catch {
    return null
  }
}
