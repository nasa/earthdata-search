import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {
  Map,
  ImageOverlay
} from 'react-leaflet'
import CollectionDetailsMinimap from '../CollectionDetailsMinimap'
import CollectionDetailsFeatureGroup from '../CollectionDetailsFeatureGroup'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    metadata: {
      boxes: [-90, -180, 90, 180]
    }
  }

  const enzymeWrapper = shallow(<CollectionDetailsMinimap {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetails component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toBe(Map)
    expect(enzymeWrapper.find(ImageOverlay).length).toEqual(1)
    expect(enzymeWrapper.find(CollectionDetailsFeatureGroup).length).toEqual(1)
  })

  test('passes correct props to Map', () => {
    const { enzymeWrapper } = setup()
    const map = enzymeWrapper.find(Map)
    expect(map.prop('className')).toEqual('collection-details-minimap')
    expect(map.prop('minZoom')).toEqual(0)
    expect(map.prop('maxZoom')).toEqual(0)
    expect(map.prop('zoom')).toEqual(0)
    expect(map.prop('center')).toEqual([0, 0])
    expect(map.prop('zoomControl')).toEqual(false)
    expect(map.prop('attributionControl')).toEqual(false)
    expect(map.prop('dragging')).toEqual(false)
    expect(map.prop('touchZoom')).toEqual(false)
    expect(map.prop('doubleClickZoom')).toEqual(false)
    expect(map.prop('scrollWheelZoom')).toEqual(false)
    expect(map.prop('tap')).toEqual(false)
  })

  test('passes correct props to ImageOverlay', () => {
    const { enzymeWrapper } = setup()
    const overlay = enzymeWrapper.find(ImageOverlay)
    expect(overlay.prop('url')).toEqual('test-file-stub')
    expect(overlay.prop('bounds')).toEqual([[-90, -180], [90, 180]])
  })

  test('passes correct props to CollectionDetailsFeatureGroup', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(CollectionDetailsFeatureGroup).prop('metadata')).toEqual({
      boxes: [-90, -180, 90, 180]
    })
  })
})
