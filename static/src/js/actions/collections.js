import { isCancel } from 'axios'

import CollectionRequest from '../util/request/collectionRequest'
import NlpSearchRequest from '../util/request/nlpSearchRequest'
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

  // Check if this search originated from the landing page (should use NLP)
  const { searchSource } = useEdscStore.getState().query
  const useNlpSearch = searchSource === 'landing'
  
  let requestObject
  let searchParams
  
  if (useNlpSearch) {
    // Use NLP search for semantic search (landing page initiated searches only)
    console.log('🔍 Using NLP search for collections (source: landing page)')
    requestObject = new NlpSearchRequest(authToken, earthdataEnvironment)
    // For NLP search, we only need the keyword query
    searchParams = { q: keyword }
  } else {
    // Use regular CMR search for all other scenarios
    console.log(`🔍 Using regular CMR search for collections (source: ${searchSource})`)
    requestObject = new CollectionRequest(authToken, earthdataEnvironment)
    searchParams = buildCollectionSearchParams(collectionParams)
  }
  
  cancelToken = requestObject.getCancelToken()

  const response = requestObject.search(searchParams)
    .then((responseObject) => {
      const { data, headers } = responseObject
      
      console.log('🔍 Raw response object:', responseObject)

      let entry = []
      let facets = []
      let hits = 0

      if (useNlpSearch) {
        // Handle NLP response format
        console.log('🔍 Processing NLP response format')
        
        // NLP response structure: data.metadata.feed.entry
        if (data && data.metadata && data.metadata.feed && data.metadata.feed.entry) {
          entry = data.metadata.feed.entry
          hits = entry.length // NLP doesn't return total hits, use current page count
          facets = [] // NLP doesn't return facets
          console.log(`🔍 NLP found ${entry.length} collections`)
        } else {
          console.warn('🔍 Unexpected NLP response structure:', data)
        }
      } else {
        // Handle regular CMR response format
        console.log('🔍 Processing regular CMR response format')
        
        const cmrHits = parseInt(headers['cmr-hits'], 10)
        const { feed = {} } = data
        const {
          entry: cmrEntry = [],
          facets: cmrFacets = {}
        } = feed
        const { children = [] } = cmrFacets

        entry = cmrEntry
        facets = children
        hits = cmrHits
      }

      const payload = {
        facets,
        hits,
        keyword,
        results: entry
      }

      // Reset searchSource after successful NLP search to ensure subsequent searches use CMR
      if (useNlpSearch) {
        console.log('🔍 Resetting searchSource to "direct" after successful NLP search')
        // Directly update the searchSource in the store without triggering another getCollections call
        useEdscStore.setState((state) => {
          state.query.searchSource = 'direct'
        })
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
