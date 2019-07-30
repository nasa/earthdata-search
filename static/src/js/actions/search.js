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

export const changeQuery = newQuery => (dispatch) => {
  dispatch(updateCollectionQuery({
    pageNum: 1,
    ...newQuery.collection
  }))

  dispatch(updateGranuleQuery({
    pageNum: 1,
    ...newQuery.granule
  }))

  // Remove all saved granules in the metadata/collections store
  dispatch(actions.clearCollectionGranules())
  dispatch(actions.getCollections())
  dispatch(actions.getGranules())
  dispatch(actions.getTimeline())
}

export const changeProjectQuery = query => (dispatch) => {
  dispatch(updateCollectionQuery(query.collection))
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
    }
  }))
  dispatch(actions.toggleDrawingNewLayer(false))
  dispatch(actions.updateShapefile({
    shapefileName: undefined,
    shapefileId: undefined,
    shapefileSize: undefined,
    shapefileError: false
  }))
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
    }
  }

  // Update Store
  dispatch(changeQuery(query))
  dispatch(actions.updateShapefile({
    shapefileName: undefined,
    shapefileId: undefined,
    shapefileSize: undefined
  }))
}
