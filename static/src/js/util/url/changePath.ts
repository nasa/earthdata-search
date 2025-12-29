import { parse, stringify } from 'qs'
// @ts-expect-error This file doesn't have types
import { decodeUrlParams } from './url'
import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import { updateStore } from './updateStore'

import { routes } from '../../constants/routes'

export const changePath = async (path = '') => {
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
    await getProject(projectId as string)

    // Get the updated project from the store
    const { savedProject: updatedProject } = useEdscStore.getState()
    const { project } = updatedProject
    const { path: projectPath } = project

    // In the event that the user has the earthdata environment set to the deployed environment
    // the ee param will not exist, we need to ensure its provided on the `state` param for redirect purposes
    const [, projectQueryString] = projectPath!.split('?')

    // Parse the query string into an object
    const paramsObj = parse(projectQueryString, { parseArrays: false })

    // If the earthdata environment variable
    if (!Object.keys(paramsObj).includes('ee')) {
      paramsObj.ee = earthdataEnvironment
    }

    decodedParams = decodeUrlParams(stringify(paramsObj))
    await updateStore(decodedParams)
  } else {
    decodedParams = decodeUrlParams(queryString)

    await updateStore(decodedParams, pathname)
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
