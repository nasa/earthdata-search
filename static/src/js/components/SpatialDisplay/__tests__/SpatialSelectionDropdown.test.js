import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Dropdown } from 'react-bootstrap'

import SpatialSelectionDropdown from '../SpatialSelectionDropdown'
import * as EventEmitter from '../../../events/events'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onToggleShapefileUploadModal: jest.fn()
  }

  const enzymeWrapper = shallow(<SpatialSelectionDropdown {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('SpatialSelectionDropdown component', () => {
  test('renders dropdown items', () => {
    const { enzymeWrapper } = setup()

    const dropdowns = enzymeWrapper.find(Dropdown.Item)

    expect(dropdowns.length).toEqual(5)
    expect(dropdowns.at(0).props().label).toEqual('Select Polygon')
    expect(dropdowns.at(1).props().label).toEqual('Select Rectangle')
    expect(dropdowns.at(2).props().label).toEqual('Select Point')
    expect(dropdowns.at(3).props().label).toEqual('Select Circle')
    expect(dropdowns.at(4).props().label).toEqual('Select Shapefile')
  })

  test('clicking the polygon dropdown emits an event', () => {
    const { enzymeWrapper } = setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const dropdowns = enzymeWrapper.find(Dropdown.Item)

    dropdowns.at(0).simulate('click')

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'polygon' })
  })

  test('clicking the rectangle dropdown emits an event', () => {
    const { enzymeWrapper } = setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const dropdowns = enzymeWrapper.find(Dropdown.Item)

    dropdowns.at(1).simulate('click')

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'rectangle' })
  })

  test('clicking the point dropdown emits an event', () => {
    const { enzymeWrapper } = setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const dropdowns = enzymeWrapper.find(Dropdown.Item)

    dropdowns.at(2).simulate('click')

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'marker' })
  })

  test('clicking the circle dropdown emits an event', () => {
    const { enzymeWrapper } = setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const dropdowns = enzymeWrapper.find(Dropdown.Item)

    dropdowns.at(3).simulate('click')

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'circle' })
  })

  test('clicking the shapefile dropdown calls onToggleShapefileUploadModal', () => {
    const { enzymeWrapper, props } = setup()

    const dropdowns = enzymeWrapper.find(Dropdown.Item)

    dropdowns.at(4).simulate('click')

    expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(true)
  })
})
