import React from 'react'

import { act } from '@testing-library/react'
import actions from '../../../actions'
import * as EventEmitter from '../../../events/events'
import {
  mapDispatchToProps,
  mapStateToProps,
  ShapefileDropzoneContainer
} from '../ShapefileDropzoneContainer'
import ShapefileDropzone from '../../../components/Dropzone/ShapefileDropzone'

import { shapefileEventTypes } from '../../../constants/eventTypes'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/Dropzone/ShapefileDropzone', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ShapefileDropzoneContainer,
  defaultProps: {
    authToken: 'test-auth-token',
    onRemoveTimelineFilter: jest.fn(),
    onToggleShapefileUploadModal: jest.fn(),
    onRemoveSpatialFilter: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onRemoveSpatialFilter calls actions.removeSpatialFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeSpatialFilter')

    mapDispatchToProps(dispatch).onRemoveSpatialFilter()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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
    setup()

    expect(ShapefileDropzone).toHaveBeenCalledTimes(1)
    expect(ShapefileDropzone).toHaveBeenCalledWith({
      dropzoneOptions: {
        acceptedFiles: '.zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml',
        createImageThumbnails: false,
        headers: { 'Cache-Control': undefined },
        parallelUploads: 1,
        paramName: 'upload',
        params: { targetSrs: 'crs:84' },
        previewTemplate: '<div>',
        uploadMultiple: false,
        url: 'https://ogre.adc4gis.com/convert'
      },
      eventScope: 'shapefile',
      onError: expect.any(Function),
      onRemovedFile: expect.any(Function),
      onSending: expect.any(Function),
      onSuccess: expect.any(Function)
    }, {})
  })

  // We can't really unit test the Dropzone callbacks without manually triggering them.
  // We don't like to manually trigger them in unit tests, but we do have Playwright tests
  // that upload files and trigger these callbacks through Dropzone.
  describe('when onSending is triggered', () => {
    test('calls onRemoveSpatialFilter and onShapefileLoading', () => {
      const onShapefileLoadingMock = jest.fn()
      const { props } = setup({
        overrideZustandState: {
          shapefile: {
            setLoading: onShapefileLoadingMock
          }
        }
      })

      const mockFile = {
        name: 'test-file-name.zip'
      }

      const componentProps = ShapefileDropzone.mock.calls[0][0]
      const { onSending } = componentProps

      act(() => {
        onSending(mockFile)
      })

      expect(props.onRemoveSpatialFilter).toHaveBeenCalledTimes(1)
      expect(props.onRemoveSpatialFilter).toHaveBeenCalledWith()

      expect(onShapefileLoadingMock).toHaveBeenCalledTimes(1)
      expect(onShapefileLoadingMock).toHaveBeenCalledWith('test-file-name.zip')
    })
  })

  describe('when onSuccess is triggered', () => {
    test('calls onToggleShapefileUploadModal and onSaveShapefile', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())
      const filesizeMock = jest.fn(() => '200KB')
      const onSaveShapefileMock = jest.fn()

      // Mock JSON methods to verify minification
      const stringifySpy = jest.spyOn(JSON, 'stringify')
      const parseSpy = jest.spyOn(JSON, 'parse')

      const { props } = setup({
        overrideZustandState: {
          shapefile: {
            saveShapefile: onSaveShapefileMock
          }
        }
      })

      const mockFile = {
        name: 'test-file-name.zip',
        size: 200
      }

      const mockResponse = {
        name: 'SOMEBIGHASHtest-file-name',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [-106, 35],
                [-105, 36],
                [-94, 33],
                [-95, 30],
                [-93, 31],
                [-92, 3]
              ]
            }
          }
        ]
      }

      const mockDropzoneEl = {
        filesize: filesizeMock,
        removeFile: jest.fn()
      }

      const componentProps = ShapefileDropzone.mock.calls[0][0]
      const { onSuccess } = componentProps

      act(() => {
        onSuccess(mockFile, mockResponse, mockDropzoneEl)
      })

      expect(mockDropzoneEl.removeFile).toHaveBeenCalledTimes(1)
      expect(mockDropzoneEl.removeFile).toHaveBeenCalledWith({
        name: 'test-file-name.zip',
        size: 200
      })

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        shapefileEventTypes.ADDSHAPEFILE,
        {
          name: 'test-file-name.zip',
          size: 200
        },
        {
          features: [
            {
              type: 'Feature',
              properties: {
                edscId: '0'
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [-106, 35],
                  [-105, 36],
                  [-94, 33],
                  [-95, 30],
                  [-93, 31],
                  [-92, 3]
                ]
              }
            }
          ],
          name: 'test-file-name.zip'
        }
      )

      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

      expect(onSaveShapefileMock).toHaveBeenCalledTimes(1)
      expect(onSaveShapefileMock).toHaveBeenCalledWith({
        authToken: 'test-auth-token',
        file: {
          features: [
            {
              type: 'Feature',
              properties: {
                edscId: '0'
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [-106, 35],
                  [-105, 36],
                  [-94, 33],
                  [-95, 30],
                  [-93, 31],
                  [-92, 3]
                ]
              }
            }
          ],
          name: 'test-file-name.zip'
        },
        filename: 'test-file-name.zip',
        size: '200KB'
      })

      // Verify minification was performed
      expect(stringifySpy).toHaveBeenCalledTimes(1)
      expect(stringifySpy).toHaveBeenCalledWith(mockResponse)
      expect(parseSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when onError is triggered', () => {
    describe('when given a shapefile filetype', () => {
      describe.each([
        'zip',
        'shp',
        'dbf',
        'shx'
      ])('when given a %s file', (fileType) => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: `test-file-name.${fileType}`
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
          })
        })
      })

      describe('when zip/shp/dbf/shx is in the filename but not the extension', () => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: 'zip-shp-dbf-shx.java'
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'Invalid file format.'
          })
        })
      })
    })

    describe('when given a Keyhole Markup Language file', () => {
      describe.each([
        'kml',
        'kmz'
      ])('when given a %s file', (fileType) => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: `test-file-name.${fileType}`
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'To use a Keyhole Markup Language file, please upload a valid .kml or .kmz file.'
          })
        })
      })

      describe('when kml/kmz is in the filename but not the extension', () => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: 'kml-kmz.java'
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'Invalid file format.'
          })
        })
      })
    })

    describe('when given a Geojson file types', () => {
      describe.each([
        'json',
        'geojson'
      ])('when given a %s file', (fileType) => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: `test-file-name.${fileType}`
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'To use a GeoJSON file, please upload a valid .json or .geojson file.'
          })
        })
      })

      describe('when json/geojson is in the filename but not the extension', () => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: 'json-kmz.java'
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'Invalid file format.'
          })
        })
      })
    })

    describe('when given a GeoRSS file types', () => {
      describe.each([
        'rss',
        'georss',
        'xml'
      ])('when given a %s file', (fileType) => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: `test-file-name.${fileType}`
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'To use a GeoRSS file, please upload a valid .rss, .georss, or .xml file.'
          })
        })
      })

      describe('when rss/georss/xml is in the filename but not the extension', () => {
        test('calls onShapefileErrored with the correct message', () => {
          const onShapefileErroredMock = jest.fn()
          const { props } = setup({
            overrideZustandState: {
              shapefile: {
                setErrored: onShapefileErroredMock
              }
            }
          })

          const mockFile = {
            name: 'rss-georss-xml.java'
          }

          const componentProps = ShapefileDropzone.mock.calls[0][0]
          const { onError } = componentProps

          act(() => {
            onError(mockFile)
          })

          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

          expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
          expect(onShapefileErroredMock).toHaveBeenCalledWith({
            message: 'Invalid file format.'
          })
        })
      })
    })

    describe('when given a unrecognized file type', () => {
      test('calls onShapefileErrored with the correct message', () => {
        const onShapefileErroredMock = jest.fn()
        const { props } = setup({
          overrideZustandState: {
            shapefile: {
              setErrored: onShapefileErroredMock
            }
          }
        })

        const mockFile = {
          name: 'test-file-name.svg'
        }

        const componentProps = ShapefileDropzone.mock.calls[0][0]
        const { onError } = componentProps

        act(() => {
          onError(mockFile)
        })

        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(false)

        expect(onShapefileErroredMock).toHaveBeenCalledTimes(1)
        expect(onShapefileErroredMock).toHaveBeenCalledWith({
          message: 'Invalid file format.'
        })
      })
    })
  })

  describe('when onRemovedFile is triggered', () => {
    test('calls eventEmitter', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => jest.fn())

      setup()

      const mockFile = {
        name: 'test-file-name.zip'
      }

      const mockResponse = {
        name: 'SOMEBIGHASHtest-file-name',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [-106, 35],
                [-105, 36],
                [-94, 33],
                [-95, 30],
                [-93, 31],
                [-92, 3]
              ]
            }
          }
        ]
      }

      const componentProps = ShapefileDropzone.mock.calls[0][0]
      const { onRemovedFile } = componentProps

      act(() => {
        onRemovedFile(mockFile, mockResponse)
      })

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(
        shapefileEventTypes.REMOVESHAPEFILE,
        mockFile,
        mockResponse
      )
    })
  })
})
