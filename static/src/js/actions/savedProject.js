import { replace } from 'connected-react-router'

import { UPDATE_SAVED_PROJECT } from '../constants/actionTypes'
import ProjectRequest from '../util/request/projectRequest'

export const updateSavedProject = payload => ({
  type: UPDATE_SAVED_PROJECT,
  payload
})

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

      // TODO isn't updating URL on new project with name
      dispatch(updateSavedProject({
        name,
        path,
        projectId
      }))

      if (search.indexOf('?projectId=') === -1) dispatch(replace(`${pathname}?projectId=${projectId}`))
    })

  return response
}
