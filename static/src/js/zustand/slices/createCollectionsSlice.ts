import { CancelTokenSource, isCancel } from 'axios'
import {
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon
} from 'geojson'

import { booleanClockwise, simplify } from '@turf/turf'
import { CollectionsSlice, ImmerStateCreator } from '../types'
import { CollectionMetadata, ShapefileFile } from '../../types/sharedTypes'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

// @ts-expect-error There are no types for this file
import CollectionRequest from '../../util/request/collectionRequest'
// @ts-expect-error There are no types for this file
import NlpSearchRequest from '../../util/request/nlpSearchRequest'
// @ts-expect-error There are no types for this file
import { buildCollectionSearchParams, prepareCollectionParams } from '../../util/collections'
// @ts-expect-error There are no types for this file
import { convertNlpTemporalData } from '../../util/temporal/convertNlpTemporalData'
// @ts-expect-error There are no types for this file
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { MAX_POLYGON_SIZE } from '../../constants/spatialConstants'

type CoordinateGeometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon

const initialState = {
  count: 0,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  items: []
}

let cancelToken: CancelTokenSource
let nlpCancelToken: CancelTokenSource

/**
 * Simplifies NLP geometry if it has too many points using Turf.js
 * @param {CoordinateGeometry | null} geometry - GeoJSON geometry object to simplify
 * @returns {CoordinateGeometry | null} Simplified geometry or null if simplification failed
 */
const simplifyNlpGeometry = (geometry: CoordinateGeometry | null): CoordinateGeometry | null => {
  if (!geometry || !geometry.type) {
    return null
  }

  if (geometry.type === 'Point') {
    return geometry
  }

  const coords = geometry.coordinates
  if (!coords) return geometry

  const coordsToCheck = geometry.type === 'Polygon' ? coords[0] : coords
  const coordinateCount = Array.isArray(coordsToCheck) ? coordsToCheck.length : 0

  if (coordinateCount > MAX_POLYGON_SIZE) {
    let simplified = geometry
    let tolerance = 0.001

    // Try to simplify with increasing tolerance until we get under the max size
    for (let attempts = 0; attempts < 10; attempts += 1) {
      try {
        simplified = simplify(geometry, {
          tolerance,
          highQuality: false
        })

        const simplifiedCoords = simplified.type === 'Polygon'
          ? simplified.coordinates[0]
          : simplified.coordinates
        const simplifiedCount = Array.isArray(simplifiedCoords) ? simplifiedCoords.length : 0

        if (simplifiedCount <= MAX_POLYGON_SIZE || attempts === 9) {
          break
        }

        tolerance += 0.002
      } catch (error) {
        console.warn('Geometry simplification failed:', error)
        break
      }
    }

    // Fix polygon order if needed
    if (simplified.type === 'Polygon' && simplified.coordinates?.[0]?.length >= 4) {
      try {
        const isClockwise = booleanClockwise(simplified.coordinates[0])
        if (isClockwise) {
          simplified.coordinates[0].reverse()
        }
      } catch (error) {
        console.warn('Failed to check/fix polygon winding:', error)
      }
    }

    return simplified
  }

  return geometry
}

const createCollectionsSlice: ImmerStateCreator<CollectionsSlice> = (set, get) => ({
  collections: {
    collections: initialState,

    getCollections: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const earthdataEnvironment = getEarthdataEnvironment(get())

      // If cancel token is set, cancel the previous request(s)
      if (cancelToken) {
        cancelToken.cancel()
      }

      const collectionParams = prepareCollectionParams(reduxState)

      const {
        authToken,
        pageNum
      } = collectionParams

      if (pageNum === 1) {
        // If this is the first page, reset the items
        set((state) => {
          state.collections.collections.items = []
        })
      }

      const timerStart = Date.now()
      set((state) => {
        state.collections.collections.isLoading = true
      })

      reduxDispatch(actions.onFacetsLoading())

      const requestObject = new CollectionRequest(authToken, earthdataEnvironment)

      cancelToken = requestObject.getCancelToken()

      try {
        const response = await requestObject.search(buildCollectionSearchParams(collectionParams))

        const { data, headers } = response

        const cmrHits = parseInt(headers['cmr-hits'], 10)

        const { feed = {} } = data
        const {
          entry = [],
          facets = {}
        } = feed
        const { children = [] } = facets

        // Update the store with the new values
        set((state) => {
          state.collections.collections.count = cmrHits
          state.collections.collections.loadTime = Date.now() - timerStart
          state.collections.collections.isLoaded = true
          state.collections.collections.isLoading = false
          state.collections.collections.items = state.collections.collections.items.concat(entry)
        })

        reduxDispatch(actions.onFacetsLoaded({
          loaded: true
        }))

        reduxDispatch(actions.updateFacets({
          facets: children
        }))
      } catch (error) {
        if (isCancel(error)) return

        set((state) => {
          state.collections.collections.loadTime = Date.now() - timerStart
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false
        })

        reduxDispatch(actions.onFacetsErrored())

        reduxDispatch(actions.onFacetsLoaded({
          loaded: false
        }))

        reduxDispatch(actions.handleError({
          error,
          action: 'getCollections',
          resource: 'collections',
          requestObject
        }))
      }
    },

    setCollectionsLoading: (pageNum: number) => {
      set((state) => {
        state.collections.collections.isLoading = true
        if (pageNum === 1) {
          state.collections.collections.items = []
        }
      })
    },

    setCollectionsLoaded: (items: CollectionMetadata[], count: number, pageNum: number) => {
      set((state) => {
        state.collections.collections.isLoaded = true
        state.collections.collections.isLoading = false
        state.collections.collections.count = count
        if (pageNum === 1) {
          state.collections.collections.items = items
        } else {
          state.collections.collections.items = state.collections.collections.items.concat(items)
        }
      })
    },

    setCollectionsErrored: () => {
      set((state) => {
        state.collections.collections.isLoading = false
        state.collections.collections.isLoaded = false
      })
    },

    getNlpCollections: async (keyword: string) => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const earthdataEnvironment = getEarthdataEnvironment(get())

      // Mark NLP search as active immediately to prevent urlQuery from triggering traditional search
      set((state) => {
        state.query.nlpSearchCompleted = true
      })

      // If cancel token is set, cancel the previous request
      if (nlpCancelToken) {
        nlpCancelToken.cancel()
      }

      const { authToken } = reduxState
      const { pageNum } = get().query.collection

      set((state) => {
        state.collections.collections.isLoading = true
      })

      reduxDispatch(actions.onFacetsLoading())

      const requestObject = new NlpSearchRequest(authToken, earthdataEnvironment)
      const { defaultCmrPageSize } = getApplicationConfig()
      const searchParams = {
        q: keyword,
        pageNum,
        pageSize: defaultCmrPageSize
      }

      nlpCancelToken = requestObject.getCancelToken()

      try {
        const response = await requestObject.search(searchParams)
        const { data } = response
        const { metadata = {} } = data
        const { feed = {} } = metadata
        const { entry: collections = [] } = feed

        set((state) => {
          state.collections.collections.items = collections
          state.collections.collections.count = collections.length
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = true
        })

        // Extract spatial data from NLP queryInfo if available
        if (data.queryInfo && data.queryInfo.spatial) {
          const spatialData = data.queryInfo.spatial
          const actualGeometry = spatialData.geoJson || spatialData

          const simplifiedGeometry = simplifyNlpGeometry(actualGeometry)

          // Only create shapefile data if we have a valid geometry
          if (simplifiedGeometry) {
            const nlpSpatialData: ShapefileFile = {
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

            get().shapefile.updateShapefile({
              file: nlpSpatialData,
              shapefileName: 'NLP Spatial Area',
              selectedFeatures: ['0']
            })
          }
        }

        // Extract temporal data from NLP queryInfo if available
        let nlpTemporalData = {}
        if (data.queryInfo && data.queryInfo.temporal) {
          nlpTemporalData = convertNlpTemporalData(data.queryInfo.temporal)
        }

        // If NLP search returned temporal data, update the temporal query state
        if (nlpTemporalData && Object.keys(nlpTemporalData).length > 0) {
          set((state) => {
            state.query.collection.temporal = nlpTemporalData
          })
        }

        // Dispatch Redux actions for facets
        reduxDispatch(actions.updateFacets({
          facets: [],
          hits: collections.length,
          keyword,
          results: collections
        }))

        reduxDispatch(actions.onFacetsLoaded({
          loaded: true
        }))
      } catch (error) {
        if (isCancel(error)) return

        set((state) => {
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false
        })

        reduxDispatch(actions.onFacetsErrored())
        reduxDispatch(actions.onFacetsLoaded({
          loaded: false
        }))

        reduxDispatch(actions.handleError({
          error,
          action: 'getNlpCollections',
          resource: 'collections',
          requestObject
        }))
      }
    }
  }
})

export default createCollectionsSlice
