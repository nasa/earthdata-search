import { merge } from 'lodash-es'
import { parse, stringify } from 'qs'

import actions from './index'

import { isPath } from '../util/isPath'
import {
  decodeUrlParams,
  isSavedProjectsPage,
  urlPathsWithoutUrlParams
} from '../util/url/url'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

import { RESTORE_FROM_URL } from '../constants/actionTypes'

import ProjectRequest from '../util/request/projectRequest'
import { buildConfig } from '../util/portals'

// eslint-disable-next-line import/no-unresolved
import availablePortals from '../../../../portals/availablePortals.json'
import useEdscStore from '../zustand/useEdscStore'
import routerHelper from '../router/router'

const restoreFromUrl = (payload) => ({
  type: RESTORE_FROM_URL,
  payload
})

export const updateStore = ({
  cmrFacets,
  collections,
  earthdataEnvironment,
  featureFacets,
  focusedCollection,
  focusedGranule,
  deprecatedUrlParams,
  mapView,
  portalId,
  project,
  query,
  shapefile,
  selectedRegion,
  timeline
}, newPathname) => async (dispatch) => {
  const { location } = routerHelper.router.state
  const { pathname } = location

  // Prevent loading from the urls that don't use URL params.
  const loadFromUrl = (
    pathname !== '/'
    && !isPath(pathname, urlPathsWithoutUrlParams)
    && !isSavedProjectsPage(location)
  )

  const portal = portalId ? buildConfig(availablePortals[portalId]) : {}

  // If the newPathname is not equal to the current pathname, restore the data from the url
  if (loadFromUrl || (newPathname && newPathname !== pathname)) {
    await dispatch(restoreFromUrl({
      collections,
      deprecatedUrlParams
    }))

    useEdscStore.setState((zustandState) => {
      // Use merge on the queries to correctly use the initial state as a fallback for `undefined` decoded values
      const mergedQuery = merge({}, zustandState.query, query)

      return ({
        ...zustandState,
        earthdataEnvironment: {
          currentEnvironment: earthdataEnvironment
        },
        facetParams: {
          ...zustandState.facetParams,
          featureFacets,
          cmrFacets
        },
        collection: {
          ...zustandState.collection,
          collectionId: focusedCollection
        },
        granule: {
          ...zustandState.granule,
          granuleId: focusedGranule
        },
        map: merge({}, zustandState.map, {
          mapView: merge({}, zustandState.map.mapView, mapView)
        }),
        portal,
        project: merge({}, zustandState.project, project),
        query: {
          ...mergedQuery,
          collection: {
            ...mergedQuery.collection,
            // If `hasGranulesOrCwic` is `undefined` from the decoded values it needs to stay `undefined` in the
            // store, not fallback to the initial state
            hasGranulesOrCwic: query.collection.hasGranulesOrCwic
          },
          selectedRegion: {
            ...mergedQuery.selectedRegion,
            ...selectedRegion
          }
        },
        shapefile: merge({}, zustandState.shapefile, shapefile),
        timeline: merge({}, zustandState.timeline, timeline)
      })
    })
  } else {
    // We always need to load the portal config
    useEdscStore.setState((zustandState) => ({
      ...zustandState,
      portal
    }))
  }
}

export const changePath = (path = '') => async (dispatch) => {
  const zustandState = useEdscStore.getState()
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

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
      await dispatch(actions.updateStore(decodedParams))
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

    await dispatch(actions.updateStore(decodedParams, pathname))
  }

  const {
    collection,
    collections,
    granule
  } = zustandState
  const { getCollectionMetadata } = collection
  const { getCollections } = collections
  const { getGranuleMetadata } = granule

  // If we are moving to a /search path, fetch collection results, this saves an extra request on the non-search pages.
  // Setting requestAddedGranules forces all page types other than search to request only the added granules if they exist, in all
  // other cases, getGranules will be requested using the granule search query params.
  if (
    pathname.includes('/search')
    // Matches /portal/<id>, which we redirect to /portal/<id>/search but needs to trigger these actions
    || pathname.match(/\/portal\/\w*/)
  ) {
    getCollections()

    // Granules Search
    if (
      pathname === '/search/granules'
      || pathname.match(/\/portal\/\w*\/search\/granules$/)
    ) {
      getCollectionMetadata()
      getGranuleMetadata()
    }

    // Collection Details
    if (
      pathname === '/search/granules/collection-details'
      || pathname.match(/\/portal\/\w*\/search\/granules\/collection-details$/)
    ) {
      getCollectionMetadata()
      getGranuleMetadata()
    }

    // Subscription Details
    if (
      pathname === '/search/granules/subscriptions'
      || pathname.match(/\/portal\/\w*\/search\/granules\/subscriptions$/)
    ) {
      getCollectionMetadata()
    }

    // Granule Details
    if (
      pathname === '/search/granules/granule-details'
      || pathname.match(/\/portal\/\w*\/search\/granules\/granule-details$/)
    ) {
      getCollectionMetadata()

      getGranuleMetadata()
    }
  }

  // Fetch collections in the project
  const { focusedCollection, project = {} } = decodedParams || {}
  const { collections: projectCollections = {} } = project
  const { allIds = [] } = projectCollections

  const {
    project: zustandProject,
    timeline
  } = zustandState

  if (allIds.length > 0) {
    // Project collection metadata needs to exist before calling retrieving access methods
    await zustandProject.getProjectCollections()

    zustandProject.getProjectGranules()
  }

  const { getTimeline } = timeline

  // Only fetch timeline data if there's a focused collection or project collections
  // This prevents unbounded timeline requests to CMR without collection_id
  if (focusedCollection || allIds.length > 0) {
    getTimeline()
  }

  return null
}

const updateUrl = ({ options, oldPathname, newPathname }) => () => {
  // Only replace if the pathname stays the same as the current pathname.
  // Push if the pathname is different
  if (oldPathname === newPathname) {
    routerHelper.router.navigate(options, { replace: true })
  } else {
    routerHelper.router.navigate(options)
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

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const {
    authToken,
    savedProject
  } = state

  let newOptions = options
  const { location } = routerHelper.router.state
  const { pathname: oldPathname } = location

  let newPathname
  if (typeof options === 'string') {
    [newPathname] = options.split('?')

    const { projectId, name, path } = savedProject
    if (projectId || options.length > 2000) {
      // Make sure the path has changed, and is not a path where we don't use params
      if (path !== newOptions && !isPath(newOptions, urlPathsWithoutUrlParams)) {
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
              routerHelper.router.navigate(newOptions, { replace: true })
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
