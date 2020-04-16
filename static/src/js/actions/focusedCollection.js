import actions from './index'
import { updateGranuleQuery } from './search'
import {
  CLEAR_COLLECTION_GRANULES,
  UPDATE_FOCUSED_COLLECTION
} from '../constants/actionTypes'
import { createFocusedCollectionMetadata, getCollectionMetadata } from '../util/focusedCollection'
import { eventEmitter } from '../events/events'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { updateCollectionMetadata } from './collections'
import { updateAuthTokenFromHeaders } from './authToken'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'

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
  const { defaultCmrSearchTags } = getApplicationConfig()

  const {
    authToken,
    focusedCollection,
    metadata,
    query
  } = getState()


  const { collections: collectionResults = {} } = metadata

  const { byId: searchResultsById = {} } = collectionResults
  const { [focusedCollection]: focusedCollectionMetadata } = searchResultsById
  const { is_cwic: isCwic = false } = focusedCollectionMetadata || {}

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

  const { collections } = metadata
  const { byId: fetchedCollections = {} } = collections
  const { [focusedCollection]: fetchedCollection } = fetchedCollections
  const { granules = {}, metadata: fetchedCollectionMetadata = {} } = fetchedCollection || {}
  const { allIds: allGranuleIds = [] } = granules

  // If we already have the metadata for this focusedCollection, don't fetch it again
  if (Object.keys(fetchedCollectionMetadata).length) {
    // If granules are already loaded, don't make a new getGranules request
    if (allGranuleIds.length === 0) {
      dispatch(actions.getGranules())
    }

    return null
  }

  const response = getCollectionMetadata({
    concept_id: [focusedCollection],
    includeTags: defaultCmrSearchTags.join(','),
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
      dispatch(actions.handleError({
        error,
        action: 'getFocusedCollection',
        resource: 'collection'
      }))
    })

  return response
}

/**
 * Change the focusedCollection, and get the focusedCollection metadata.
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
