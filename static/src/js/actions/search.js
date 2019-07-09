import { isEmpty } from 'lodash'

import actions from './index'
import { UPDATE_COLLECTION_QUERY, UPDATE_GRANULE_QUERY } from '../constants/actionTypes'

export const updateCollectionQuery = payload => ({
  type: UPDATE_COLLECTION_QUERY,
  payload
})

export const updateGranuleQuery = payload => ({
  type: UPDATE_GRANULE_QUERY,
  payload
})

export const changeQuery = newQuery => (dispatch, getState) => {
  const state = getState()
  const { query: prevQuery } = state
  const {
    collection: prevCollection = {},
    granule: prevGranule = {}
  } = prevQuery

  const collectionQuery = {}
  const granuleQuery = {}

  if (prevCollection.keyword !== newQuery.keyword) {
    collectionQuery.keyword = newQuery.keyword
  }
  if (prevCollection.spatial !== newQuery.spatial) {
    collectionQuery.spatial = newQuery.spatial
  }
  if (prevCollection.temporal !== newQuery.temporal) {
    collectionQuery.temporal = newQuery.temporal
  }
  if (prevCollection.grid !== newQuery.grid) {
    collectionQuery.grid = newQuery.grid
  }
  if (prevCollection.overrideTemporal !== newQuery.overrideTemporal) {
    collectionQuery.overrideTemporal = newQuery.overrideTemporal
  }

  if (prevGranule.gridCoords !== newQuery.gridCoords) {
    granuleQuery.gridCoords = newQuery.gridCoords
  }

  if (!isEmpty(collectionQuery)) {
    dispatch(updateCollectionQuery({
      pageNum: 1,
      ...collectionQuery
    }))
  }

  if (!isEmpty(granuleQuery)) {
    dispatch(updateGranuleQuery({
      pageNum: 1,
      ...granuleQuery
    }))
  }

  // Remove all saved granules in the metadata/collections store
  dispatch(actions.clearCollectionGranules())
  dispatch(actions.getCollections())
  dispatch(actions.getGranules())
  dispatch(actions.getTimeline())
}

export const changeProjectQuery = query => (dispatch) => {
  dispatch(updateCollectionQuery(query))
  dispatch(actions.getProjectCollections())
}

export const changeCollectionPageNum = pageNum => (dispatch) => {
  dispatch(updateCollectionQuery({ pageNum }))
  dispatch(actions.getCollections())
}

export const changeGranulePageNum = pageNum => (dispatch) => {
  dispatch(updateGranuleQuery({ pageNum }))
  dispatch(actions.getGranules())
}

export const changeGranuleGridCoords = gridCoords => (dispatch) => {
  dispatch(updateGranuleQuery({ gridCoords }))
  dispatch(actions.getGranules())
}

export const removeGridFilter = () => (dispatch) => {
  dispatch(changeQuery({
    grid: '',
    gridCoords: ''
  }))
  dispatch(actions.toggleSelectingNewGrid(false))
}

export const removeSpatialFilter = () => (dispatch) => {
  dispatch(changeQuery({
    spatial: {}
  }))
  dispatch(actions.toggleDrawingNewLayer(false))
}

export const removeTemporalFilter = () => (dispatch) => {
  dispatch(changeQuery({
    temporal: {}
  }))
}

export const clearFilters = () => (dispatch) => {
  const query = {
    keyword: '',
    spatial: {},
    temporal: {}
  }

  // Remove URL items
  dispatch(actions.changeUrl({}))

  // Update Store
  dispatch(changeQuery(query))
}
