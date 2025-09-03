import VectorSource from 'ol/source/Vector'

import drawSpatialData from '../drawSpatialData'
import { eventEmitter } from '../../../events/events'
import { mapEventTypes } from '../../../constants/eventTypes'
import { ShapefileFile } from '../../../types/sharedTypes'

const mockGeoJSONInstance = {
  readFeatures: jest.fn(),
  readGeometry: jest.fn()
}

jest.mock('ol/format/GeoJSON', () => jest.fn(() => mockGeoJSONInstance))

jest.mock('../../../events/events', () => ({
  eventEmitter: {
    emit: jest.fn()
  }
}))

jest.mock('ol/proj', () => ({
  transform: jest.fn((coords) => coords),
  get: jest.fn(() => 'EPSG:4326')
}))

jest.mock('ol/geom/Polygon', () => ({
  __esModule: true,
  default: jest.fn(),
  circular: jest.fn(() => ({
    getType: jest.fn().mockReturnValue('Polygon'),
    getCoordinates: jest.fn().mockReturnValue([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]])
  }))
}))

jest.mock('../getQueryFromShapefileFeature', () => jest.fn(() => ({
  polygon: ['mock-polygon-coordinates']
})))

jest.mock('../crs', () => ({
  crsProjections: {
    'EPSG:4326': 'mock-geographic-projection',
    'EPSG:3413': 'mock-arctic-projection'
  }
}))

describe('drawSpatialData', () => {
  let vectorSource: VectorSource
  let mockFeature: {
    get: jest.Mock
    set: jest.Mock
    getGeometry: jest.Mock
    setGeometry: jest.Mock
    setStyle: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()

    vectorSource = new VectorSource()
    vectorSource.clear = jest.fn()
    vectorSource.addFeatures = jest.fn()
    vectorSource.getExtent = jest.fn().mockReturnValue([0, 0, 10, 10])
    vectorSource.getFeatures = jest.fn().mockReturnValue([])

    mockFeature = {
      get: jest.fn((key) => {
        if (key === 'edscId') return 'test-feature-id'

        return undefined
      }),
      set: jest.fn(),
      getGeometry: jest.fn().mockReturnValue({
        getType: jest.fn().mockReturnValue('Polygon'),
        getCoordinates: jest.fn().mockReturnValue([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]),
        clone: jest.fn().mockReturnThis(),
        transform: jest.fn().mockReturnThis()
      }),
      setGeometry: jest.fn(),
      setStyle: jest.fn()
    }

    mockGeoJSONInstance.readFeatures.mockReturnValue([mockFeature])
  })

  test('should clear vector source and return early if drawingNewLayer is not false', () => {
    const spatialData: ShapefileFile = {
      type: 'FeatureCollection' as const,
      name: 'NLP Spatial Area',
      features: []
    }

    drawSpatialData({
      drawingNewLayer: 'polygon',
      selectedFeatures: null,
      spatialData,
      onChangeQuery: jest.fn(),
      onChangeProjection: jest.fn(),
      onMetricsMap: jest.fn(),
      onUpdateShapefile: jest.fn(),
      projectionCode: 'epsg4326',
      spatialDataAdded: false,
      vectorSource
    })

    expect(vectorSource.clear).toHaveBeenCalled()
    expect(mockGeoJSONInstance.readFeatures).not.toHaveBeenCalled()
  })

  test('should process spatial data features correctly', () => {
    const spatialData: ShapefileFile = {
      type: 'FeatureCollection' as const,
      name: 'NLP Spatial Area',
      features: [{
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        },
        properties: {
          source: 'nlp',
          query: 'test query',
          edscId: 'test-feature-id'
        }
      }]
    }

    drawSpatialData({
      drawingNewLayer: false,
      selectedFeatures: null,
      spatialData,
      onChangeQuery: jest.fn(),
      onChangeProjection: jest.fn(),
      onMetricsMap: jest.fn(),
      onUpdateShapefile: jest.fn(),
      projectionCode: 'epsg4326',
      spatialDataAdded: false,
      vectorSource
    })

    expect(vectorSource.clear).toHaveBeenCalled()
    expect(mockGeoJSONInstance.readFeatures).toHaveBeenCalledWith(spatialData)
    expect(vectorSource.addFeatures).toHaveBeenCalledWith([mockFeature])
    expect(mockFeature.set).toHaveBeenCalledWith('isSpatialData', true)
    expect(mockFeature.set).toHaveBeenCalledWith('selected', false)
    expect(mockFeature.setStyle).toHaveBeenCalled()
  })

  test('should move map and emit metrics when spatial data is newly added', () => {
    jest.useFakeTimers()

    const spatialData: ShapefileFile = {
      type: 'FeatureCollection' as const,
      name: 'NLP Spatial Area',
      features: [{
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        },
        properties: {}
      }]
    }

    const mockOnMetricsMap = jest.fn()

    drawSpatialData({
      drawingNewLayer: false,
      selectedFeatures: null,
      spatialData,
      onChangeQuery: jest.fn(),
      onChangeProjection: jest.fn(),
      onMetricsMap: mockOnMetricsMap,
      onUpdateShapefile: jest.fn(),
      projectionCode: 'epsg4326',
      spatialDataAdded: true,
      vectorSource
    })

    expect(mockOnMetricsMap).toHaveBeenCalledWith('Added NLP Spatial Data')

    // Fast-forward timers to trigger the setTimeout
    jest.runAllTimers()

    expect(eventEmitter.emit).toHaveBeenCalledWith(mapEventTypes.MOVEMAP, {
      source: vectorSource
    })

    jest.useRealTimers()
  })

  test('should update query when there is a single feature with no selected features', () => {
    const spatialData: ShapefileFile = {
      type: 'FeatureCollection' as const,
      name: 'NLP Spatial Area',
      features: [{
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        },
        properties: {}
      }]
    }

    const mockOnChangeQuery = jest.fn()
    const mockOnUpdateShapefile = jest.fn()

    drawSpatialData({
      drawingNewLayer: false,
      selectedFeatures: null,
      spatialData,
      onChangeQuery: mockOnChangeQuery,
      onChangeProjection: jest.fn(),
      onMetricsMap: jest.fn(),
      onUpdateShapefile: mockOnUpdateShapefile,
      projectionCode: 'epsg4326',
      spatialDataAdded: false,
      vectorSource
    })

    expect(mockOnChangeQuery).toHaveBeenCalledWith({
      collection: {
        spatial: { polygon: ['mock-polygon-coordinates'] }
      }
    })

    expect(mockOnUpdateShapefile).toHaveBeenCalledWith({
      selectedFeatures: ['test-feature-id']
    })
  })

  test('should handle point geometries with radius correctly', () => {
    const pointFeature = {
      ...mockFeature,
      get: jest.fn((key) => {
        if (key === 'edscId') return 'point-feature-id'
        if (key === 'radius') return 1000

        return undefined
      }),
      getGeometry: jest.fn().mockReturnValue({
        getType: jest.fn().mockReturnValue('Point'),
        getCoordinates: jest.fn().mockReturnValue([0, 0]),
        clone: jest.fn().mockReturnThis(),
        transform: jest.fn().mockReturnThis()
      })
    }

    mockGeoJSONInstance.readFeatures.mockReturnValue([pointFeature])

    const spatialData: ShapefileFile = {
      type: 'FeatureCollection' as const,
      name: 'NLP Spatial Area',
      features: [{
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [0, 0]
        },
        properties: {
          radius: 1000
        }
      }]
    }

    drawSpatialData({
      drawingNewLayer: false,
      selectedFeatures: null,
      spatialData,
      onChangeQuery: jest.fn(),
      onChangeProjection: jest.fn(),
      onMetricsMap: jest.fn(),
      onUpdateShapefile: jest.fn(),
      projectionCode: 'epsg4326',
      spatialDataAdded: false,
      vectorSource
    })

    expect(pointFeature.set).toHaveBeenCalledWith('geometryType', 'Circle')
    expect(pointFeature.set).toHaveBeenCalledWith('circleGeometry', [[0, 0], 1000])
  })

  test('should return early if no features are found', () => {
    mockGeoJSONInstance.readFeatures.mockReturnValue([])

    const spatialData: ShapefileFile = {
      type: 'FeatureCollection' as const,
      name: 'NLP Spatial Area',
      features: []
    }

    drawSpatialData({
      drawingNewLayer: false,
      selectedFeatures: null,
      spatialData,
      onChangeQuery: jest.fn(),
      onChangeProjection: jest.fn(),
      onMetricsMap: jest.fn(),
      onUpdateShapefile: jest.fn(),
      projectionCode: 'epsg4326',
      spatialDataAdded: false,
      vectorSource
    })

    expect(vectorSource.clear).toHaveBeenCalled()
    expect(vectorSource.addFeatures).not.toHaveBeenCalled()
  })
})
