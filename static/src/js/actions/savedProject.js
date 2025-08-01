import { replace } from 'connected-react-router'

import { UPDATE_SAVED_PROJECT } from '../constants/actionTypes'

import ProjectRequest from '../util/request/projectRequest'

import { handleError } from './errors'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

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

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

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
    .then((responseObject) => {
      const { data } = responseObject
      const {
        project_id: projectId,
        path: pathData
      } = data

      dispatch(updateSavedProject({
        name,
        path: pathData,
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
