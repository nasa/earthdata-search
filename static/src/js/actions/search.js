import { isEqual } from 'lodash'
import actions from './index'
import {
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_QUERY,
  UPDATE_REGION_QUERY
} from '../constants/actionTypes'
import { clearExcludedGranules } from './granules'

export const updateCollectionQuery = payload => ({
  type: UPDATE_COLLECTION_QUERY,
  payload
})

export const updateGranuleQuery = payload => ({
  type: UPDATE_GRANULE_QUERY,
  payload
})

export const updateRegionQuery = payload => ({
  type: UPDATE_REGION_QUERY,
  payload
})

export const changeQuery = (queryOptions = {}) => (dispatch, getState) => {
  const { query } = getState()
  const newQuery = queryOptions

  // Pull out the values from the query being changed
  const { collection = {} } = newQuery

  const {
    gridName,
    spatial,
    temporal,
    overideTemporal
  } = collection

  // Pull out data from the store to compare to, if there are changes we should clear the excluded granules
  const { collection: collectionQuery = {} } = query
  const {
    gridName: gridNameQuery,
    spatial: spatialQuery,
    temporal: temporalQuery,
    overrideTemporal: overrideTemporalQuery
  } = collectionQuery

  if ((!isEqual(gridName, gridNameQuery))
    || (!isEqual(spatial, spatialQuery))
    || (!isEqual(temporal, temporalQuery))
    || (!isEqual(overideTemporal, overrideTemporalQuery))
  ) {
    dispatch(clearExcludedGranules())
  }

  if (newQuery.collection) {
    dispatch(updateCollectionQuery({
      pageNum: 1,
      ...newQuery.collection
    }))
  }

  dispatch(updateGranuleQuery({
    pageNum: 1,
    ...newQuery.granule
  }))

  // Remove all saved granules in the metadata/collections store
  dispatch(actions.clearCollectionGranules())
  // If the collection query didn't change don't get new collections
  if (newQuery.collection) {
    dispatch(actions.getCollections())
    // Fetch metadata for collections added to the project
    dispatch(actions.getProjectCollections())
  }
  dispatch(actions.getGranules())
  dispatch(actions.getTimeline())
}

export const changeProjectQuery = query => (dispatch) => {
  dispatch(updateCollectionQuery(query.collection))
  dispatch(actions.getProjectCollections())
}

export const changeRegionQuery = query => (dispatch) => {
  dispatch(updateRegionQuery(query))
  dispatch(actions.getRegions())
}

export const changeCollectionPageNum = pageNum => (dispatch) => {
  dispatch(updateCollectionQuery({ pageNum }))
  dispatch(actions.getCollections())
}

export const changeGranulePageNum = ({ collectionId, pageNum }) => (dispatch, getState) => {
  const { metadata } = getState()
  const { collections } = metadata
  const { byId } = collections
  const { granules } = byId[collectionId]
  const { allIds, hits } = granules

  // Only load the next page of granules if there are granule results already loaded
  // and the granules loaded is less than the total granules
  if (allIds.length > 0 && allIds.length < hits) {
    dispatch(updateGranuleQuery({ pageNum }))
    dispatch(actions.getGranules())
  }
}

export const changeGranuleGridCoords = gridCoords => (dispatch) => {
  dispatch(updateGranuleQuery({ gridCoords }))
  dispatch(actions.getGranules())
}

export const removeGridFilter = () => (dispatch) => {
  dispatch(changeQuery({
    collection: {
      gridName: ''
    },
    granule: {
      gridCoords: ''
    }
  }))
  dispatch(actions.toggleSelectingNewGrid(false))
}

export const removeSpatialFilter = () => (dispatch) => {
  dispatch(changeQuery({
    collection: {
      spatial: {}
    },
    region: {
      exact: false
    }
  }))
  dispatch(actions.toggleDrawingNewLayer(false))
  dispatch(actions.clearShapefile())
}

export const removeTemporalFilter = () => (dispatch) => {
  dispatch(changeQuery({
    collection: {
      temporal: {}
    }
  }))
}

export const clearFilters = () => (dispatch) => {
  const query = {
    collection: {
      gridName: '',
      keyword: '',
      spatial: {},
      temporal: {}
    },
    granule: {
      gridCoords: ''
    },
    region: {
      exact: false
    }
  }

  // Update Store
  dispatch(actions.updateAdvancedSearch({}))
  dispatch(changeQuery(query))
  dispatch(actions.clearShapefile())
}
