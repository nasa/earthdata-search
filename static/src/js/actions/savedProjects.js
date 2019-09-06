import ProjectRequest from '../util/request/projectRequest'

import { SET_SAVED_PROJECTS } from '../constants/actionTypes'

export const setSavedProjects = payload => ({
  type: SET_SAVED_PROJECTS,
  payload
})

/**
 * Fetch a retrieval from the database
 */
export const fetchSavedProjects = () => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new ProjectRequest(authToken)

  const response = requestObject.all()
    .then((response) => {
      const { data } = response

      dispatch(setSavedProjects(data))
    })
    .catch((e) => {
      console.log('Failed to fetch retrievals', e)
    })

  return response
}
