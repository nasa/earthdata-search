import { UPDATE_SAVED_PROJECT } from '../constants/actionTypes'
import ProjectRequest from '../util/request/projectRequest'

export const updateSavedProject = payload => ({
  type: UPDATE_SAVED_PROJECT,
  payload
})

export const updateProjectName = name => (dispatch, getState) => {
  const { authToken, savedProject } = getState()
  const { path, projectId } = savedProject

  const requestObject = new ProjectRequest()

  const response = requestObject.save({
    authToken,
    name,
    path,
    projectId
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
    })

  return response
}
