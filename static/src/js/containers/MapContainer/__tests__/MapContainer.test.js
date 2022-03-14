import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import L from 'leaflet'
import {
  Map,
  LayersControl,
  ScaleControl
} from 'react-leaflet'

import actions from '../../../actions'

import { mapDispatchToProps, mapStateToProps, MapContainer } from '../MapContainer'
import ZoomHome from '../../../components/Map/ZoomHome'
import LayerBuilder from '../../../components/Map/LayerBuilder'
import ConnectedSpatialSelectionContainer
  from '../../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer from '../../../components/Map/GranuleGridLayer'

import configureStore from '../../../store/configureStore'
import projections from '../../../util/map/projections'
import * as metricsMap from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
})

const store = configureStore()

function setup(overrideProps = {}) {
  const props = {
    authToken: '',
    collectionsMetadata: {},
    drawingNewLayer: false,
    focusedCollectionId: '',
    focusedGranuleId: '',
    granules: {},
    granulesMetadata: {},
    granuleSearchResults: {},
    router: {
      location: {
        pathname: '/search'
      }
    },
    project: {},
    map: {
      base: {
        blueMarble: true,
        trueColor: false,
        landWaterMap: false
      },
      latitude: 0,
      longitude: 0,
      overlays: {
        referenceFeatures: true,
        coastlines: false,
        referenceLabels: true
      },
      projection: projections.geographic,
      zoom: 2
    },
    mapPreferences: {
      zoom: 4,
      latitude: 39,
      baseLayer: 'blueMarble',
      longitude: -95,
      projection: 'epsg4326',
      overlayLayers: [
        'referenceFeatures',
        'referenceLabels'
      ]
    },
    shapefile: {},
    onChangeFocusedGranule: jest.fn(),
    onChangeMap: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFetchShapefile: jest.fn(),
    onSaveShapefile: jest.fn(),
    onShapefileErrored: jest.fn(),
    onMetricsMap: jest.fn(),
    onToggleTooManyPointsModal: jest.fn(),
    onUpdateShapefile: jest.fn(),
    ...overrideProps
  }

  // Mount is required here so we can have access to the mapRef
  const enzymeWrapper = mount(
    <Provider store={store}>
      <MapContainer {...props} />
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

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

describe('MapContainer component', () => {
  test('should render self and controls', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.exists()).toBe(true)

    expect(enzymeWrapper.find(Map).length).toBe(1)
    expect(enzymeWrapper.find(LayersControl).length).toBe(1)
    expect(enzymeWrapper.find(ScaleControl).length).toBe(1)
    expect(enzymeWrapper.find(ZoomHome).length).toBe(1)
    expect(enzymeWrapper.find(LayerBuilder).length).toBe(6)
    expect(enzymeWrapper.find(ConnectedSpatialSelectionContainer).length).toBe(1)
    expect(enzymeWrapper.find(GranuleGridLayer).length).toBe(1)
  })

  test('handleMoveend calls onChangeMap', () => {
    const { enzymeWrapper, props } = setup()

    const event = {
      target: {
        getCenter: jest.fn(() => new L.LatLng(38.805869, -77.0418825)),
        getZoom: jest.fn(() => 2)
      }
    }

    const map = enzymeWrapper.find(Map)
    map.prop('onMoveend')(event)

    const newMap = {
      latitude: 38.805869,
      longitude: -77.0418825,
      zoom: 2
    }

    expect(props.onChangeMap.mock.calls.length).toBe(1)
    expect(props.onChangeMap.mock.calls[0]).toEqual([{ ...newMap }])
  })

  describe('when rendering', () => {
    test('resizes the leaflet container', () => {
      const resizeLeafletControlsMock = jest.spyOn(MapContainer.prototype, 'resizeLeafletControls')
      setup()

      expect(resizeLeafletControlsMock).toHaveBeenCalledTimes(1)
      expect(resizeLeafletControlsMock).toHaveBeenCalledWith()
    })
  })

  describe('when the window is resized', () => {
    test('resizes the leaflet container', () => {
      // Get the starting value or the inner width.
      const prevInnerWidth = global.innerWidth

      // Set the inner width and mock the resizeLeafletControls method.
      global.innerWidth = 1000
      const resizeLeafletControlsMock = jest.spyOn(MapContainer.prototype, 'resizeLeafletControls')

      setup()

      // Assert the mock has only fired once when the component mounted.
      expect(resizeLeafletControlsMock).toHaveBeenCalledTimes(1)

      // Change the inner width and manually trigger a window resize event.
      global.innerWidth = 950
      global.dispatchEvent(new Event('resize'))

      // Assert the mock has fired again due to the resize event.
      expect(resizeLeafletControlsMock).toHaveBeenCalledTimes(2)
      expect(resizeLeafletControlsMock).toHaveBeenCalledWith()

      // Reset the inner width to the starting value.
      global.innerWidth = prevInnerWidth
    })
  })

  describe('map preferences', () => {
    test('loads the map defaults when no preferences are provided', () => {
      const { enzymeWrapper } = setup({ mapPreferences: {} })

      expect(enzymeWrapper.find(Map).props().center).toEqual([0, 0])
      expect(enzymeWrapper.find(Map).props().zoom).toEqual(2)
    })

    test('loads the map preferences instead of default values', () => {
      const { enzymeWrapper } = setup({
        map: {}
      })

      expect(enzymeWrapper.find(Map).props().center).toEqual([39, -95])
      expect(enzymeWrapper.find(Map).props().zoom).toEqual(4)
    })

    test('loads the map URL parameter instead of default values or preferences', () => {
      const { enzymeWrapper } = setup({
        map: {
          base: {
            blueMarble: true,
            trueColor: false,
            landWaterMap: false
          },
          latitude: 10,
          longitude: 10,
          overlays: {
            referenceFeatures: true,
            coastlines: false,
            referenceLabels: true
          },
          projection: projections.geographic,
          zoom: 5
        },
        router: {
          location: {
            pathname: '/search',
            search: '?m=10!10!5!1!0!0%2C2'
          }
        }
      })

      expect(enzymeWrapper.find(Map).props().center).toEqual([10, 10])
      expect(enzymeWrapper.find(Map).props().zoom).toEqual(5)
    })
  })
})
