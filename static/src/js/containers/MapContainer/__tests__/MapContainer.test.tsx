import React from 'react'

// @ts-expect-error The file does not have types
import actions from '../../../actions'

import { mapDispatchToProps, mapStateToProps } from '../MapContainer'

// @ts-expect-error The file does not have types
import * as metricsMap from '../../../middleware/metrics/actions'

// Mock Map because openlayers causes errors
jest.mock('../../../components/Map/Map', () => <div />)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onChangeFocusedGranule calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onChangeFocusedGranule('granuleId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('granuleId')
  })

  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onClearShapefile calls actions.clearShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearShapefile')

    mapDispatchToProps(dispatch).onClearShapefile()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })

  test('onExcludeGranule calls actions.excludeGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'excludeGranule')

    mapDispatchToProps(dispatch).onExcludeGranule({
      collectionId: 'collectionId',
      granuleId: 'granuleId'
    })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      granuleId: 'granuleId'
    })
  })

  test('onFetchShapefile calls actions.fetchShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchShapefile')

    mapDispatchToProps(dispatch).onFetchShapefile('shapefileId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('shapefileId')
  })

  test('onMetricsMap calls metricsMap', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsMap, 'metricsMap')

    mapDispatchToProps(dispatch).onMetricsMap('mockType')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mockType')
  })

  test('onToggleDrawingNewLayer calls actions.toggleDrawingNewLayer', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleDrawingNewLayer')

    mapDispatchToProps(dispatch).onToggleDrawingNewLayer('point')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('point')
  })

  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

  test('onToggleTooManyPointsModal calls actions.toggleTooManyPointsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleTooManyPointsModal')

    mapDispatchToProps(dispatch).onToggleTooManyPointsModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

  test('onUpdateShapefile calls actions.updateShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateShapefile')

    mapDispatchToProps(dispatch).onUpdateShapefile({ selectedFeatures: ['1'] })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ selectedFeatures: ['1'] })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      advancedSearch: {},
      metadata: {
        collections: {},
        colormaps: {}
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      project: {},
      query: {
        collection: {
          spatial: {}
        }
      },
      router: {},
      shapefile: {},
      ui: {
        map: {
          drawingNewLayer: false
        },
        spatialPolygonWarning: {
          isDisplayed: false
        }
      }
    }

    const expectedState = {
      advancedSearch: {},
      boundingBoxSearch: undefined,
      circleSearch: undefined,
      collectionsMetadata: {},
      colormapsMetadata: {},
      displaySpatialPolygonWarning: false,
      drawingNewLayer: false,
      focusedCollectionId: 'collectionId',
      focusedGranuleId: 'granuleId',
      granuleSearchResults: {},
      granulesMetadata: {},
      lineSearch: undefined,
      mapPreferences: {},
      pointSearch: undefined,
      polygonSearch: undefined,
      project: {},
      router: {},
      shapefile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})
