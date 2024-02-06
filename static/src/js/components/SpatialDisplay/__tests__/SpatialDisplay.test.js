import React from 'react'

import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import SpatialDisplay from '../SpatialDisplay'

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (overrides) => {
  const onChangeQuery = jest.fn()
  const onRemoveSpatialFilter = jest.fn()

  const props = {
    boundingBoxSearch: [],
    circleSearch: [],
    displaySpatialPolygonWarning: false,
    drawingNewLayer: false,
    lineSearch: [],
    pointSearch: [],
    polygonSearch: [],
    onChangeQuery,
    onRemoveSpatialFilter,
    manuallyEntering: '',
    shapefile: {},
    ...overrides
  }

  render(<SpatialDisplay {...props} />)

  return {
    props
  }
}

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
      setup({ pointSearch: [newPoint] })

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
      setup({ boundingBoxSearch: [newBoundingBox] })

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
      setup({ circleSearch: [newCircle] })

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

      setup({ polygonSearch: [newPolygon] })

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
      setup({ drawingNewLayer: 'polygon' })

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
        displaySpatialPolygonWarning: true,
        polygonSearch: [newPolygon]
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

      setup({ lineSearch: [line] })
      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
      // This is hidden and should not show up
      expect(screen.queryAllByText('Line')).toHaveLength(0)
    })
  })

  describe('with shapefile', () => {
    describe('when the shapefile is loading', () => {
      test('should render with a loading spinner', () => {
        setup({
          shapefile: {
            shapefileName: 'test file',
            shapefileSize: '',
            isLoaded: false,
            isLoading: true
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
          polygonSearch: [newPolygon],
          shapefile: {
            shapefileName: 'test file',
            shapefileSize: '42 KB',
            isLoaded: true,
            isLoading: false
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
            polygonSearch: [newPolygon],
            shapefile: {
              shapefileName: 'test file',
              shapefileSize: '42 KB',
              isLoaded: true,
              isLoading: false,
              selectedFeatures: ['1']
            }
          })

          expect(screen.queryAllByText('1 shape selected')).toHaveLength(1)
        })
      })

      describe('when the shapefile is the wrong type', () => {
        test('should render an upload hint with number of shapes selected', () => {
          setup({
            shapefile: {
              shapefileName: 'test file',
              shapefileSize: '42 KB',
              isErrored: {
                type: 'upload_shape'
              }
            }
          })

          expect(screen.getByText('To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.')).toBeInTheDocument()
        })
      })
    })
  })

  describe('#onSpatialRemove', () => {
    test('calls onRemoveSpatialFilter', async () => {
      userEvent.setup()

      const { props } = setup({ pointSearch: [' '] })

      const { onRemoveSpatialFilter } = props

      const actionBtns = screen.getAllByRole('button')
      const actionBtn = actionBtns[0]
      expect(actionBtns).toHaveLength(1)

      await userEvent.click(actionBtn)

      expect(onRemoveSpatialFilter).toHaveBeenCalledTimes(1)
    })
  })

  describe('manual entry of spatial values', () => {
    test('changing point search updates the state', async () => {
      setup({
        pointSearch: ['']
      })

      userEvent.setup()

      const input = screen.queryByTestId('spatial-display_point')

      await userEvent.click(input)
      await userEvent.type(input, '38,-77')

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual('38,-77')
    })

    test('submitting point search calls onChangeQuery', async () => {
      userEvent.setup()

      const { props } = setup({
        pointSearch: ['']
      })
      const { onChangeQuery } = props

      const input = screen.queryByTestId('spatial-display_point')

      await userEvent.click(input)
      await userEvent.type(input, '38,-77')
      await userEvent.tab(input)

      expect(onChangeQuery).toHaveBeenCalledTimes(1)
      expect(onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { point: ['-77,38'] } } })
    })

    test('changing bounding box search updates the state', async () => {
      userEvent.setup()
      const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat

      setup({ boundingBoxSearch: [newBoundingBox] })

      const swPoint = screen.getByTestId('spatial-display_southwest-point')

      await userEvent.clear(swPoint)
      await userEvent.click(swPoint)
      await userEvent.type(swPoint, '10,20')

      const updatedSwPoint = screen.getByTestId('spatial-display_southwest-point')
      expect(updatedSwPoint.value).toEqual('10,20')

      const nePoint = screen.getByTestId('spatial-display_northeast-point')

      await userEvent.clear(nePoint)
      await userEvent.click(nePoint)
      await userEvent.type(nePoint, '30,40')

      const updatedNePoint = screen.getByTestId('spatial-display_northeast-point')
      expect(updatedNePoint.value).toEqual('30,40')
    })

    test('submitting bounding box search calls onChangeQuery', async () => {
      userEvent.setup()

      const swPoint = '10,20'
      const nePoint = '30,40'

      const boundingBox = `${swPoint},${nePoint}` // Lon,Lat,Lon,Lat

      const { props } = setup({
        boundingBoxSearch: [boundingBox]
      })

      const { onChangeQuery } = props
      const swInput = screen.getByTestId('spatial-display_southwest-point')

      const newSwPoint = '15,25'
      await userEvent.clear(swInput)
      await userEvent.click(swInput)
      await userEvent.type(swInput, newSwPoint)

      const neInput = screen.getByTestId('spatial-display_northeast-point')

      const newNePoint = '35,45'
      await userEvent.clear(neInput)
      await userEvent.click(neInput)
      await userEvent.type(neInput, newNePoint)
      await userEvent.type(neInput, '{enter}')

      expect(onChangeQuery).toHaveBeenCalledTimes(2)
      expect(onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { boundingBox: ['25,15,45,35'] } } })
    })

    test('changing circle search updates the state', async () => {
      userEvent.setup()
      setup({
        circleSearch: ['0,0,0']
      })

      const centerInput = screen.getByTestId('spatial-display_circle-center')

      await userEvent.clear(centerInput)
      await userEvent.click(centerInput)
      await userEvent.type(centerInput, '38,-77')

      const updatedCenterInput = screen.getByTestId('spatial-display_circle-center')

      expect(updatedCenterInput.value).toEqual('38,-77')

      const radiusInput = screen.getByTestId('spatial-display_circle-radius')

      await userEvent.clear(radiusInput)
      await userEvent.click(radiusInput)
      await userEvent.type(radiusInput, '10000')

      const updatedRadiusInput = screen.getByTestId('spatial-display_circle-radius')
      expect(updatedRadiusInput.value).toEqual('10000')
    })

    test('submitting circle search calls onChangeQuery', async () => {
      userEvent.setup()
      const newCircle = '-77.119759,38.791645,20000'

      const center = '38,-77'
      const radius = '10000'

      const { props } = setup({ circleSearch: [newCircle] })

      const { onChangeQuery } = props
      const centerInput = screen.getByTestId('spatial-display_circle-center')

      await userEvent.clear(centerInput)
      await userEvent.click(centerInput)
      await userEvent.type(centerInput, center)

      const radiusInput = screen.getByTestId('spatial-display_circle-radius')

      await userEvent.clear(radiusInput)
      await userEvent.click(radiusInput)
      await userEvent.type(radiusInput, radius)
      await userEvent.type(radiusInput, '{enter}')

      expect(onChangeQuery).toHaveBeenCalledTimes(2)
      expect(onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { circle: ['-77,38,10000'] } } })
    })
  })

  describe('#trimCoordinate', () => {
    test('returns the input trimmed', async () => {
      userEvent.setup()

      setup({ pointSearch: [''] })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = '45.60161000002, -94.60986000001'

      await userEvent.click(input)
      await userEvent.type(input, inputVal)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual('45.60161,-94.60986')
    })

    test('returns the input if no match was found', async () => {
      userEvent.setup()

      setup({ pointSearch: [''] })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = 'test'

      await userEvent.click(input)
      await userEvent.type(input, inputVal)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })
  })

  describe('#validateCoordinate', () => {
    test('returns an empty string if no coordinate is provided', async () => {
      userEvent.setup()

      setup({ pointSearch: [''] })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = ''

      await userEvent.click(input)
      await userEvent.type(input, '123')
      // Clears the input so that effectively no coordinate is provided
      await userEvent.clear(input)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })

    test('returns no error with a valid coordinate', async () => {
      userEvent.setup()

      setup({ pointSearch: [''] })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = '0,0'

      await userEvent.click(input)
      await userEvent.type(input, inputVal)
      // Clears the input so that effectively no coordinate is provided

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })

    test('returns an error for a coordinate with too many decimal places', async () => {
      const inputVal = '0,0.123456'

      setup({
        pointSearch: [inputVal]
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      expect(screen.getByText('Coordinates (0.123456,0) must use \'lat,lon\' format with up to 5 decimal place(s)')).toBeInTheDocument()
    })

    // Lat and lon are reversed
    test('returns an error for a coordinate an invalid latitude', () => {
      const inputVal = '0,95'

      setup({
        pointSearch: [inputVal]
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      expect(screen.getByText('Latitude (95) must be between -90 and 90.')).toBeInTheDocument()
    })

    test('returns an error for a coordinate an invalid longitude', () => {
      const inputVal = '190,0'

      setup({
        pointSearch: [inputVal]
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      expect(screen.getByText('Longitude (190) must be between -180 and 180.')).toBeInTheDocument()
    })
  })

  describe('#validateBoundingBoxCoordinates', () => {
    test('returns an error coordinates match each other.', async () => {
      userEvent.setup()

      const inputVal = '38.791,-77.119'

      setup({
        boundingBoxSearch: ['0,0,0,0']
      })

      const swInput = screen.queryByTestId('spatial-display_southwest-point')
      await userEvent.clear(swInput)
      await userEvent.click(swInput)
      await userEvent.type(swInput, inputVal)

      const neInput = screen.queryByTestId('spatial-display_northeast-point')
      await userEvent.clear(neInput)
      await userEvent.click(neInput)
      await userEvent.type(neInput, inputVal)

      const updatedSwInput = screen.queryByTestId('spatial-display_southwest-point')
      const updatedNeInput = screen.queryByTestId('spatial-display_northeast-point')

      expect(updatedSwInput.value).toEqual(inputVal)
      expect(updatedNeInput.value).toEqual(inputVal)

      expect(screen.getByText('SW and NE points contain matching coordinates. Please use point selection instead.')).toBeInTheDocument()
    })

    test('returns an error coordinates match each other and are invalid coordinates', async () => {
      userEvent.setup()

      const inputVal = '-91.119,38.791'

      setup({
        boundingBoxSearch: ['0,0,0,0']
      })

      const swInput = screen.queryByTestId('spatial-display_southwest-point')
      await userEvent.clear(swInput)
      await userEvent.click(swInput)
      await userEvent.type(swInput, inputVal)

      const neInput = screen.queryByTestId('spatial-display_northeast-point')
      await userEvent.clear(neInput)
      await userEvent.click(neInput)
      await userEvent.type(neInput, inputVal)

      const updatedSwInput = screen.queryByTestId('spatial-display_southwest-point')
      const updatedNeInput = screen.queryByTestId('spatial-display_northeast-point')

      expect(updatedSwInput.value).toEqual(inputVal)
      expect(updatedNeInput.value).toEqual(inputVal)

      expect(screen.getByText('Latitude (-91.119) must be between -90 and 90. SW and NE points contain matching coordinates. Please use point selection instead.')).toBeInTheDocument()
    })
  })
})
