import actions from '../../../actions'

import { mapDispatchToProps, mapStateToProps } from '../MapContainer'

import * as metricsMap from '../../../middleware/metrics/actions'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

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
      authToken: 'mock-token',
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      map: {},
      project: {},
      router: {},
      shapefile: {},
      ui: {
        map: {
          drawingNewLayer: false
        }
      }
    }

    const expectedState = {
      authToken: 'mock-token',
      collectionsMetadata: {},
      drawingNewLayer: false,
      focusedCollectionId: 'collectionId',
      focusedGranuleId: 'granuleId',
      granuleSearchResults: {},
      granulesMetadata: {},
      map: {},
      mapPreferences: {},
      project: {},
      router: {},
      shapefile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})
