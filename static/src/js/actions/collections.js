import { isCancel } from 'axios'

import CollectionRequest from '../util/request/collectionRequest'
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import { handleError } from './errors'

import {
  ADD_MORE_COLLECTION_RESULTS,
  ERRORED_COLLECTIONS,
  ERRORED_FACETS,
  FINISHED_COLLECTIONS_TIMER,
  LOADED_COLLECTIONS,
  LOADED_FACETS,
  LOADING_COLLECTIONS,
  LOADING_FACETS,
  STARTED_COLLECTIONS_TIMER,
  UPDATE_COLLECTION_METADATA,
  UPDATE_COLLECTION_RESULTS,
  UPDATE_FACETS
} from '../constants/actionTypes'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

export const addMoreCollectionResults = (payload) => ({
  type: ADD_MORE_COLLECTION_RESULTS,
  payload
})

export const updateCollectionResults = (payload) => ({
  type: UPDATE_COLLECTION_RESULTS,
  payload
})

export const updateCollectionMetadata = (payload) => ({
  type: UPDATE_COLLECTION_METADATA,
  payload
})

export const onCollectionsLoading = () => ({
  type: LOADING_COLLECTIONS
})

export const onCollectionsLoaded = (payload) => ({
  type: LOADED_COLLECTIONS,
  payload
})

export const onCollectionsErrored = () => ({
  type: ERRORED_COLLECTIONS
})

export const updateFacets = (payload) => ({
  type: UPDATE_FACETS,
  payload
})

export const onFacetsLoading = () => ({
  type: LOADING_FACETS
})

export const onFacetsLoaded = (payload) => ({
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

// Cancel token to cancel pending requests
let cancelToken

/**
 * Perform a collections request based on the current redux state.
 * @param {Function} dispatch - A dispatch function provided by redux.
 * @param {Function} getState - A function that returns the current state provided by redux.
 */
export const getCollections = () => (dispatch, getState) => {
  const state = getState()

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  // If cancel token is set, cancel the previous request(s)
  if (cancelToken) {
    cancelToken.cancel()
  }

  const collectionParams = prepareCollectionParams(state)

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

  const requestObject = new CollectionRequest(authToken, earthdataEnvironment)
  cancelToken = requestObject.getCancelToken()

  const response = requestObject.search(buildCollectionSearchParams(collectionParams))
    .then((responseObject) => {
      const { data, headers } = responseObject

      const cmrHits = parseInt(headers['cmr-hits'], 10)

      const { feed = {} } = data
      const {
        entry = [],
        facets = {}
      } = feed
      const { children = [] } = facets

      const payload = {
        facets: children,
        hits: cmrHits,
        keyword,
        results: entry
      }

      dispatch(finishCollectionsTimer())

      dispatch(onCollectionsLoaded({
        loaded: true
      }))

      dispatch(updateCollectionMetadata(entry))

      if (pageNum === 1) {
        dispatch(updateCollectionResults(payload))
      } else {
        dispatch(addMoreCollectionResults(payload))
      }

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
