import { replace, push } from 'connected-react-router'

import { decodeUrlParams } from '../util/url/url'
import actions from './index'

export const changePath = (path = '') => (dispatch) => {
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
    updateFeatureFacet,
    updateShapefile
  } = actions

  const {
    collections,
    cmrFacets,
    featureFacets,
    focusedCollection,
    focusedGranule,
    map,
    project,
    query,
    shapefile,
    timeline
  } = decodeUrlParams(queryString)

  if (map) {
    dispatch(changeMap(map))
  }

  if (shapefile) {
    dispatch(updateShapefile(shapefile))
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
export const changeUrl = options => (dispatch, getState) => {
  const { router } = getState()
  const { location } = router
  const { pathname: oldPathname } = location

  let newPathname
  if (typeof options === 'string') {
    [newPathname] = options.split('?')
  } else {
    ({ pathname: newPathname } = options)
  }

  // Only replace if the pathname stays the same as the current pathname.
  // Push if the pathname is different
  if (oldPathname === newPathname) {
    dispatch(replace(options))
  } else {
    dispatch(push(options))
  }
}
