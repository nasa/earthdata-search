import { replace } from 'connected-react-router'

import { UPDATE_SAVED_PROJECT, CLEAR_SAVED_PROJECT } from '../constants/actionTypes'
import ProjectRequest from '../util/request/projectRequest'
import { removeSavedProject } from './savedProjects'
import { handleError } from './errors'

export const clearSavedProject = () => ({
  type: CLEAR_SAVED_PROJECT
})

export const updateSavedProject = payload => ({
  type: UPDATE_SAVED_PROJECT,
  payload
})

/**
 * Action called when the project name is being updated
 * @param {String} name New project name
 */
export const updateProjectName = name => (dispatch, getState) => {
  const {
    authToken,
    router,
    savedProject
  } = getState()

  const {
    path,
    projectId: savedProjectId
  } = savedProject

  const { location } = router
  const { pathname, search } = location

  // If there isn't a path saved yet, get it from the URL
  let realPath = path
  if (!path) realPath = pathname + search

  const requestObject = new ProjectRequest()

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
        verb: 'updating'
      }))
    })

  return response
}

/**
 * Action called when deleting a saved project
 * @param {String} projectId Project Id to delete
 */
export const deleteSavedProject = projectId => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new ProjectRequest(authToken)

  try {
    const response = requestObject.remove(projectId)
      .then(() => {
        dispatch(removeSavedProject(projectId))
      })
      .catch((error) => {
        dispatch(handleError({
          error,
          action: 'deleteSavedProject',
          resource: 'saved project',
          verb: 'deleting'
        }))
      })

    return response
  } catch {
    return null
  }
}
