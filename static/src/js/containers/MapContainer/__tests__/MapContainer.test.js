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
import { EdscMapContainer } from '../MapContainer'
import ZoomHome from '../../../components/map_controls/ZoomHome'
import LayerBuilder from '../../../components/map_controls/LayerBuilder'
import ConnectedSpatialSelectionContainer
  from '../../SpatialSelectionContainer/SpatialSelectionContainer'
import GranuleGridLayer from '../../../components/map_controls/GranuleGridLayer/GranuleGridLayer'

import store from '../../../store/configureStore'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    granules: {},
    mapParam: '0!0!2!1!0!0,2',
    masterOverlayPanelHeight: 500,
    onChangeMap: jest.fn()
  }

  // Mount is required here so we can have access to the mapRef
  const enzymeWrapper = mount(
    <Provider store={store}>
      <EdscMapContainer {...props} />
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('EdscMapContainer component', () => {
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

    const newMapParam = '38.805869!-77.0418825!2!1!0!0,2'

    expect(props.onChangeMap.mock.calls.length).toBe(1)
    expect(props.onChangeMap.mock.calls[0]).toEqual([{ mapParam: newMapParam }])
  })
})
