import { act, screen } from '@testing-library/react'

import * as EventEmitter from '../../../events/events'

import SpatialDisplay from '../SpatialDisplay'
import spatialTypes from '../../../constants/spatialTypes'
import { mapEventTypes, shapefileEventTypes } from '../../../constants/eventTypes'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: SpatialDisplay,
  defaultProps: {
    boundingBoxSearch: [],
    circleSearch: [],
    displaySpatialPolygonWarning: false,
    drawingNewLayer: false,
    lineSearch: [],
    pointSearch: [],
    polygonSearch: [],
    onChangeQuery: jest.fn(),
    onRemoveSpatialFilter: jest.fn(),
    shapefile: {}
  },
  defaultZustandState: {
    query: {
      changeQuery: jest.fn(),
      removeSpatialFilter: jest.fn()
    }
  }
})

describe('SpatialDisplay component', () => {
  describe('with no props', () => {
    test('should render self without display', () => {
      setup()
      expect(screen.queryAllByText('Spatial')).toHaveLength(0)
    })
  })

  describe('with pointSearch', () => {
    test('should render the spatial info', () => {
      const newPoint = '-77.0418825,38.805869' // Lon,Lat
      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: [newPoint]
              }
            }
          }
        }
      })

      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
      expect(screen.queryAllByText('Point')).toHaveLength(1)

      expect(screen.queryAllByText('Point:')).toHaveLength(2)
      expect(screen.queryAllByTestId('spatial-display_point')[0].value).toEqual('38.805869,-77.0418825')
    })
  })

  describe('with boundingBoxSearch', () => {
    test('should render the spatial info', () => {
      const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                boundingBox: [newBoundingBox]
              }
            }
          }
        }
      })

      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      expect(screen.queryAllByText('Spatial')[1]).toBeVisible()

      expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
      expect(screen.getAllByTestId('edsc-icon')[0]).toBeVisible()

      expect(screen.queryAllByText('Rectangle')).toHaveLength(1)
      expect(screen.queryAllByText('Rectangle')[0]).toBeVisible()

      expect(screen.queryAllByText('Rectangle:')).toHaveLength(1)
      expect(screen.queryAllByText('Rectangle:')[0]).toBeVisible()

      expect(screen.queryAllByText('SW:')).toHaveLength(1)
      expect(screen.queryAllByTestId('spatial-display_southwest-point')[0].value).toEqual('38.791645,-77.119759')

      expect(screen.queryAllByText('NE:')).toHaveLength(1)
      expect(screen.queryAllByTestId('spatial-display_northeast-point')[0].value).toEqual('38.995845,-76.909393')
    })
  })

  describe('with circleSearch', () => {
    test('should render the spatial info', () => {
      const newCircle = '-77.119759,38.791645,20000'
      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                circle: [newCircle]
              }
            }
          }
        }
      })

      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      expect(screen.queryAllByText('Spatial')[1]).toBeVisible()

      expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
      expect(screen.getAllByTestId('edsc-icon')[0]).toBeVisible()

      expect(screen.queryAllByText('Circle')).toHaveLength(1)
      expect(screen.queryAllByText('Circle')[0]).toBeVisible()

      expect(screen.queryAllByText('Center:')).toHaveLength(1)
      expect(screen.queryAllByTestId('spatial-display_circle-center')[0].value).toEqual('38.791645,-77.119759')

      expect(screen.queryAllByText('Radius (m):')).toHaveLength(1)
      expect(screen.queryAllByTestId('spatial-display_circle-radius')[0].value).toEqual('20000')
    })
  })

  describe('with polygonSearch', () => {
    test('should render without spatial info', () => {
      const newPolygon = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575,'
        + '-77.04444122314453,38.99228142151045'

      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                polygon: [newPolygon]
              }
            }
          }
        }
      })

      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      expect(screen.queryAllByText('Spatial')[1]).toBeVisible()

      expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
      expect(screen.getAllByTestId('edsc-icon')[0]).toBeVisible()

      expect(screen.queryAllByText('Polygon')).toHaveLength(1)
      expect(screen.queryAllByText('Polygon')[0]).toBeVisible()

      expect(screen.queryAllByText('3 Points')[0]).toBeVisible()
      expect(screen.getAllByTestId('spatial-display_polygon')[0]).toBeVisible()
      expect(screen.getAllByTestId('spatial-display_polygon')[0].innerHTML).toEqual('3 Points')
    })

    test('should render a hint to draw the polygon on the map', () => {
      setup({
        overrideProps: {
          drawingNewLayer: spatialTypes.POLYGON
        }
      })

      expect(screen.queryAllByText('Draw a polygon on the map to filter results')).toHaveLength(1)
      expect(screen.queryAllByText('Draw a polygon on the map to filter results')[0]).toBeVisible()
    })
  })

  describe('with polygonSearch and displaySpatialPolygonWarning', () => {
    test('should render without spatial info and a warning', () => {
      const newPolygon = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575,'
        + '-77.04444122314453,38.99228142151045'

      setup({
        overrideProps: {
          displaySpatialPolygonWarning: true
        },
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                polygon: [newPolygon]
              }
            }
          }
        }
      })

      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      expect(screen.queryAllByText('Spatial')[1]).toBeVisible()

      expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
      expect(screen.getAllByTestId('edsc-icon')[0]).toBeVisible()

      expect(screen.queryAllByText('Polygon')).toHaveLength(1)
      expect(screen.queryAllByText('Polygon')[0]).toBeVisible()

      expect(screen.queryAllByText('This collection does not support polygon search. Your polygon has been converted to a bounding box.')).toHaveLength(1)
      expect(screen.queryAllByText('This collection does not support polygon search. Your polygon has been converted to a bounding box.')[0]).toBeVisible()
      expect(screen.getAllByTestId('spatial-display_polygon')[0].innerHTML).toEqual('3 Points')
    })
  })

  describe('with lineSearch', () => {
    test('should render without spatial info', () => {
      const line = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575'

      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                line: [line]
              }
            }
          }
        }
      })

      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      // This is hidden and should not show up
      expect(screen.queryAllByText('Line')).toHaveLength(0)
    })
  })

  describe('with shapefile', () => {
    describe('when the shapefile is loading', () => {
      test('should render with a loading spinner', () => {
        setup({
          overrideZustandState: {
            shapefile: {
              shapefileName: 'test file',
              shapefileSize: '',
              isLoaded: false,
              isLoading: true
            }
          }
        })

        expect(screen.queryAllByText('Spatial')).toHaveLength(2)
        expect(screen.queryAllByText('Spatial')[1]).toBeVisible()

        expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
        expect(screen.getAllByTestId('edsc-icon')[0]).toBeVisible()

        expect(screen.queryAllByText('Shape File')).toHaveLength(1)
        expect(screen.queryAllByText('Shape File')[0]).toBeVisible()

        expect(screen.getAllByTestId('spatial-display__loading')).toHaveLength(1)
        expect(screen.getAllByTestId('spatial-display__loading')[0]).toBeVisible()

        expect(screen.getAllByTestId('spatial-display__loading-icon')).toHaveLength(1)
        expect(screen.getAllByTestId('spatial-display__loading-icon')[0]).toBeVisible()
      })
    })

    describe('when the shapefile is loaded', () => {
      test('should render without a loading spinner or spatial info', () => {
        const newPolygon = '-77.04444122314453,38.99228142151045,'
          + '-77.01992797851562,38.79166886339155,'
          + '-76.89415168762207,38.902629947921575,'
          + '-77.04444122314453,38.99228142151045'

        setup({
          overrideZustandState: {
            query: {
              collection: {
                spatial: {
                  polygon: [newPolygon]
                }
              }
            },
            shapefile: {
              shapefileName: 'test file',
              shapefileSize: '42 KB',
              isLoaded: true,
              isLoading: false
            }
          }
        })

        expect(screen.queryAllByText('Spatial')).toHaveLength(2)
        expect(screen.queryAllByText('Spatial')[1]).toBeVisible()

        expect(screen.getAllByTestId('edsc-icon')).toHaveLength(2)
        expect(screen.getAllByTestId('edsc-icon')[0]).toBeVisible()

        expect(screen.queryAllByText('Shape File')).toHaveLength(1)
        expect(screen.queryAllByText('Shape File')[0]).toBeVisible()

        expect(screen.queryAllByTestId('spatial-display__loading')).toHaveLength(0)

        expect(screen.queryAllByText('test file')).toHaveLength(1)
        expect(screen.queryAllByText('(42 KB)')).toHaveLength(1)
      })

      describe('when the shapefile has selected shapes', () => {
        test('should render a hint with number of shapes selected', () => {
          const newPolygon = '-77.04444122314453,38.99228142151045,'
            + '-77.01992797851562,38.79166886339155,'
            + '-76.89415168762207,38.902629947921575,'
            + '-77.04444122314453,38.99228142151045'

          setup({
            overrideZustandState: {
              query: {
                collection: {
                  spatial: {
                    polygon: [newPolygon]
                  }
                }
              },
              shapefile: {
                shapefileName: 'test file',
                shapefileSize: '42 KB',
                isLoaded: true,
                isLoading: false,
                selectedFeatures: ['1']
              }
            }
          })

          expect(screen.queryAllByText('1 shape selected')).toHaveLength(1)
        })
      })

      describe('when an error message is passed into the shapefile', () => {
        test('should render the passed error message', () => {
          setup({
            overrideZustandState: {
              shapefile: {
                isErrored: {
                  message: 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
                }
              }
            }
          })

          expect(screen.getByText('To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.')).toBeInTheDocument()
        })
      })

      describe('when the spatial data is from NLP', () => {
        test('should display "Search Area" instead of "Shape File"', () => {
          const newPolygon = '-77.04444122314453,38.99228142151045,'
            + '-77.01992797851562,38.79166886339155,'
            + '-76.89415168762207,38.902629947921575,'
            + '-77.04444122314453,38.99228142151045'

          setup({
            overrideZustandState: {
              query: {
                collection: {
                  spatial: {
                    polygon: [newPolygon]
                  }
                }
              },
              shapefile: {
                shapefileName: 'NLP Spatial Area',
                isLoaded: true,
                isLoading: false,
                file: {
                  type: 'FeatureCollection',
                  features: [{
                    type: 'Feature',
                    properties: {
                      source: 'nlp',
                      query: 'flood data in california',
                      edscId: '0'
                    },
                    geometry: {
                      type: 'Polygon',
                      coordinates: [[[-77.04444122314453, 38.99228142151045]]]
                    }
                  }]
                }
              }
            }
          })

          expect(screen.queryAllByText('Search Area')).toHaveLength(1)
          expect(screen.queryAllByText('Search Area')[0]).toBeVisible()
          expect(screen.queryAllByText('Shape File')).toHaveLength(0)
          expect(screen.queryAllByText('NLP Spatial Area')).toHaveLength(1)
        })
      })
    })
  })

  describe('#onSpatialRemove', () => {
    test('calls onRemoveSpatialFilter', async () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

      const { user, zustandState } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: [' ']
              }
            }
          }
        }
      })

      const actionBtns = await screen.findAllByRole('button')
      const actionBtn = actionBtns[0]
      expect(actionBtns).toHaveLength(1)

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await user.click(actionBtn)
      })

      expect(zustandState.query.removeSpatialFilter).toHaveBeenCalledTimes(1)
      expect(zustandState.query.removeSpatialFilter).toHaveBeenCalledWith()

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(2)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWCANCEL)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith(shapefileEventTypes.REMOVESHAPEFILE)
    })
  })

  describe('manual entry of spatial values', () => {
    test('changing point search updates the state', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: ['']
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      await user.click(input)
      await user.type(input, '38,-77')

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual('38,-77')
    })

    test('submitting point search calls onChangeQuery', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: ['']
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      await user.click(input)
      await user.type(input, '38,-77')
      await user.tab(input)

      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
      expect(zustandState.query.changeQuery).toHaveBeenCalledWith({ collection: { spatial: { point: ['-77,38'] } } })
    })

    test('changing bounding box search updates the state', async () => {
      const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat

      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                boundingBox: [newBoundingBox]
              }
            }
          }
        }
      })

      const swPoint = screen.getByTestId('spatial-display_southwest-point')

      await user.clear(swPoint)
      await user.click(swPoint)
      await user.type(swPoint, '10,20')

      const updatedSwPoint = screen.getByTestId('spatial-display_southwest-point')
      expect(updatedSwPoint.value).toEqual('10,20')

      const nePoint = screen.getByTestId('spatial-display_northeast-point')

      await user.clear(nePoint)
      await user.click(nePoint)
      await user.type(nePoint, '30,40')

      const updatedNePoint = screen.getByTestId('spatial-display_northeast-point')
      expect(updatedNePoint.value).toEqual('30,40')
    })

    test('submitting bounding box search calls onChangeQuery', async () => {
      const swPoint = '10,20'
      const nePoint = '30,40'

      const boundingBox = `${swPoint},${nePoint}` // Lon,Lat,Lon,Lat

      const { user, zustandState } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                boundingBox: [boundingBox]
              }
            }
          }
        }
      })

      const swInput = screen.getByTestId('spatial-display_southwest-point')

      const newSwPoint = '15,25'
      await user.clear(swInput)
      await user.click(swInput)
      await user.type(swInput, newSwPoint)

      const neInput = screen.getByTestId('spatial-display_northeast-point')

      const newNePoint = '35,45'
      await user.clear(neInput)
      await user.click(neInput)
      await user.type(neInput, newNePoint)
      await user.type(neInput, '{enter}')

      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(2)
      expect(zustandState.query.changeQuery).toHaveBeenCalledWith({ collection: { spatial: { boundingBox: ['25,15,45,35'] } } })
    })

    test('changing circle search updates the state', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                circle: ['0,0,0']
              }
            }
          }
        }
      })

      const centerInput = screen.getByTestId('spatial-display_circle-center')

      await user.clear(centerInput)
      await user.click(centerInput)
      await user.type(centerInput, '38,-77')

      const updatedCenterInput = screen.getByTestId('spatial-display_circle-center')

      expect(updatedCenterInput.value).toEqual('38,-77')

      const radiusInput = screen.getByTestId('spatial-display_circle-radius')

      await user.clear(radiusInput)
      await user.click(radiusInput)
      await user.type(radiusInput, '10000')

      const updatedRadiusInput = screen.getByTestId('spatial-display_circle-radius')
      expect(updatedRadiusInput.value).toEqual('10000')
    })

    test('submitting circle search calls onChangeQuery', async () => {
      const newCircle = '-77.119759,38.791645,20000'

      const center = '38,-77'
      const radius = '10000'

      const { user, zustandState } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                circle: [newCircle]
              }
            }
          }
        }
      })

      const centerInput = screen.getByTestId('spatial-display_circle-center')

      await user.clear(centerInput)
      await user.click(centerInput)
      await user.type(centerInput, center)

      const radiusInput = screen.getByTestId('spatial-display_circle-radius')

      await user.clear(radiusInput)
      await user.click(radiusInput)
      await user.type(radiusInput, radius)
      await user.type(radiusInput, '{enter}')

      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(2)
      expect(zustandState.query.changeQuery).toHaveBeenCalledWith({ collection: { spatial: { circle: ['-77,38,10000'] } } })
    })
  })

  describe('#trimCoordinate', () => {
    test('returns the input trimmed', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: ['']
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = '45.60161000002, -94.60986000001'

      await user.click(input)
      await user.type(input, inputVal)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual('45.60161,-94.60986')
    })

    test('returns the input if no match was found', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: ['']
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = 'test'

      await user.click(input)
      await user.type(input, inputVal)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })
  })

  describe('#validateCoordinate', () => {
    test('returns an empty string if no coordinate is provided', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: ['']
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = ''

      await user.click(input)
      await user.type(input, '123')
      // Clears the input so that effectively no coordinate is provided
      await user.clear(input)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })

    test('returns no error with a valid coordinate', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: ['']
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = '0,0'

      await user.click(input)
      await user.type(input, inputVal)
      // Clears the input so that effectively no coordinate is provided

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })

    test('returns an error for a coordinate with too many decimal places', async () => {
      const inputVal = '0,0.123456'

      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: [inputVal]
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      expect(screen.getByText('Coordinates (0.123456,0) must use \'lat,lon\' format with up to 5 decimal place(s)')).toBeInTheDocument()
    })

    // Lat and lon are reversed
    test('returns an error for a coordinate an invalid latitude', () => {
      const inputVal = '0,95'

      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: [inputVal]
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      expect(screen.getByText('Latitude (95) must be between -90 and 90.')).toBeInTheDocument()
    })

    test('returns an error for a coordinate an invalid longitude', () => {
      const inputVal = '190,0'

      setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                point: [inputVal]
              }
            }
          }
        }
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      expect(screen.getByText('Longitude (190) must be between -180 and 180.')).toBeInTheDocument()
    })
  })

  describe('#validateBoundingBoxCoordinates', () => {
    test('returns an error coordinates match each other.', async () => {
      const inputVal = '38.791,-77.119'

      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                boundingBox: ['0,0,0,0']
              }
            }
          }
        }
      })

      const swInput = screen.queryByTestId('spatial-display_southwest-point')
      await user.clear(swInput)
      await user.click(swInput)
      await user.type(swInput, inputVal)

      const neInput = screen.queryByTestId('spatial-display_northeast-point')
      await user.clear(neInput)
      await user.click(neInput)
      await user.type(neInput, inputVal)

      const updatedSwInput = screen.queryByTestId('spatial-display_southwest-point')
      const updatedNeInput = screen.queryByTestId('spatial-display_northeast-point')

      expect(updatedSwInput.value).toEqual(inputVal)
      expect(updatedNeInput.value).toEqual(inputVal)

      expect(screen.getByText('SW and NE points contain matching coordinates. Please use point selection instead.')).toBeInTheDocument()
    })

    test('returns an error coordinates match each other and are invalid coordinates', async () => {
      const inputVal = '-91.119,38.791'

      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              spatial: {
                boundingBox: ['0,0,0,0']
              }
            }
          }
        }
      })

      const swInput = screen.queryByTestId('spatial-display_southwest-point')
      await user.clear(swInput)
      await user.click(swInput)
      await user.type(swInput, inputVal)

      const neInput = screen.queryByTestId('spatial-display_northeast-point')
      await user.clear(neInput)
      await user.click(neInput)
      await user.type(neInput, inputVal)

      const updatedSwInput = screen.queryByTestId('spatial-display_southwest-point')
      const updatedNeInput = screen.queryByTestId('spatial-display_northeast-point')

      expect(updatedSwInput.value).toEqual(inputVal)
      expect(updatedNeInput.value).toEqual(inputVal)

      expect(screen.getByText('Latitude (-91.119) must be between -90 and 90. SW and NE points contain matching coordinates. Please use point selection instead.')).toBeInTheDocument()
    })
  })
})
