import actions from './index'
import {
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_REGION_QUERY,
  CLEAR_FILTERS
} from '../constants/actionTypes'

export const updateCollectionQuery = payload => ({
  type: UPDATE_COLLECTION_QUERY,
  payload
})

export const updateGranuleSearchQuery = payload => ({
  type: UPDATE_GRANULE_SEARCH_QUERY,
  payload
})

export const updateRegionQuery = payload => ({
  type: UPDATE_REGION_QUERY,
  payload
})

export const changeQuery = (queryOptions = {}) => async (dispatch, getState) => {
  const {
    focusedCollection,
    query
  } = getState()

  const newQuery = queryOptions

  const { collection: collectionQuery = {} } = query
  const {
    byId: collectionQueryById
  } = collectionQuery

  if (newQuery.collection) {
    dispatch(updateCollectionQuery({
      pageNum: 1,
      ...newQuery.collection
    }))

    dispatch(actions.getCollections())

    if (focusedCollection) {
      const { [focusedCollection]: focusedCollectionCollectionQuery } = collectionQueryById
      const { granules: focusedCollectionGranuleQuery } = focusedCollectionCollectionQuery

      dispatch(updateGranuleSearchQuery({
        collectionId: focusedCollection,
        ...focusedCollectionGranuleQuery,
        pageNum: 1
      }))

      dispatch(actions.getSearchGranules())
    }
  }
}

export const changeProjectQuery = query => async (dispatch) => {
  const { collection } = query

  dispatch(updateCollectionQuery(collection))

  dispatch(actions.getProjectGranules())
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
  const { searchResults } = getState()

  const {
    collections: collectionsSearchResults
  } = searchResults

  const {
    byId: collectionsSearchResultsById
  } = collectionsSearchResults

  const {
    [collectionId]: collectionSearchResults
  } = collectionsSearchResultsById

  const {
    granules
  } = collectionSearchResults

  const {
    allIds,
    hits
  } = granules

  // Only load the next page of granules if there are granule results already loaded
  // and the granules loaded is less than the total granules
  if (allIds.length > 0 && allIds.length < hits) {
    // Update the collection specific granule query params
    dispatch(updateGranuleSearchQuery({
      collectionId,
      pageNum
    }))

    // Fetch the next page of granules
    dispatch(actions.getSearchGranules())
  }
}

export const removeGridFilter = () => (dispatch) => {
  dispatch(changeQuery({
    collection: {
      gridName: ''
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
  dispatch({ type: CLEAR_FILTERS })

  dispatch(actions.getCollections())
  dispatch(actions.getProjectCollections())
  dispatch(actions.getSearchGranules())
  dispatch(actions.getTimeline())
}
