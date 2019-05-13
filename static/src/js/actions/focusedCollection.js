import actions from './index'
import { updateGranuleQuery } from './search'
import { CollectionRequest } from '../util/request/cmr'
import { UPDATE_FOCUSED_COLLECTION, ADD_COLLECTION_GRANULES } from '../constants/actionTypes'
import { updateCollections } from './collections'
import { updateGranules, addGranulesFromCollection } from './granules'

export const updateFocusedCollection = payload => ({
  type: UPDATE_FOCUSED_COLLECTION,
  payload
})

export const addCollectionGranules = payload => ({
  type: ADD_COLLECTION_GRANULES,
  payload
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
  const { collections } = getState()
  const collection = collections.byId[collectionId]

  if (!collection) return null

  const { granules } = collection

  return dispatch(addGranulesFromCollection(granules))
}


/**
 * Perform a collection request based on a supplied collection ID.
 * @param {string} collectionId - A CMR Collection ID.
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const getFocusedCollection = () => (dispatch, getState) => {
  const { focusedCollection, searchResults } = getState()

  const { granules } = searchResults
  const { allIds = [] } = granules

  // Reset granule pageNum to 1 when focusedCollection is changing
  dispatch(updateGranuleQuery({ pageNum: 1 }))

  if (focusedCollection === '') {
    dispatch(updateGranules({ results: [] }))
    return null
  }

  const requestObject = new CollectionRequest()

  const response = requestObject.search({
    concept_id: focusedCollection,
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    includeHasGranules: true
  })
    .then((response) => {
      const payload = {}
      const [metadata] = response.data.feed.entry
      payload[focusedCollection] = metadata

      // dispatch(updateFocusedCollection(focusedCollection))

      dispatch(updateCollections(payload))

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
