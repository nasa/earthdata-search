import { isCancel } from 'axios'

import CollectionRequest from '../util/request/collectionRequest'
import {
  buildCollectionSearchParams,
  prepareCollectionParams
} from '../util/collections'
import { updateAuthTokenFromHeaders } from './authToken'
import { handleError } from './errors'

import {
  ADD_COLLECTION_SEARCH_METADATA,
  ADD_MORE_COLLECTION_RESULTS,
  ERRORED_COLLECTIONS,
  ERRORED_FACETS,
  FINISHED_COLLECTIONS_TIMER,
  LOADED_COLLECTIONS,
  LOADED_FACETS,
  LOADING_COLLECTIONS,
  LOADING_FACETS,
  STARTED_COLLECTIONS_TIMER,
  UPDATE_GRANULE_SEARCH_QUERY,
  UPDATE_COLLECTION_METADATA,
  UPDATE_COLLECTION_RESULTS,
  UPDATE_FACETS
} from '../constants/actionTypes'

import { getFocusedCollectionId } from '../selectors/focusedCollection'

export const addMoreCollectionResults = payload => ({
  type: ADD_MORE_COLLECTION_RESULTS,
  payload
})

export const addCollectionSearchMetadata = payload => ({
  type: ADD_COLLECTION_SEARCH_METADATA,
  payload
})

export const updateCollectionResults = payload => ({
  type: UPDATE_COLLECTION_RESULTS,
  payload
})

export const updateCollectionMetadata = payload => ({
  type: UPDATE_COLLECTION_METADATA,
  payload
})

export const onCollectionsLoading = () => ({
  type: LOADING_COLLECTIONS
})

export const onCollectionsLoaded = payload => ({
  type: LOADED_COLLECTIONS,
  payload
})

export const onCollectionsErrored = () => ({
  type: ERRORED_COLLECTIONS
})

export const updateFacets = payload => ({
  type: UPDATE_FACETS,
  payload
})

export const onFacetsLoading = () => ({
  type: LOADING_FACETS
})

export const onFacetsLoaded = payload => ({
  type: LOADED_FACETS,
  payload
})

export const onFacetsErrored = () => ({
  type: ERRORED_FACETS
})

export const startCollectionsTimer = () => ({
  type: STARTED_COLLECTIONS_TIMER
})

export const finishCollectionsTimer = () => ({
  type: FINISHED_COLLECTIONS_TIMER
})

/**
 * Update the granule filters for the collection. Here we prune off any values that are not truthy,
 * as well as any objects that contain only falsy values.
 * @param {String} id - The id for the collection to update.
 * @param {Object} granuleFilters - An object containing the flags to apply as granuleFilters.
 */
export const updateFocusedCollectionGranuleFilters = granuleFilters => (dispatch, getState) => {
  const state = getState()

  // const granuleQuery = getFocusedCollectionGranuleQuery(state)
  const focusedCollectionId = getFocusedCollectionId(state)

  dispatch({
    type: UPDATE_GRANULE_SEARCH_QUERY,
    payload: {
      collectionId: focusedCollectionId,
      ...granuleFilters
    }
  })
}

// Cancel token to cancel pending requests
let cancelToken

/**
 * Perform a collections request based on the current redux state.
 * @param {Function} dispatch - A dispatch function provided by redux.
 * @param {Function} getState - A function that returns the current state provided by redux.
 */
export const getCollections = () => (dispatch, getState) => {
  // If cancel token is set, cancel the previous request(s)
  if (cancelToken) {
    cancelToken.cancel()
  }

  const collectionParams = prepareCollectionParams(getState())

  const {
    authToken,
    keyword,
    pageNum
  } = collectionParams

  if (pageNum === 1) {
    const emptyPayload = {
      results: []
    }
    dispatch(updateCollectionResults(emptyPayload))
  }

  dispatch(onCollectionsLoading())
  dispatch(onFacetsLoading())
  dispatch(startCollectionsTimer())

  const requestObject = new CollectionRequest(authToken)
  cancelToken = requestObject.getCancelToken()

  const response = requestObject.search(buildCollectionSearchParams(collectionParams))
    .then((response) => {
      const payload = {}

      const { data, headers } = response

      const cmrHits = parseInt(response.headers['cmr-hits'], 10)

      const { feed = {} } = data
      const { facets = {} } = feed
      const { children = [] } = facets

      payload.facets = children
      payload.hits = cmrHits
      payload.keyword = keyword

      const { entry = [] } = feed
      payload.results = entry

      dispatch(finishCollectionsTimer())
      dispatch(updateAuthTokenFromHeaders(headers))
      dispatch(addCollectionSearchMetadata(entry))

      if (pageNum === 1) {
        dispatch(updateCollectionResults(payload))
      } else {
        dispatch(addMoreCollectionResults(payload))
      }

      dispatch(onCollectionsLoaded({
        loaded: true
      }))

      dispatch(onFacetsLoaded({
        loaded: true
      }))

      dispatch(updateFacets(payload))
    })
    .catch((error) => {
      if (isCancel(error)) return

      dispatch(finishCollectionsTimer())
      dispatch(onCollectionsErrored())
      dispatch(onFacetsErrored())
      dispatch(onCollectionsLoaded({
        loaded: false
      }))
      dispatch(onFacetsLoaded({
        loaded: false
      }))
      dispatch(handleError({
        error,
        action: 'getCollections',
        resource: 'collections',
        requestObject
      }))
    })

  return response
}
