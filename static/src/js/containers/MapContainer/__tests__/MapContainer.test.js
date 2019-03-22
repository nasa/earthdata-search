import React from 'react'
import Enzyme, { shallow } from 'enzyme'
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
import ConnectedSpatialSelectionContainer from '../../SpatialSelectionContainer/SpatialSelectionContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    mapParam: '0!0!2!1!0!0,2',
    onChangeMap: jest.fn()
  }

  const enzymeWrapper = shallow(<EdscMapContainer {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('EdscMapContainer component', () => {
  test('should render shelf and controls', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.exists()).toBe(true)

    expect(enzymeWrapper.find(Map).length).toBe(1)
    expect(enzymeWrapper.find(LayersControl).length).toBe(1)
    expect(enzymeWrapper.find(ScaleControl).length).toBe(1)
    expect(enzymeWrapper.find(ZoomHome).length).toBe(1)
    expect(enzymeWrapper.find(LayerBuilder).length).toBe(6)
    expect(enzymeWrapper.find(ConnectedSpatialSelectionContainer).length).toBe(1)
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
