import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as EventEmitter from '../../../events/events'
import { ShapefileDropzoneContainer } from '../ShapefileDropzoneContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: 'test-auth-token',
    onRemoveTimelineFilter: jest.fn(),
    onShapefileErrored: jest.fn(),
    onSaveShapefile: jest.fn(),
    onToggleShapefileUploadModal: jest.fn(),
    onShapefileLoading: jest.fn()
  }

  const enzymeWrapper = shallow(<ShapefileDropzoneContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ShapefileDropzoneContainer component', () => {
  test('renders ShapefileDropzone with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('WithDropzone').props().dropzoneOptions).toEqual({
      acceptedFiles: '.zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml',
      createImageThumbnails: false,
      headers: {
        'Cache-Control': undefined
      },
      parallelUploads: 1,
      paramName: 'upload',
      previewTemplate: '<div>',
      uploadMultiple: false,
      url: 'https://ogre.adc4gis.com/convert'
    })
  })

  describe('onSending callback', () => {
    test('fires the correct callbacks', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.find('WithDropzone').props().onSending({
        name: 'test-file-name.zip',
        size: '<span>200KB</span>'
      }, {
        test: 'test-response'
      }, {
        filesize: '400KB',
        removeFile: jest.fn()
      })

      expect(props.onShapefileLoading).toHaveBeenCalledTimes(1)
      expect(props.onShapefileLoading).toHaveBeenCalledWith({
        name: 'test-file-name.zip',
        size: '<span>200KB</span>'
      })
    })
  })

  describe('onSuccess callback', () => {
    test('fires the correct callbacks', () => {
      const { enzymeWrapper, props } = setup()
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      const filesizeMock = jest.fn(() => '200KB')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      enzymeWrapper.find('WithDropzone').props().onSuccess({
        name: 'test-file-name.zip',
        size: '<span>200KB</span>'
      }, {
        test: 'test-response'
      }, {
        filesize: filesizeMock,
        removeFile: jest.fn()
      })

      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

      expect(props.onSaveShapefile).toHaveBeenCalledTimes(1)
      expect(props.onSaveShapefile).toHaveBeenCalledWith({
        authToken: 'test-auth-token',
        file: {
          test: 'test-response'
        },
        filename: 'test-file-name.zip',
        size: '200KB'
      })


      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'shapefile.success',
        {
          name: 'test-file-name.zip',
          size: '<span>200KB</span>'
        },
        {
          test: 'test-response'
        }
      )
    })
  })

  describe('onError callback', () => {
    describe('when given a .shp file', () => {
      test('fires the correct callbacks', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.shp'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          type: 'upload_shape'
        })
      })
    })
  })

  describe('onRemovedFile callback', () => {
    test('fires the correct callbacks', () => {
      const { enzymeWrapper } = setup()
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      enzymeWrapper.find('WithDropzone').props().onRemovedFile({
        name: 'test-file.shp'
      },
      {
        test: 'test-response'
      })

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        'shapefile.removedfile',
        {
          name: 'test-file.shp'
        },
        {
          test: 'test-response'
        }
      )
    })
  })
})
