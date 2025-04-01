import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import * as EventEmitter from '../../../events/events'
import {
  mapDispatchToProps,
  mapStateToProps,
  ShapefileDropzoneContainer
} from '../ShapefileDropzoneContainer'

import { shapefileEventTypes } from '../../../constants/eventTypes'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: 'test-auth-token',
    onRemoveTimelineFilter: jest.fn(),
    onShapefileErrored: jest.fn(),
    onSaveShapefile: jest.fn(),
    onToggleShapefileUploadModal: jest.fn(),
    onShapefileLoading: jest.fn(),
    onRemoveSpatialFilter: jest.fn()
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

describe('mapDispatchToProps', () => {
  test('onRemoveSpatialFilter calls actions.removeSpatialFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeSpatialFilter')

    mapDispatchToProps(dispatch).onRemoveSpatialFilter()

    expect(spy).toBeCalledTimes(1)
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

  test('onShapefileLoading calls actions.shapefileLoading', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'shapefileLoading')

    mapDispatchToProps(dispatch).onShapefileLoading({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal({ mock: 'data' })

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
      authToken: 'mock-token'
    }

    const expectedState = {
      authToken: 'mock-token'
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
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
      params: {
        targetSrs: 'crs:84'
      },
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
        features: []
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
          features: []
        },
        filename: 'test-file-name.zip',
        size: '200KB'
      })

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        shapefileEventTypes.ADDSHAPEFILE,
        {
          name: 'test-file-name.zip',
          size: '<span>200KB</span>'
        },
        {
          features: []
        }
      )
    })
  })

  describe('onError callback', () => {
    describe('when given a shapefile filetype', () => {
      test('fires the correct callbacks for .zip files', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.zip'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        })
      })

      test('fires the correct callbacks for .shp files', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.shp'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        })
      })

      test('fires the correct callbacks for .dbf files', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.dbf'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        })
      })

      test('fires the correct callbacks for .shx files', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.shx'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        })
      })

      test('fires the other filetype when zip/shp/dbf/shx is in the filename but not the filepath', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'zip-shp-dbf-shx.java'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'Invalid file format.'
        })
      })
    })

    describe('when given a Keyhole Markup Language file', () => {
      test('fires the correct callbacks for .kml files', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.kml'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a Keyhole Markup Language file, please upload a valid .kml or .kmz file.'
        })
      })

      test('fires the correct callbacks for .kmz file', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.kmz'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a Keyhole Markup Language file, please upload a valid .kml or .kmz file.'
        })
      })

      test('fires the other filetype when kml/kmz is in the filename but not the filepath', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'kml-kmz.java'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'Invalid file format.'
        })
      })
    })

    describe('when given a Geojson file types', () => {
      test('fires the correct callbacks for .json file', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.json'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a GeoJSON file, please upload a valid .json or .geojson file.'
        })
      })

      test('fires the correct callbacks for .geojson file', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.geojson'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a GeoJSON file, please upload a valid .json or .geojson file.'
        })
      })

      test('fires the other filetype when json/geojson is in the filename but not the filepath', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'json-geojson.java'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'Invalid file format.'
        })
      })
    })

    describe('when given a GeoRSS file types', () => {
      test('fires the correct callbacks for .rss file', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.rss'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a GeoRSS file, please upload a valid .rss, .georss, or .xml file.'
        })
      })

      test('fires the correct callbacks for .georss file', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.georss'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a GeoRSS file, please upload a valid .rss, .georss, or .xml file.'
        })
      })

      test('fires the correct callbacks for .xml file', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.xml'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'To use a GeoRSS file, please upload a valid .rss, .georss, or .xml file.'
        })
      })

      test('fires the other filetype when rss/georss/xml is in the filename but not the filepath', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'rss-georss-xml.java'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'Invalid file format.'
        })
      })
    })

    describe('when given a unrecognized file type', () => {
      test('fires the correct callbacks for any unrecognized filetype', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.find('WithDropzone').props().onError({
          name: 'test-file.svg'
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(props.onShapefileErrored).toHaveBeenCalledTimes(1)
        expect(props.onShapefileErrored).toHaveBeenCalledWith({
          message: 'Invalid file format.'
        })
      })
    })
  })

  describe('onRemovedFile callback', () => {
    test('fires the correct callbacks', () => {
      const { enzymeWrapper } = setup()
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      enzymeWrapper.find('WithDropzone').props().onRemovedFile(
        {
          name: 'test-file.shp'
        },
        {
          test: 'test-response'
        }
      )

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        shapefileEventTypes.REMOVESHAPEFILE,
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
