import ProjectRequest from '../../util/request/projectRequest'

import {
  SET_ADMIN_PROJECT,
  SET_ADMIN_PROJECTS,
  SET_ADMIN_PROJECT_LOADED,
  SET_ADMIN_PROJECT_LOADING,
  SET_ADMIN_PROJECTS_LOADED,
  SET_ADMIN_PROJECTS_LOADING,
  SET_ADMIN_PROJECTS_PAGINATION,
  UPDATE_ADMIN_PROJECTS_SORT_KEY,
  UPDATE_ADMIN_PROJECTS_PAGE_NUM
} from '../../constants/actionTypes'

import actions from '../index'

import { handleError } from '../errors'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const setAdminProject = (payload) => ({
  type: SET_ADMIN_PROJECT,
  payload
})

export const setAdminProjects = (projects) => ({
  type: SET_ADMIN_PROJECTS,
  payload: projects
})

export const setAdminProjectsLoading = () => ({
  type: SET_ADMIN_PROJECTS_LOADING
})

export const setAdminProjectsLoaded = () => ({
  type: SET_ADMIN_PROJECTS_LOADED
})

export const setAdminProjectLoading = (id) => ({
  type: SET_ADMIN_PROJECT_LOADING,
  payload: id
})

export const setAdminProjectLoaded = (id) => ({
  type: SET_ADMIN_PROJECT_LOADED,
  payload: id
})

export const setAdminProjectsPagination = (data) => ({
  type: SET_ADMIN_PROJECTS_PAGINATION,
  payload: data
})

/**
 * Fetch a project from the database
 */
export const fetchAdminProject = (id) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setAdminProjectLoading(id))

  const requestObject = new ProjectRequest(authToken, earthdataEnvironment)
  const response = requestObject.adminFetch(id)
    .then((response) => {
      const { data } = response

      dispatch(setAdminProjectLoaded(id))
      dispatch(setAdminProject(data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchAdminProject',
        resource: 'admin project',
        requestObject
      }))
    })

  return response
}

/**
 * Fetch a group of projects from the database
 */
export const fetchAdminProjects = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { admin, authToken } = state

  const { projects } = admin
  const { sortKey, pagination } = projects
  const {
    pageSize,
    pageNum
  } = pagination

  dispatch(setAdminProjectsLoading())

  const requestObject = new ProjectRequest(authToken, earthdataEnvironment)

  const requestOpts = {
    page_size: pageSize,
    page_num: pageNum
  }

  if (sortKey) requestOpts.sort_key = sortKey

  const response = requestObject.adminAll(requestOpts)
    .then((response) => {
      const { data } = response
      const { pagination, results } = data

      dispatch(setAdminProjectsLoaded())
      dispatch(setAdminProjectsPagination(pagination))
      dispatch(setAdminProjects(results))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchAdminProjects',
        resource: 'admin projects',
        requestObject
      }))
    })

  return response
}

export const adminViewProject = (projectId) => (dispatch) => {
  dispatch(actions.changeUrl({
    pathname: `/admin/projects/${projectId}`
  }))
}

export const updateAdminProjectsSortKey = (sortKey) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_PROJECTS_SORT_KEY,
    payload: sortKey
  })

  dispatch(actions.fetchAdminProjects())
}

export const updateAdminProjectsPageNum = (pageNum) => (dispatch) => {
  dispatch({
    type: UPDATE_ADMIN_PROJECTS_PAGE_NUM,
    payload: pageNum
  })

  dispatch(actions.fetchAdminProjects())
}
