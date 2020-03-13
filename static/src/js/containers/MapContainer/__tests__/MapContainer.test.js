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
import { MapContainer } from '../MapContainer'
import ZoomHome from '../../../components/Map/ZoomHome'
import LayerBuilder from '../../../components/Map/LayerBuilder'
import ConnectedSpatialSelectionContainer
  from '../../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer from '../../../components/Map/GranuleGridLayer'

import configureStore from '../../../store/configureStore'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

const store = configureStore()

function setup() {
  const props = {
    authToken: '',
    collections: {},
    focusedCollection: '',
    focusedGranule: '',
    granules: {},
    pathname: '/search',
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
    shapefile: {},
    onChangeFocusedGranule: jest.fn(),
    onChangeMap: jest.fn(),
    onExcludeGranule: jest.fn(),
    onSaveShapefile: jest.fn(),
    onShapefileErrored: jest.fn(),
    onMetricsMap: jest.fn(),
    onToggleTooManyPointsModal: jest.fn()
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
})
