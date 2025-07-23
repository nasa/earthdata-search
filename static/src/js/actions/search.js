import actions from './index'
import {
  UPDATE_COLLECTION_QUERY,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_REGION_QUERY,
  CLEAR_FILTERS
} from '../constants/actionTypes'

import { getFocusedCollectionGranuleQuery } from '../selectors/query'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import isPath from '../util/isPath'
import useEdscStore from '../zustand/useEdscStore'
import { getProjectCollectionsIds } from '../zustand/selectors/project'

export const updateCollectionQuery = (payload) => ({
  type: UPDATE_COLLECTION_QUERY,
  payload
})

// Updates the granule search query, keeping existing values
export const updateGranuleSearchQuery = (payload) => ({
  type: UPDATE_GRANULE_SEARCH_QUERY,
  payload
})

export const updateRegionQuery = (payload) => ({
  type: UPDATE_REGION_QUERY,
  payload
})

export const changeQuery = (queryOptions = {}) => async (dispatch, getState) => {
  const state = getState()

  const zustandState = useEdscStore.getState()

  // Retrieve data from Redux using selectors
  const focusedCollectionGranuleQuery = getFocusedCollectionGranuleQuery(state)
  const focusedCollectionId = getFocusedCollectionId(state)
  const projectCollectionsIds = getProjectCollectionsIds(zustandState)

  const newQuery = queryOptions

  if (newQuery.collection) {
    dispatch(updateCollectionQuery({
      pageNum: 1,
      ...newQuery.collection
    }))

    dispatch(actions.getCollections())

    // If there is a focused collection, update it's granule search params
    // and request it's granules started with page one
    if (focusedCollectionId) {
      dispatch(updateGranuleSearchQuery({
        collectionId: focusedCollectionId,
        ...focusedCollectionGranuleQuery,
        pageNum: 1
      }))

      dispatch(actions.getSearchGranules())
    }

    // If there are collections in the project, update their respective granule results
    if (projectCollectionsIds.length > 0) {
      const { project } = zustandState
      const { getProjectGranules } = project
      getProjectGranules()
    }
  }

  // Clear any subscription disabledFields
  dispatch(actions.removeSubscriptionDisabledFields())
}

export const changeProjectQuery = (query) => async (dispatch) => {
  const { collection } = query

  dispatch(updateCollectionQuery(collection))

  const { project } = useEdscStore.getState()
  const { getProjectGranules } = project
  getProjectGranules()
}

export const changeRegionQuery = (query) => (dispatch) => {
  dispatch(updateRegionQuery(query))
  dispatch(actions.getRegions())
}

export const changeCollectionPageNum = (pageNum) => (dispatch) => {
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

  const zustandState = useEdscStore.getState()
  const { shapefile } = zustandState
  const { clearShapefile } = shapefile
  clearShapefile()
}

export const removeTemporalFilter = () => (dispatch) => {
  dispatch(changeQuery({
    collection: {
      temporal: {}
    }
  }))
}

export const clearFilters = () => (dispatch, getState) => {
  // TODO EDSC-4514: Create a clearFilters function in zustand that manages clearing everything
  const { facetParams, project } = useEdscStore.getState()
  const { resetFacetParams } = facetParams
  resetFacetParams()

  dispatch({ type: CLEAR_FILTERS })

  dispatch(actions.getCollections())
  const { getProjectCollections } = project
  getProjectCollections()

  const state = getState()
  const { router } = state
  const { location } = router
  const { pathname } = location

  // Don't request granules unless we are viewing granules
  if (isPath(pathname, ['/search/granules'])) {
    dispatch(actions.getSearchGranules())

    const zustandState = useEdscStore.getState()
    const { timeline } = zustandState
    const { getTimeline } = timeline
    getTimeline()
  }
}
