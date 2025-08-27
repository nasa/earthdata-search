import { isCancel } from 'axios'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import { booleanClockwise, simplify } from '@turf/turf'

import NlpSearchRequest from '../util/request/nlpSearchRequest'
import { handleError } from './errors'
import { convertNlpTemporalData } from '../util/temporal/convertNlpTemporalData'
import { eventEmitter } from '../events/events'
import { mapEventTypes } from '../constants/eventTypes'
import { getApplicationConfig } from '../../../../sharedUtils/config'

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

const MAX_POLYGON_SIZE = 50

/**
 * Simplifies NLP geometry if it has too many points using Turf.js
 * @param {Object} geometry - GeoJSON geometry object to simplify
 * @returns {Object} - Simplified GeoJSON geometry
 */
const simplifyNlpGeometry = (geometry) => {
  if (!geometry || !geometry.coordinates || geometry.type === 'Point') {
    return geometry
  }

  // Count coordinate points - each coordinate pair is [lng, lat]
  let numPoints = 0
  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach((ring) => {
      numPoints += ring.length
    })
  } else {
    // For other geometry types, approximate by JSON string length
    numPoints = JSON.stringify(geometry.coordinates).split(',').length / 2
  }

  // If under the limit, return as-is
  if (numPoints <= MAX_POLYGON_SIZE) {
    return geometry
  }

  // Apply iterative simplification with increasing tolerance
  let simplifiedGeometry = { ...geometry }
  let tolerance = 0.001
  let previousNumPoints = numPoints

  while (numPoints > MAX_POLYGON_SIZE) {
    const simplified = simplify(simplifiedGeometry, {
      tolerance: tolerance += 0.002,
      highQuality: true
    })

    // Ensure counter-clockwise orientation for polygons (matches drawShapefile.ts)
    if (simplified.type === 'Polygon' && simplified.coordinates[0]) {
      if (booleanClockwise(simplified.coordinates[0])) {
        simplified.coordinates[0] = simplified.coordinates[0].reverse()
      }
    }

    simplifiedGeometry = simplified

    // Recount points in simplified geometry
    if (simplified.type === 'Polygon') {
      numPoints = simplified.coordinates.reduce((acc, ring) => acc + ring.length, 0)
    } else {
      numPoints = JSON.stringify(simplified.coordinates).split(',').length / 2
    }

    // Prevent infinite loops
    if (numPoints === previousNumPoints) break
    previousNumPoints = numPoints
  }

  return simplifiedGeometry
}

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
 * Perform an NLP collections request with the provided keyword.
 * @param {string} keyword - The search keyword to use for the NLP search.
 * @param {Function} dispatch - A dispatch function provided by redux.
 * @param {Function} getState - A function that returns the current state provided by redux.
 */
export const getNlpCollections = (keyword) => (dispatch, getState) => {
  const reduxState = getState()
  const zustandState = useEdscStore.getState()

  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  // Mark NLP search as active immediately to prevent urlQuery from triggering traditional search
  useEdscStore.getState().query.setNlpSearchCompleted(true)

  // If cancel token is set, cancel the previous request
  if (cancelToken) {
    cancelToken.cancel()
  }

  const { authToken } = reduxState
  const { pageNum } = zustandState.query.collection

  if (pageNum === 1) {
    const emptyPayload = {
      results: []
    }
    dispatch(updateCollectionResults(emptyPayload))
  }

  dispatch(onCollectionsLoading())
  dispatch(onFacetsLoading())
  dispatch(startCollectionsTimer())

  const requestObject = new NlpSearchRequest(authToken, earthdataEnvironment)
  const { defaultCmrPageSize } = getApplicationConfig()
  const searchParams = {
    q: keyword,
    pageNum,
    pageSize: defaultCmrPageSize
  }

  cancelToken = requestObject.getCancelToken()

  const response = requestObject.search(searchParams)
    .then((responseObject) => {
      const { data } = responseObject

      let entry = []
      let facets = []
      let hits = 0
      let nlpTemporalData = null

      if (data && data.metadata && data.metadata.feed && data.metadata.feed.entry) {
        entry = data.metadata.feed.entry
        hits = entry.length
        facets = []

        // If NLP search returned spatial data, add it to the shapefile system and
        // convert NLP GeoJSON to FeatureCollection format that shapefile system expects
        if (data.queryInfo && data.queryInfo.spatial) {
          // Simplify the geometry early to reduce storage and improve performance
          const simplifiedGeometry = simplifyNlpGeometry(data.queryInfo.spatial)

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
              geometry: simplifiedGeometry
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
              selectedFeatures: ['0']
            }
          }))

          // Pan map to NLP spatial area (same as shapefile upload behavior)
          setTimeout(() => {
            // Create vector source from NLP spatial data to trigger map movement
            const vectorSource = new VectorSource()
            const features = new GeoJSON().readFeatures(nlpShapefileData)
            vectorSource.addFeatures(features)

            // Emit MOVEMAP event to pan and zoom map to spatial area
            eventEmitter.emit(mapEventTypes.MOVEMAP, {
              source: vectorSource
            })
          }, 0)
        }

        // Extract temporal data from NLP queryInfo if available
        if (data.queryInfo && data.queryInfo.temporal) {
          nlpTemporalData = convertNlpTemporalData(data.queryInfo.temporal)
        }
      }

      const payload = {
        facets,
        hits,
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

      // If NLP search returned temporal data, update the temporal query state
      if (nlpTemporalData) {
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

      // Clear NLP search flag on error so traditional search can run
      useEdscStore.getState().query.clearNlpSearchCompleted()

      dispatch(onCollectionsErrored())
      dispatch(onFacetsErrored())
      dispatch(finishCollectionsTimer())

      handleError({
        error,
        action: 'fetchNlpCollections',
        resource: 'collections',
        requestObject
      })
    })

  return response
}
