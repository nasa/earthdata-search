import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Modal } from 'react-bootstrap'
import * as EventEmitter from '../../../events/events'
import ShapefileUploadModal from '../ShapefileUploadModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onToggleShapefileUploadModal: jest.fn(),
    isOpen: false
  }

  const enzymeWrapper = shallow(<ShapefileUploadModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ShapefileUploadModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal.Title).text()).toEqual('Search by Shape File')
  })

  test('should render instructions', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal.Body).find('p').at(0).text()).toEqual('Drag and drop a shape file onto the screen or click Browse Files below to upload.')
  })

  test('should render file type information', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal.Body).find('p').at(1).text()).toEqual('Valid formats include:')
    expect(enzymeWrapper.find(Modal.Body).find('li').at(0).text()).toEqual('Shapefile (.zip including .shp, .dbf, and .shx file)')
    expect(enzymeWrapper.find(Modal.Body).find('li').at(1).text()).toEqual('Keyhole Markup Language (.kml or .kmz)')
    expect(enzymeWrapper.find(Modal.Body).find('li').at(2).text()).toEqual('GeoJSON (.json or .geojson)')
    expect(enzymeWrapper.find(Modal.Body).find('li').at(3).text()).toEqual('GeoRSS (.rss, .georss, or .xml)')
  })

  test('should render a hint', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Modal.Body).find('p').at(2).text()).toEqual('Hint:You may also simply drag and drop shape files onto the screen at any time.')
  })

  describe('modal actions', () => {
    test('Browse Files button should emit event', () => {
      const { enzymeWrapper } = setup()
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      enzymeWrapper.find('.shapefile-modal__action--primary').simulate('click')

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith('shapefile.dropzoneOpen')
    })

    test('Cancel button should trigger onToggleShapefileUploadModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.shapefile-modal__action--secondary').simulate('click')

      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)
    })
  })
})
