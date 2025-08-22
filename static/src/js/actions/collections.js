import { isCancel } from 'axios'

import CollectionRequest from '../util/request/collectionRequest'
import NlpSearchRequest from '../util/request/nlpSearchRequest'
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import { handleError } from './errors'
import { convertNlpTemporalData } from '../util/temporal/convertNlpTemporalData'

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
    requestObject = new NlpSearchRequest(authToken, earthdataEnvironment)
    // For NLP search, we only need the keyword query
    searchParams = { q: keyword }
  } else {
    // Use regular CMR search for all other scenarios
    requestObject = new CollectionRequest(authToken, earthdataEnvironment)
    searchParams = buildCollectionSearchParams(collectionParams)
  }

  cancelToken = requestObject.getCancelToken()

  const response = requestObject.search(searchParams)
    .then((responseObject) => {
      const { data, headers } = responseObject

      let entry = []
      let facets = []
      let hits = 0
      let nlpTemporalData = null

      if (useNlpSearch) {
        // NLP response structure: data.metadata.feed.entry
        if (data && data.metadata && data.metadata.feed && data.metadata.feed.entry) {
          entry = data.metadata.feed.entry
          hits = entry.length
          facets = []

          // If NLP search returned spatial data, add it to the shapefile system
          if (data.queryInfo && data.queryInfo.spatial) {
            // Convert NLP GeoJSON to FeatureCollection format that shapefile system expects
            const nlpShapefileData = {
              type: 'FeatureCollection',
              name: 'NLP Extracted Spatial Area',
              features: [{
                type: 'Feature',
                properties: {
                  source: 'nlp',
                  query: keyword,
                  edscId: '0'
                },
                geometry: data.queryInfo.spatial
              }]
            }

            // Update the shapefile store with NLP spatial data
            useEdscStore.setState((storeState) => ({
              ...storeState,
              shapefile: {
                ...storeState.shapefile,
                file: nlpShapefileData,
                isLoaded: true,
                isLoading: false,
                isErrored: false,
                shapefileName: 'NLP Spatial Area',
                selectedFeatures: ['0'] // Select the first (and only) feature
              }
            }))
          }

          // Extract temporal data from NLP queryInfo if available
          if (data.queryInfo && data.queryInfo.temporal) {
            nlpTemporalData = convertNlpTemporalData(data.queryInfo.temporal)
          }
        }
      } else {
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
        // Directly update the searchSource in the store without triggering another getCollections call
        useEdscStore.setState((storeState) => ({
          ...storeState,
          query: {
            ...storeState.query,
            searchSource: 'direct'
          }
        }))
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


      // If NLP search returned temporal data, update the temporal query state
      if (useNlpSearch && nlpTemporalData) {
        useEdscStore.setState((storeState) => ({
          ...storeState,
          query: {
            ...storeState.query,
            collection: {
              ...storeState.query.collection,
              temporal: {
                ...storeState.query.collection.temporal,
                ...nlpTemporalData
              }
            }
          }
        }))
      }
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
