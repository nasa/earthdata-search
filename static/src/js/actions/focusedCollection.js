import actions from './index'
import { updateGranuleQuery } from './search'
import {
  CLEAR_COLLECTION_GRANULES,
  UPDATE_FOCUSED_COLLECTION
} from '../constants/actionTypes'
import { updateCollectionMetadata } from './collections'
import { updateAuthTokenFromHeaders } from './authToken'
import { createFocusedCollectionMetadata, getCollectionMetadata } from '../util/focusedCollection'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'
import { eventEmitter } from '../events/events'

export const updateFocusedCollection = payload => ({
  type: UPDATE_FOCUSED_COLLECTION,
  payload
})

export const clearCollectionGranules = () => ({
  type: CLEAR_COLLECTION_GRANULES
})

/**
 * Perform a collection request based on the focusedCollection from the store.
 */
export const getFocusedCollection = () => async (dispatch, getState) => {
  const {
    authToken,
    focusedCollection,
    metadata,
    query,
    searchResults
  } = getState()

  const { collections: collectionResults = {} } = searchResults

  const { byId: searchResultsById = {} } = collectionResults
  const focusedCollectionMetadata = searchResultsById[focusedCollection]

  const { is_cwic: isCwic = false } = focusedCollectionMetadata || {}
  const payload = [{
    [focusedCollection]: {
      isCwic,
      metadata: {
        ...focusedCollectionMetadata
      }
    }
  }]

  const { collection: collectionQuery } = query
  const { spatial = {} } = collectionQuery
  const { polygon } = spatial
  if (isCwic && polygon) {
    dispatch(actions.toggleSpatialPolygonWarning(true))
  } else {
    dispatch(actions.toggleSpatialPolygonWarning(false))
  }

  // Reset granule pageNum to 1 when focusedCollection is changing
  dispatch(updateGranuleQuery({ pageNum: 1 }))

  if (focusedCollection === '') {
    dispatch(updateCollectionMetadata([]))
    return null
  }

  dispatch(actions.collectionRelevancyMetrics())
  dispatch(updateCollectionMetadata(payload))

  const { collections } = metadata
  const { byId: fetchedCollections = {} } = collections
  const fetchedCollection = fetchedCollections[focusedCollection]
  const { granules = {}, metadata: fetchedCollectionMetadata = {} } = fetchedCollection || {}
  const { allIds: allGranuleIds = [] } = granules
  // If we already have the metadata for this focusedCollection, don't fetch it again
  if (Object.keys(fetchedCollectionMetadata).length) {
    // If granules are already loaded, don't make a new getGranules request
    if (allGranuleIds.length === 0) dispatch(actions.getGranules())
    return null
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
      dispatch(actions.getGranules())
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
