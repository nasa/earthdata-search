import actions from './index'
import { updateGranuleQuery } from './search'
import {
  CLEAR_COLLECTION_GRANULES,
  COPY_GRANULE_RESULTS_TO_COLLECTION,
  UPDATE_FOCUSED_COLLECTION
} from '../constants/actionTypes'
import { updateCollectionMetadata } from './collections'
import { resetGranuleResults, addGranulesFromCollection } from './granules'
import { updateAuthTokenFromHeaders } from './authToken'
import { createFocusedCollectionMetadata, getCollectionMetadata } from '../util/focusedCollection'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'
import { eventEmitter } from '../events/events'

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
    hits,
    loadTime
  } = granules

  dispatch(addCollectionGranules({
    collectionId: focusedCollection,
    granules: {
      allIds,
      byId,
      isCwic,
      hits,
      loadTime
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

  if (!collection) return dispatch(resetGranuleResults())

  const { granules } = collection
  const { allIds } = granules
  if (!allIds) return dispatch(resetGranuleResults())

  return dispatch(addGranulesFromCollection(granules))
}

/**
 * Perform a collection request based on the focusedCollection from the store.
 */
export const getFocusedCollection = () => async (dispatch, getState) => {
  const {
    authToken,
    focusedCollection,
    metadata,
    searchResults
  } = getState()

  const { granules, collections: collectionResults = {} } = searchResults
  const { allIds = [] } = granules

  const { byId: searchResultsById = {} } = collectionResults
  const focusedCollectionMetadata = searchResultsById[focusedCollection]

  const { is_cwic: isCwic = false } = metadata
  const payload = [{
    [focusedCollection]: {
      isCwic,
      metadata: {
        ...focusedCollectionMetadata
      }
    }
  }]

  // Reset granule pageNum to 1 when focusedCollection is changing
  dispatch(updateGranuleQuery({ pageNum: 1 }))

  if (focusedCollection === '') {
    dispatch(updateCollectionMetadata([]))
    dispatch(resetGranuleResults())
    return null
  }

  dispatch(actions.collectionRelevancyMetrics())
  dispatch(updateCollectionMetadata(payload))

  const { collections } = metadata
  const { allIds: fetchedCollectionIds, byId: fetchedCollections } = collections
  // If we already have the metadata for this focusedCollection, don't fetch it again
  if (fetchedCollectionIds.indexOf(focusedCollection) !== -1) {
    // Check to see if we already have metadata for this collection
    if (Object.keys(fetchedCollections[focusedCollection].metadata).length) {
      // If granules were copied from collections, don't make a new getGranules request
      if (allIds.length === 0) dispatch(actions.getGranules())
      return null
    }
  }

  const response = getCollectionMetadata({
    concept_id: [focusedCollection],
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    includeHasGranules: true
  }, authToken)
    .then(([collectionJson, collectionUmm]) => {
      const payload = []
      const [metadata] = collectionJson.data.feed.entry
      const [ummItem] = collectionUmm.data.items
      const ummMetadata = ummItem.umm

      // Pass json and ummJson into createFocusedCollectionMetadata to transform/normalize the data
      // to be used in the UI.
      const formattedMetadata = createFocusedCollectionMetadata(metadata, ummMetadata, authToken)

      const { is_cwic: isCwic = false } = metadata

      // The raw data from the json and ummJson requests are added to the state, as well as the
      // transformed/normalized metadata.
      payload.push({
        [focusedCollection]: {
          metadata,
          ummMetadata,
          formattedMetadata,
          isCwic
        }
      })

      // The .all().then() will only fire when both requests resolve successfully, so we can
      // rely on collectionJson to have the correct auth information in its headers.
      dispatch(updateAuthTokenFromHeaders(collectionJson.headers))
      dispatch(updateCollectionMetadata(payload))

      // If granules were copied from collections, don't make a new getGranules request.
      if (allIds.length === 0) dispatch(actions.getGranules())
    })
    .catch((error) => {
      dispatch(updateFocusedCollection(''))
      dispatch(actions.handleError({
        error,
        action: 'getFocusedCollection',
        resource: 'collection'
      }))
    })

  return response
}

/**
 * Change the focusedCollection, copy granules, and get the focusedCollection metadata.
 * @param {string} collectionId
 */
export const changeFocusedCollection = collectionId => (dispatch, getState) => {
  if (collectionId === '') {
    dispatch(copyGranulesToCollection())
    dispatch(actions.changeFocusedGranule(''))
    eventEmitter.emit('map.stickygranule', { granule: null })

    const { router } = getState()
    const { location } = router
    const { search } = location

    dispatch(actions.changeUrl({
      pathname: `${portalPathFromState(getState())}/search`,
      search
    }))
  }

  if (collectionId !== '') dispatch(copyGranulesFromCollection(collectionId))

  dispatch(updateFocusedCollection(collectionId))
  dispatch(actions.getTimeline())
  dispatch(actions.getFocusedCollection())
}

export const viewCollectionGranules = collectionId => (dispatch, getState) => {
  dispatch(changeFocusedCollection(collectionId))

  const { router } = getState()
  const { location } = router
  const { search } = location

  dispatch(actions.changeUrl({
    pathname: `${portalPathFromState(getState())}/search/granules`,
    search
  }))
}

export const viewCollectionDetails = collectionId => (dispatch, getState) => {
  dispatch(changeFocusedCollection(collectionId))

  const { router } = getState()
  const { location } = router
  const { search } = location

  dispatch(actions.changeUrl({
    pathname: `${portalPathFromState(getState())}/search/granules/collection-details`,
    search
  }))
}
