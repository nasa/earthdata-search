import React from 'react'

import actions from '../../../actions'

import { mapDispatchToProps, mapStateToProps } from '../MapContainer'

import * as metricsMap from '../../../middleware/metrics/actions'

// Mock Map because openlayers causes errors
jest.mock('../../../components/Map/Map', () => <div />)
jest.mock('../../../util/map/crs', () => {})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onChangeFocusedGranule calls actions.changeFocusedGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedGranule')

    mapDispatchToProps(dispatch).onChangeFocusedGranule('granuleId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('granuleId')
  })

  test('onChangeMap calls actions.changeMap', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeMap')

    mapDispatchToProps(dispatch).onChangeMap({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onClearShapefile calls actions.clearShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearShapefile')

    mapDispatchToProps(dispatch).onClearShapefile({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onExcludeGranule calls actions.excludeGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'excludeGranule')

    mapDispatchToProps(dispatch).onExcludeGranule({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onFetchShapefile calls actions.fetchShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchShapefile')

    mapDispatchToProps(dispatch).onFetchShapefile('shapefileId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('shapefileId')
  })

  test('onSaveShapefile calls actions.saveShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'saveShapefile')

    mapDispatchToProps(dispatch).onSaveShapefile({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onShapefileErrored calls actions.shapefileErrored', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'shapefileErrored')

    mapDispatchToProps(dispatch).onShapefileErrored({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onMetricsMap calls metricsMap', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsMap, 'metricsMap')

    mapDispatchToProps(dispatch).onMetricsMap({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleDrawingNewLayer calls actions.toggleDrawingNewLayer', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleDrawingNewLayer')

    mapDispatchToProps(dispatch).onToggleDrawingNewLayer({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleTooManyPointsModal calls actions.toggleTooManyPointsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleTooManyPointsModal')

    mapDispatchToProps(dispatch).onToggleTooManyPointsModal({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onUpdateShapefile calls actions.updateShapefile', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateShapefile')

    mapDispatchToProps(dispatch).onUpdateShapefile({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
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
      map: {},
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
      map: {},
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
