import { isCancel } from 'axios'
import { booleanClockwise, simplify } from '@turf/turf'

import NlpSearchRequest from '../util/request/nlpSearchRequest'
import { handleError } from './errors'
import { convertNlpTemporalData } from '../util/temporal/convertNlpTemporalData'
import { getApplicationConfig } from '../../../../sharedUtils/config'

import {
  ERRORED_FACETS,
  LOADED_FACETS,
  LOADING_FACETS,
  UPDATE_FACETS
} from '../constants/actionTypes'

import useEdscStore from '../zustand/useEdscStore'

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

  let numPoints = 0
  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach((ring) => {
      numPoints += ring.length
    })
  } else {
    numPoints = JSON.stringify(geometry.coordinates).split(',').length / 2
  }

  if (numPoints <= MAX_POLYGON_SIZE) {
    return geometry
  }

  let simplifiedGeometry = { ...geometry }
  let tolerance = 0.001
  let previousNumPoints = numPoints

  while (numPoints > MAX_POLYGON_SIZE) {
    const simplified = simplify(simplifiedGeometry, {
      tolerance: tolerance += 0.002,
      highQuality: true
    })

    // Ensure counter-clockwise orientation for polygons
    if (simplified.type === 'Polygon' && simplified.coordinates[0]) {
      if (booleanClockwise(simplified.coordinates[0])) {
        simplified.coordinates[0] = simplified.coordinates[0].reverse()
      }
    }

    simplifiedGeometry = simplified

    if (simplified.type === 'Polygon') {
      numPoints = simplified.coordinates.reduce((acc, ring) => acc + ring.length, 0)
    } else {
      numPoints = JSON.stringify(simplified.coordinates).split(',').length / 2
    }

    if (numPoints === previousNumPoints) {
      // If the number of points hasn't changed, break out of the loop
      break
    }

    previousNumPoints = numPoints
  }

  return simplifiedGeometry
}

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

  // Mark NLP search as active immediately to prevent urlQuery from triggering traditional search
  useEdscStore.getState().query.setNlpSearchCompleted(true)

  // If cancel token is set, cancel the previous request
  if (cancelToken) {
    cancelToken.cancel()
  }

  const { authToken } = reduxState
  const { pageNum } = zustandState.query.collection

  useEdscStore.getState().collections.setCollectionsLoading(pageNum)

  dispatch(onFacetsLoading())

  const requestObject = new NlpSearchRequest(authToken)
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

        // If NLP search returned spatial data, add it to the spatial data system and
        // convert NLP GeoJSON to FeatureCollection format that spatial data system expects
        if (data.queryInfo && data.queryInfo.spatial) {
          const spatialData = data.queryInfo.spatial
          const actualGeometry = spatialData.geoJson || spatialData

          const simplifiedGeometry = simplifyNlpGeometry(actualGeometry)

          // Only create shapefile data if we have a valid geometry
          if (simplifiedGeometry) {
            const nlpSpatialData = {
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

            useEdscStore.getState().shapefile.updateShapefile({
              file: nlpSpatialData,
              shapefileName: 'NLP Spatial Area',
              selectedFeatures: ['0']
            })
          } else {
            console.warn('NLP spatial geometry is invalid, skipping shapefile update')
          }
        }

        // Extract temporal data from NLP queryInfo if available
        if (data.queryInfo && data.queryInfo.temporal) {
          nlpTemporalData = convertNlpTemporalData(data.queryInfo.temporal)
        }
      }

      useEdscStore.getState().collections.setCollectionsLoaded(entry, hits, pageNum)

      dispatch(onFacetsLoaded({
        loaded: true
      }))

      dispatch(updateFacets({
        facets,
        hits,
        keyword,
        results: entry
      }))

      // If NLP search returned temporal data, update the temporal query state
      if (nlpTemporalData) {
        useEdscStore.getState().query.changeQuery({
          collection: {
            temporal: nlpTemporalData
          },
          skipCollectionSearch: true
        })
      }
    })
    .catch((error) => {
      if (isCancel(error)) return

      // Clear NLP search flag on error so traditional search can run
      useEdscStore.getState().query.clearNlpSearchCompleted()
      useEdscStore.getState().collections.setCollectionsErrored()

      dispatch(onFacetsErrored())

      handleError({
        error,
        action: 'fetchNlpCollections',
        resource: 'collections',
        requestObject
      })
    })

  return response
}
