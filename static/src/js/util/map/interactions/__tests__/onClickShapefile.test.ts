import { Map, Feature } from 'ol'
import VectorSource from 'ol/source/Vector'
import { Style } from 'ol/style'
import onClickShapefile from '../onClickShapefile'
import findShapefileFeature from '../findShapefileFeature'
import getQueryFromShapefileFeature from '../../getQueryFromShapefileFeature'
import spatialTypes from '../../../../constants/spatialTypes'
import { Query, SpatialSearch } from '../../../../types/sharedTypes'
import { ShapefileSlice } from '../../../../zustand/types'

jest.mock('../findShapefileFeature')
jest.mock('../../getQueryFromShapefileFeature')

const mockFindShapefileFeature = jest.mocked(findShapefileFeature)
const mockGetQueryFromShapefileFeature = jest.mocked(getQueryFromShapefileFeature)

interface MockFeature {
  getProperties(): { geometryType: string; selected: boolean }
  get(key: string): string | boolean | undefined
  set(key: string, value: string | boolean): void
  setStyle(style: Style | Style[]): void
}

const createMockFeature = (
  geometryType: string,
  selected: boolean,
  edscId: string
): MockFeature => ({
  getProperties: () => ({
    geometryType,
    selected
  }),
  get: (key: string) => {
    if (key === 'edscId') return edscId
    if (key === 'geometryType') return geometryType
    if (key === 'selected') return selected

    return undefined
  },
  set: jest.fn(),
  setStyle: jest.fn()
})

const callOnClickShapefile = (
  feature: MockFeature,
  coordinate: number[],
  map: Partial<Map>,
  onChangeQuery: jest.Mock<void, [Query]>,
  onUpdateShapefile: jest.Mock<void, [Partial<ShapefileSlice['shapefile']>]>,
  shapefile: Partial<ShapefileSlice['shapefile']>,
  spatialDrawingSource: Partial<VectorSource>,
  spatialSearch: Partial<SpatialSearch>
) => {
  mockFindShapefileFeature.mockReturnValue(feature as unknown as Feature)

  return onClickShapefile({
    coordinate,
    map: map as Map,
    onChangeQuery,
    onUpdateShapefile,
    shapefile: shapefile as ShapefileSlice['shapefile'],
    spatialDrawingSource: spatialDrawingSource as VectorSource,
    spatialSearch: spatialSearch as SpatialSearch
  })
}

describe('onClickShapefile', () => {
  let mockMap: Partial<Map>
  let mockOnChangeQuery: jest.Mock<void, [Query]>
  let mockOnUpdateShapefile: jest.Mock<void, [Partial<ShapefileSlice['shapefile']>]>
  let mockSpatialDrawingSource: Partial<VectorSource>
  let mockShapefile: Partial<ShapefileSlice['shapefile']>
  let mockSpatialSearch: Partial<SpatialSearch>

  beforeEach(() => {
    mockMap = {}
    mockOnChangeQuery = jest.fn()
    mockOnUpdateShapefile = jest.fn()
    mockSpatialDrawingSource = {}

    mockShapefile = {
      selectedFeatures: []
    }

    mockSpatialSearch = {
      boundingBoxSearch: [],
      circleSearch: [],
      lineSearch: [],
      pointSearch: [],
      polygonSearch: []
    }
  })

  test('deselects a selected feature', () => {
    const mockFeature = createMockFeature(spatialTypes.POINT, true, 'point-1')
    mockGetQueryFromShapefileFeature.mockReturnValue({ point: ['0,0'] })
    mockShapefile.selectedFeatures = ['point-1']
    mockSpatialSearch.pointSearch = ['0,0']

    callOnClickShapefile(
      mockFeature,
      [0, 0],
      mockMap,
      mockOnChangeQuery,
      mockOnUpdateShapefile,
      mockShapefile,
      mockSpatialDrawingSource,
      mockSpatialSearch
    )

    expect(mockFeature.set).toHaveBeenCalledWith('selected', false)
    expect(mockOnChangeQuery).toHaveBeenCalled()
  })

  test('handles multi-point styling', () => {
    const mockFeature = createMockFeature(spatialTypes.MULTI_POINT, false, 'multipoint-1')
    mockGetQueryFromShapefileFeature.mockReturnValue({ point: ['0,0', '1,1'] })

    callOnClickShapefile(
      mockFeature,
      [0, 0],
      mockMap,
      mockOnChangeQuery,
      mockOnUpdateShapefile,
      mockShapefile,
      mockSpatialDrawingSource,
      mockSpatialSearch
    )

    expect(mockFeature.setStyle).toHaveBeenCalled()
  })

  test('returns early when no feature found', () => {
    mockFindShapefileFeature.mockReturnValue(false)

    onClickShapefile({
      coordinate: [0, 0],
      map: mockMap as Map,
      onChangeQuery: mockOnChangeQuery,
      onUpdateShapefile: mockOnUpdateShapefile,
      shapefile: mockShapefile as ShapefileSlice['shapefile'],
      spatialDrawingSource: mockSpatialDrawingSource as VectorSource,
      spatialSearch: mockSpatialSearch as SpatialSearch
    })

    expect(mockOnChangeQuery).not.toHaveBeenCalled()
    expect(mockOnUpdateShapefile).not.toHaveBeenCalled()
  })

  test('handles undefined selectedFeatures when removing', () => {
    const mockFeature = createMockFeature(spatialTypes.POINT, true, 'point-1')
    mockGetQueryFromShapefileFeature.mockReturnValue({ point: ['0,0'] })
    mockShapefile.selectedFeatures = undefined
    mockSpatialSearch.pointSearch = undefined

    callOnClickShapefile(
      mockFeature,
      [0, 0],
      mockMap,
      mockOnChangeQuery,
      mockOnUpdateShapefile,
      mockShapefile,
      mockSpatialDrawingSource,
      mockSpatialSearch
    )

    expect(mockFeature.set).toHaveBeenCalledWith('selected', false)
  })

  test('handles edge cases for undefined values', () => {
    const mockFeature = createMockFeature(spatialTypes.POLYGON, false, 'polygon-1')
    mockGetQueryFromShapefileFeature.mockReturnValue({ polygon: undefined })
    mockSpatialSearch.polygonSearch = undefined

    callOnClickShapefile(
      mockFeature,
      [0, 0],
      mockMap,
      mockOnChangeQuery,
      mockOnUpdateShapefile,
      mockShapefile,
      mockSpatialDrawingSource,
      mockSpatialSearch
    )

    expect(mockFeature.setStyle).toHaveBeenCalled()
    expect(mockOnChangeQuery).toHaveBeenCalled()
  })

  test('deselects a polygon feature', () => {
    const mockFeature = createMockFeature(spatialTypes.POLYGON, true, 'polygon-1')
    mockGetQueryFromShapefileFeature.mockReturnValue({ polygon: ['0,0,1,0,1,1,0,1,0,0'] })
    mockShapefile.selectedFeatures = ['polygon-1']
    mockSpatialSearch.polygonSearch = ['0,0,1,0,1,1,0,1,0,0']

    callOnClickShapefile(
      mockFeature,
      [0, 0],
      mockMap,
      mockOnChangeQuery,
      mockOnUpdateShapefile,
      mockShapefile,
      mockSpatialDrawingSource,
      mockSpatialSearch
    )

    expect(mockFeature.set).toHaveBeenCalledWith('selected', false)
    expect(mockFeature.setStyle).toHaveBeenCalled()
  })
})
