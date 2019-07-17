import { replace } from 'connected-react-router'

import { decodeUrlParams } from '../util/url/url'
import actions from './index'

export const changePath = (path = '') => (dispatch) => {
  console.warn('changePath')
  const queryString = path.split('?')[1]

  const {
    changeFocusedCollection,
    changeFocusedGranule,
    changeMap,
    changeQuery,
    changeTimelineQuery,
    restoreCollections,
    restoreProject,
    updateCmrFacet,
    setGranuleDownloadParams,
    updateFeatureFacet
  } = actions

  const {
    collections,
    cmrFacets,
    granuleDownloadParams,
    featureFacets,
    focusedCollection,
    focusedGranule,
    map,
    project,
    query,
    timeline
  } = decodeUrlParams(queryString)

  console.warn('feature facets', featureFacets)

  if (map) {
    dispatch(changeMap(map))
  }

  if (focusedGranule) {
    dispatch(changeFocusedGranule(focusedGranule))
  }

  if (timeline) {
    dispatch(changeTimelineQuery(timeline))
  }

  if (featureFacets) {
    dispatch(updateFeatureFacet(featureFacets))
  }

  if (cmrFacets) {
    dispatch(updateCmrFacet(cmrFacets))
  }

  if (Object.keys(query).length > 0) {
    dispatch(changeQuery({ ...query }))
  }

  if (project) {
    dispatch(restoreProject(project))
  }

  if (collections) {
    dispatch(restoreCollections(collections))
  }

  if (focusedCollection) {
    dispatch(changeFocusedCollection(focusedCollection))
  }

  if (granuleDownloadParams) {
    dispatch(setGranuleDownloadParams(granuleDownloadParams))
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
export const changeUrl = options => (dispatch) => {
  dispatch(replace(options))
}

export default changeUrl
