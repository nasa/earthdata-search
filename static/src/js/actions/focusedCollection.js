import actions from './index'
import { updateGranuleQuery } from './search'
import {
  CLEAR_COLLECTION_GRANULES,
  COPY_GRANULE_RESULTS_TO_COLLECTION,
  UPDATE_FOCUSED_COLLECTION
} from '../constants/actionTypes'
import { updateCollectionMetadata } from './collections'
import { updateGranuleResults, addGranulesFromCollection } from './granules'
import { updateAuthTokenFromHeaders } from './authToken'
import CollectionRequest from '../util/request/collectionRequest'

export const updateFocusedCollection = payload => ({
  type: UPDATE_FOCUSED_COLLECTION,
  payload
})

export const addCollectionGranules = payload => ({
  type: COPY_GRANULE_RESULTS_TO_COLLECTION,
  payload
})

export const clearCollectionGranules = () => ({
  type: CLEAR_COLLECTION_GRANULES
})

/**
 * Copy granules from searchResults to collections
 */
export const copyGranulesToCollection = () => (dispatch, getState) => {
  const { focusedCollection, searchResults } = getState()
  const { granules } = searchResults

  const {
    allIds,
    byId,
    isCwic,
    hits
  } = granules

  dispatch(addCollectionGranules({
    collectionId: focusedCollection,
    granules: {
      allIds,
      byId,
      isCwic,
      hits
    }
  }))
}

/**
 * Copy granules from a given collection into searchResults
 * @param {string} collectionId
 */
export const copyGranulesFromCollection = collectionId => (dispatch, getState) => {
  const { metadata } = getState()
  const { collections } = metadata
  const collection = collections.byId[collectionId]

  if (!collection) return null

  const { granules } = collection
  const { allIds } = granules
  if (!allIds) return null

  return dispatch(addGranulesFromCollection(granules))
}


/**
 * Perform a collection request based on the focusedCollection from the store.
 */
export const getFocusedCollection = () => (dispatch, getState) => {
  const { focusedCollection, metadata, searchResults } = getState()

  const { granules } = searchResults
  const { allIds = [] } = granules

  // Reset granule pageNum to 1 when focusedCollection is changing
  dispatch(updateGranuleQuery({ pageNum: 1 }))

  if (focusedCollection === '') {
    dispatch(updateGranuleResults({ results: [] }))
    return null
  }

  const { collections } = metadata
  const { allIds: fetchedCollectionIds } = collections
  // If we already have the metadata for this focusedCollection, don't fetch it again
  if (fetchedCollectionIds.indexOf(focusedCollection) !== -1) {
    // If granules were copied from collections, don't make a new getGranules request
    if (allIds.length === 0) dispatch(actions.getGranules())
    return null
  }

  const { authToken } = getState()
  const requestObject = new CollectionRequest(authToken)

  const response = requestObject.search({
    concept_id: [focusedCollection],
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    includeHasGranules: true
  })
    .then((response) => {
      const payload = []
      const [metadata] = response.data.feed.entry
      payload.push({ [focusedCollection]: metadata })

      dispatch(updateAuthTokenFromHeaders(response.headers))
      dispatch(updateCollectionMetadata(payload))

      // If granules were copied from collections, don't make a new getGranules request
      if (allIds.length === 0) dispatch(actions.getGranules())
    }, (error) => {
      dispatch(updateFocusedCollection(''))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

/**
 * Change the focusedCollection, copy granules, and get the focusedCollection metadata
 * @param {string} collectionId
 */
export const changeFocusedCollection = collectionId => (dispatch) => {
  if (collectionId === '') dispatch(copyGranulesToCollection())

  if (collectionId !== '') dispatch(copyGranulesFromCollection(collectionId))

  dispatch(updateFocusedCollection(collectionId))
  dispatch(actions.getFocusedCollection())
  // dispatch(getFocusedCollection())
}
