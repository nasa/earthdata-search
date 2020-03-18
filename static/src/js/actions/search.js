import { isEqual } from 'lodash'
import actions from './index'
import {
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_QUERY,
  UPDATE_REGION_QUERY
} from '../constants/actionTypes'
import { clearExcludedGranules } from './granules'
import { parseError } from '../../../../sharedUtils/parseError'

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
  const {
    focusedCollection,
    project,
    query
  } = getState()
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

    // Fetch collections in the project
    const { collectionIds = [] } = project

    // Create a unique list of collections to fetch and remove any empty values [.filter(Boolean)]
    const uniqueCollectionList = [...new Set([
      ...collectionIds,
      focusedCollection
    ])].filter(Boolean)

    // Fetch metadata for collections added to the project
    if (uniqueCollectionList.length > 0) {
      try {
        dispatch(actions.getProjectCollections(uniqueCollectionList))
        dispatch(actions.getGranules(uniqueCollectionList))
      } catch (e) {
        parseError(e)
      }
    }
  }

  dispatch(actions.getTimeline())
}

export const changeProjectQuery = query => async (dispatch, getState) => {
  const { collection } = query

  dispatch(updateCollectionQuery(collection))

  const { project = {} } = getState()
  const { collectionIds = [] } = project

  if (collectionIds.length > 0) {
    try {
      await dispatch(actions.getProjectCollections(collectionIds))

      dispatch(actions.getGranules(collectionIds))
    } catch (e) {
      parseError(e)
    }
  }
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
  dispatch(actions.clearAutocompleteSelected())
  dispatch(actions.updateAdvancedSearch({}))
  dispatch(changeQuery(query))
  dispatch(actions.clearShapefile())
}
