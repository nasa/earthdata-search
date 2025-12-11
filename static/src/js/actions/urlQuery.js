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

import { buildConfig } from '../util/portals'

// eslint-disable-next-line import/no-unresolved
import availablePortals from '../../../../portals/availablePortals.json'

import useEdscStore from '../zustand/useEdscStore'

import routerHelper from '../router/router'

import { routes } from '../constants/routes'
import { MODAL_NAMES } from '../constants/modalNames'

export const updateStore = ({
  cmrFacets,
  deprecatedUrlParams,
  earthdataEnvironment,
  featureFacets,
  focusedCollection,
  focusedGranule,
  mapView,
  portalId,
  project,
  query,
  selectedRegion,
  shapefile,
  timeline
}, newPathname) => async () => {
  const { location } = routerHelper.router.state
  const { pathname } = location

  // Prevent loading from the urls that don't use URL params.
  const loadFromUrl = (
    pathname !== routes.HOME
    && !isPath(pathname, urlPathsWithoutUrlParams)
    && !isSavedProjectsPage(location)
  )

  const portal = portalId ? buildConfig(availablePortals[portalId]) : {}

  // If the newPathname is not equal to the current pathname, restore the data from the url
  if (loadFromUrl || (newPathname && newPathname !== pathname)) {
    useEdscStore.setState((zustandState) => {
      // Use merge on the queries to correctly use the initial state as a fallback for `undefined` decoded values
      const mergedQuery = merge({}, zustandState.query, query)

      const modals = { ...zustandState.ui.modals }

      if (deprecatedUrlParams.length > 0) {
        modals.openModal = MODAL_NAMES.DEPRECATED_PARAMETER
        modals.modalData = { deprecatedUrlParams }
      }

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
        timeline: merge({}, zustandState.timeline, timeline),
        ui: {
          ...zustandState.ui,
          modals
        }
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
    const { projectId } = parse(queryString)

    const { savedProject } = useEdscStore.getState()
    const { getProject } = savedProject

    // Fetch the project
    await getProject(projectId)

    // Get the updated project from the store
    const { savedProject: updatedProject } = useEdscStore.getState()
    const { project } = updatedProject
    const { path: projectPath } = project

    // In the event that the user has the earthdata environment set to the deployed environment
    // the ee param will not exist, we need to ensure its provided on the `state` param for redirect purposes
    const [, projectQueryString] = projectPath.split('?')

    // Parse the query string into an object
    const paramsObj = parse(projectQueryString, { parseArrays: false })

    // If the earthdata environment variable
    if (!Object.keys(paramsObj).includes('ee')) {
      paramsObj.ee = earthdataEnvironment
    }

    decodedParams = decodeUrlParams(stringify(paramsObj))
    await dispatch(actions.updateStore(decodedParams))
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
    pathname.includes(routes.SEARCH)
    // Matches /portal/<id>, which we redirect to /portal/<id>/search but needs to trigger these actions
    || pathname.match(/\/portal\/\w*/)
  ) {
    getCollections()

    // Granules Search
    if (
      pathname === routes.GRANULES
      || pathname.match(/\/portal\/\w*\/search\/granules$/)
    ) {
      getCollectionMetadata()
      getGranuleMetadata()
    }

    // Collection Details
    if (
      pathname === routes.COLLECTION_DETAILS
      || pathname.match(/\/portal\/\w*\/search\/granules\/collection-details$/)
    ) {
      getCollectionMetadata()
      getGranuleMetadata()
    }

    // Subscription Details
    if (
      pathname === routes.GRANULE_SUBSCRIPTIONS
      || pathname.match(/\/portal\/\w*\/search\/granules\/subscriptions$/)
    ) {
      getCollectionMetadata()
    }

    // Granule Details
    if (
      pathname === routes.GRANULE_DETAILS
      || pathname.match(/\/portal\/\w*\/search\/granules\/granule-details$/)
    ) {
      getCollectionMetadata()

      getGranuleMetadata()
    }
  }

  // Fetch collections in the project
  const { project = {} } = decodedParams || {}
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
  getTimeline()

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
export const changeUrl = (options) => (dispatch) => {
  const { location } = routerHelper.router.state
  const { pathname: oldPathname } = location

  let newPathname

  if (typeof options === 'string') {
    [newPathname] = options.split('?')
    const newSearch = options.split('?')[1] || ''

    // Prevent loading from the urls that don't use URL params.
    const stripParameters = (
      isPath(newPathname, urlPathsWithoutUrlParams)
      || isSavedProjectsPage({
        pathname: newPathname,
        search: newSearch
      })
    )

    let newOptions = options
    if (stripParameters) {
      newOptions = newPathname
    }

    dispatch(updateUrl({
      options: newOptions,
      oldPathname,
      newPathname
    }))
  } else {
    ({ pathname: newPathname } = options)

    dispatch(updateUrl({
      options,
      oldPathname,
      newPathname
    }))
  }

  return null
}
