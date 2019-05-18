import actions from './index'
import { updateGranuleQuery } from './search'
import {
  UPDATE_FOCUSED_COLLECTION,
  ADD_COLLECTION_GRANULES,
  CLEAR_COLLECTION_GRANULES
} from '../constants/actionTypes'
import { updateCollectionMetadata } from './collections'
import { updateGranuleResults, addGranulesFromCollection } from './granules'
import CollectionRequest from '../util/request/collectionRequest'

export const updateFocusedCollection = payload => ({
  type: UPDATE_FOCUSED_COLLECTION,
  payload
})

export const addCollectionGranules = payload => ({
  type: ADD_COLLECTION_GRANULES,
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
  const { focusedCollection, searchResults } = getState()

  const { granules } = searchResults
  const { allIds = [] } = granules

  // Reset granule pageNum to 1 when focusedCollection is changing
  dispatch(updateGranuleQuery({ pageNum: 1 }))

  if (focusedCollection === '') {
    dispatch(updateGranuleResults({ results: [] }))
    return null
  }

  const { auth } = getState()
  const requestObject = new CollectionRequest(auth !== '')

  const response = requestObject.search({
    concept_id: focusedCollection,
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    includeHasGranules: true
  })
    .then((response) => {
      const payload = {}
      const [metadata] = response.data.feed.entry
      payload[focusedCollection] = metadata

      dispatch(updateCollectionMetadata(payload))

      // If granules were copied from collections, don't make a new getGranules request
      if (allIds.length === 0) dispatch(actions.getGranules())
      // dispatch(getGranules())
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
