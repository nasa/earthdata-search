import { replace, push } from 'connected-react-router'
import { parse, stringify } from 'qs'

import actions from './index'

import { isPath } from '../util/isPath'
import {
  decodeUrlParams,
  isSavedProjectsPage,
  urlPathsWithoutUrlParams
} from '../util/url/url'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import { RESTORE_FROM_URL } from '../constants/actionTypes'

import ProjectRequest from '../util/request/projectRequest'

const restoreFromUrl = (payload) => ({
  type: RESTORE_FROM_URL,
  payload
})

export const updateStore = ({
  advancedSearch,
  autocompleteSelected,
  cmrFacets,
  collections,
  earthdataEnvironment,
  featureFacets,
  focusedCollection,
  focusedGranule,
  map,
  project,
  query,
  shapefile,
  timeline
}, newPathname) => async (dispatch, getState) => {
  const { router } = getState()
  const { location } = router
  const { pathname } = location

  // Prevent loading from the urls that don't use URL params.
  const loadFromUrl = (
    !isPath(pathname, urlPathsWithoutUrlParams)
    && !isSavedProjectsPage(location)
  )

  // If the newPathname is not equal to the current pathname, restore the data from the url
  if (loadFromUrl || (newPathname && newPathname !== pathname)) {
    dispatch(restoreFromUrl({
      advancedSearch,
      autocompleteSelected,
      cmrFacets,
      collections,
      earthdataEnvironment,
      featureFacets,
      focusedCollection,
      focusedGranule,
      map,
      project,
      query,
      shapefile,
      timeline
    }))
  }
}

export const changePath = (path = '') => async (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const [pathname, queryString] = path.split('?')

  let decodedParams

  // If query string is a projectId, call getProject
  if (queryString && queryString.indexOf('projectId=') === 0) {
    const requestObject = new ProjectRequest(undefined, earthdataEnvironment)

    const { projectId } = parse(queryString)

    try {
      const projectResponse = await requestObject.fetch(projectId)

      const { data } = projectResponse
      const {
        name,
        path: projectPath
      } = data

      // In the event that the user has the earthdata environment set to the deployed environment
      // the ee param will not exist, we need to ensure its provided on the `state` param for redirect purposes
      const [, projectQueryString] = projectPath.split('?')

      // Parse the query string into an object
      const paramsObj = parse(projectQueryString, { parseArrays: false })

      // If the earthdata environment variable
      if (!Object.keys(paramsObj).includes('ee')) {
        paramsObj.ee = earthdataEnvironment
      }

      // Save name, path and projectId into store
      dispatch(actions.updateSavedProject({
        path: projectPath,
        name,
        projectId
      }))

      decodedParams = decodeUrlParams(stringify(paramsObj))
      dispatch(actions.updateStore(decodedParams))
    } catch (error) {
      dispatch(actions.handleError({
        error,
        action: 'changePath',
        resource: 'project',
        verb: 'updating',
        requestObject
      }))
    }
  } else {
    decodedParams = decodeUrlParams(queryString)

    dispatch(actions.updateStore(decodedParams, pathname))
  }

  // If we are moving to a /search path, fetch collection results, this saves an extra request on the non-search pages.
  // Setting requestAddedGranules forces all page types other than search to request only the added granules if they exist, in all
  // other cases, getGranules will be requested using the granule search query params.
  if (
    pathname === '/'
    || pathname.includes('/search')
    // matches /portal/<id>, which we redirect to /portal/<id>/search but needs to trigger these actions
    || pathname.match(/\/portal\/\w*/)
  ) {
    dispatch(actions.getCollections())

    // Granules Search
    if (
      pathname === '/search/granules'
      || pathname.match(/\/portal\/\w*\/search\/granules$/)
    ) {
      dispatch(actions.getFocusedCollection())
    }

    // Collection Details
    if (
      pathname === '/search/granules/collection-details'
      || pathname.match(/\/portal\/\w*\/search\/granules\/collection-details$/)
    ) {
      dispatch(actions.getFocusedCollection())
    }

    // Subscription Details
    if (
      pathname === '/search/granules/subscriptions'
      || pathname.match(/\/portal\/\w*\/search\/granules\/subscriptions$/)
    ) {
      dispatch(actions.getFocusedCollection())
    }

    // Granule Details
    if (
      pathname === '/search/granules/granule-details'
      || pathname.match(/\/portal\/\w*\/search\/granules\/granule-details$/)
    ) {
      dispatch(actions.getFocusedCollection())

      dispatch(actions.getFocusedGranule())
    }
  }

  // Fetch collections in the project
  const { project = {} } = decodedParams
  const { collections: projectCollections = {} } = project
  const { allIds = [] } = projectCollections

  if (allIds.length > 0) {
    // Project collection metadata needs to exist before calling retrieving access methods
    await dispatch(actions.getProjectCollections())

    dispatch(actions.fetchAccessMethods(allIds))

    dispatch(actions.getProjectGranules())
  }

  dispatch(actions.getTimeline())

  return null
}

const updateUrl = ({ options, oldPathname, newPathname }) => (dispatch) => {
  // Only replace if the pathname stays the same as the current pathname.
  // Push if the pathname is different
  if (oldPathname === newPathname) {
    dispatch(replace(options))
  } else {
    dispatch(push(options))
  }
}

/**
 * Push a new url state to the store.
 * @param {String|Object} options - Pushes the string or an object containing 'pathname' and 'search' keys
 * as the new url. When passing an object, if only one key is passed, only the corresponding piece of the
 * url will be changed.
 *
 * @example
 * // Given the original url '/a-old-url/?some-param=false', changes url to '/a-new-url/?some-param=true'
 * changeUrl('/a-new-url/?some-param=true')
 *
 * // Given the original url '/a-old-url/?some-param=false', changes url to '/a-new-url/?some-param=false'
 * changeUrl({ pathname: '/a-new-url' })
 */
export const changeUrl = (options) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const {
    authToken,
    router,
    savedProject
  } = state

  let newOptions = options
  const { location } = router
  const { pathname: oldPathname } = location

  let newPathname
  if (typeof options === 'string') {
    [newPathname] = options.split('?')

    const { projectId, name, path } = savedProject
    if (projectId || options.length > 2000) {
      if (path !== newOptions) {
        const requestObject = new ProjectRequest(authToken, earthdataEnvironment)

        const projectResponse = requestObject.save({
          authToken,
          name,
          path: newOptions,
          projectId
        })
          .then((response) => {
            const { data } = response
            const {
              project_id: newProjectId,
              path: projectPath
            } = data

            newOptions = `${projectPath.split('?')[0]}?projectId=${newProjectId}`

            if (projectId !== newProjectId) {
              dispatch(replace(newOptions))
            }

            dispatch(actions.updateSavedProject({
              path: projectPath,
              name,
              projectId: newProjectId
            }))
          })
          .catch((error) => {
            dispatch(actions.handleError({
              error,
              action: 'changeUrl',
              resource: 'project',
              verb: 'updating',
              requestObject
            }))
          })

        return projectResponse
      }
    } else {
      dispatch(updateUrl({
        options: newOptions,
        oldPathname,
        newPathname
      }))
    }
  } else {
    ({ pathname: newPathname } = options)

    dispatch(updateUrl({
      options: newOptions,
      oldPathname,
      newPathname
    }))
  }
  return null
}
