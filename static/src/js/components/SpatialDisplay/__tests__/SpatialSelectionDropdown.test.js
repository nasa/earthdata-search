import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Dropdown, OverlayTrigger } from 'react-bootstrap'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

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

  describe('if the database is disabled', () => {
    test('searching with the `shapefileUpload` buttons should also be disabled', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: true
      }))

      const { enzymeWrapper } = setup()

      const dropdowns = enzymeWrapper.find(Dropdown.Item)

      const shapeFileSelectionButton = dropdowns.at(4)
      shapeFileSelectionButton.simulate('click')

      expect(shapeFileSelectionButton.prop('disabled')).toEqual(true)
    })

    // TODO ensure that this is only occuring when hovering
    test('hovering over the shapefile reveals tool-tip', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: true
      }))

      const { enzymeWrapper } = setup()

      const dropdowns = enzymeWrapper.find(Dropdown.Item)
      console.log('🚀 ~ file: SpatialSelectionDropdown.test.js:128 ~ test.only ~ dropdowns:', dropdowns)

      const shapeFileSelectionButton = dropdowns.at(4)
      shapeFileSelectionButton.simulate('mouseenter')

      expect(shapeFileSelectionButton.text()).toBe('<OverlayTrigger />')

      const overlayTrigger = enzymeWrapper.find(OverlayTrigger)
      console.log('🚀 ~ file: SpatialSelectionDropdown.test.js:143 ~ test.only ~ overlayTrigger:', overlayTrigger)

      const toolTipMessage = overlayTrigger.props().overlay.props.children
      expect(toolTipMessage).toEqual('Shapefile subsetting is currently disabled')
    })
  })
})
