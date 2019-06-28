import { push } from 'connected-react-router'

import { decodeUrlParams } from '../util/url/url'
import actions from './index'

export const changeUrl = url => (dispatch) => {
  dispatch(push(url))
}

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

export default changeUrl
