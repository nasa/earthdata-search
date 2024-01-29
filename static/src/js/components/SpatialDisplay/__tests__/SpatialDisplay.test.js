import React from 'react'

import {
  act,
  render,
  screen
} from '@testing-library/react'

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

  act(() => {
    render(<SpatialDisplay {...props} />)
  })

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

      screen.debug()
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

      screen.debug()
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

      screen.debug()
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

        screen.debug()
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

          expect(screen.queryAllByTestId('filter-stack-item__error')[0].innerHTML).toEqual('To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.')
        })
      })
    })
  })

  describe('#onSpatialRemove', () => {
    test('calls onRemoveSpatialFilter', async () => {
      userEvent.setup()

      const { props } = setup({
        manuallyEntering: 'marker'
      })

      const { onRemoveSpatialFilter } = props

      const actionBtns = screen.queryAllByTestId('filter-stack-item__action-button')
      const actionBtn = actionBtns[0]
      expect(actionBtns).toHaveLength(1)

      await userEvent.click(actionBtn)

      expect(onRemoveSpatialFilter).toHaveBeenCalledTimes(1)
    })
  })

  describe('manual entry of spatial values', () => {
    test('changing point search updates the state', async () => {
      // TODO: vlaue gets lon,lat values are flipped in props
      setup({
        manuallyEntering: 'marker',
        pointSearch: [' ']
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
        manuallyEntering: 'marker',
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

      setup({ manuallyEntering: 'rectangle' })
      const swPoint = screen.getByTestId('spatial-display_southwest-point')

      await userEvent.click(swPoint)
      await userEvent.type(swPoint, '10,20')

      const updatedSwPoint = screen.getByTestId('spatial-display_southwest-point')
      expect(updatedSwPoint.value).toEqual('10,20')
      expect(screen.queryAllByTestId('filter-stack-item__error')).toHaveLength(0)

      const nePoint = screen.getByTestId('spatial-display_northeast-point')

      await userEvent.click(nePoint)
      await userEvent.type(nePoint, '30,40')

      const updatedNePoint = screen.getByTestId('spatial-display_northeast-point')
      expect(updatedNePoint.value).toEqual('30,40')
      expect(screen.queryAllByTestId('filter-stack-item__error')).toHaveLength(0)
    })

    test('submitting bounding box search calls onChangeQuery', async () => {
      userEvent.setup()

      const swPoint = '10,20'
      const nePoint = '30,40'

      const { props } = setup({
        manuallyEntering: 'rectangle'
      })
      const { onChangeQuery } = props
      const swInput = screen.getByTestId('spatial-display_southwest-point')

      await userEvent.click(swInput)
      await userEvent.type(swInput, swPoint)

      const neInput = screen.getByTestId('spatial-display_northeast-point')

      await userEvent.click(neInput)
      await userEvent.type(neInput, nePoint)
      await userEvent.type(neInput, '{enter}')

      expect(onChangeQuery).toHaveBeenCalledTimes(1)
      expect(onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { boundingBox: ['20,10,40,30'] } } })
    })

    test('changing circle search updates the state', async () => {
      userEvent.setup()
      setup({
        manuallyEntering: 'circle'
      })

      const centerInput = screen.getByTestId('spatial-display_circle-center')

      await userEvent.click(centerInput)
      await userEvent.type(centerInput, '38,-77')

      const updatedCenterInput = screen.getByTestId('spatial-display_circle-center')

      expect(updatedCenterInput.value).toEqual('38,-77')
      expect(screen.queryAllByTestId('filter-stack-item__error')).toHaveLength(0)

      const radiusInput = screen.getByTestId('spatial-display_circle-radius')

      await userEvent.click(radiusInput)
      await userEvent.type(radiusInput, '10000')

      const updatedRadiusInput = screen.getByTestId('spatial-display_circle-radius')
      expect(updatedRadiusInput.value).toEqual('10000')

      expect(screen.queryAllByTestId('filter-stack-item__error')).toHaveLength(0)
    })

    test('submitting circle search calls onChangeQuery', async () => {
      userEvent.setup()

      const center = '38,-77'
      const radius = '10000'

      const { props } = setup({
        manuallyEntering: 'circle'
      })

      const { onChangeQuery } = props
      const centerInput = screen.getByTestId('spatial-display_circle-center')

      await userEvent.click(centerInput)
      await userEvent.type(centerInput, center)

      const radiusInput = screen.getByTestId('spatial-display_circle-radius')

      await userEvent.click(radiusInput)
      await userEvent.type(radiusInput, radius)
      await userEvent.type(radiusInput, '{enter}')

      expect(onChangeQuery).toHaveBeenCalledTimes(1)
      expect(onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { circle: ['-77,38,10000'] } } })
    })
  })

  describe('#trimCoordinate', () => {
    test('returns the input trimmed', async () => {
      userEvent.setup()

      setup({ manuallyEntering: 'marker' })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = '45.60161000002, -94.60986000001'

      await userEvent.click(input)
      await userEvent.type(input, inputVal)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual('45.60161,-94.60986')
    })

    test('returns the input if no match was found', async () => {
      userEvent.setup()

      setup({ manuallyEntering: 'marker' })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = 'test'

      await userEvent.click(input)
      await userEvent.type(input, inputVal)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)
    })
  })

  describe('#onFocusSpatialSearch', () => {
    // Not sure how to reproduce thist test in RTL.
    // perhaps checking that on focus and clearing
    // test.skip('focusing the point field sets the manuallyEntering state', () => {
    //   const newPoint = '-77.0418825,38.805869' // Lon,Lat
    //   setup({
    //     pointSearch: [newPoint]
    //   })

    //   enzymeWrapper.setProps({ pointSearch: [newPoint] })

    //   const filterStackContents = enzymeWrapper.find(FilterStackContents)

    //   const input = filterStackContents.props()
    //     .body.props.children.props.children.props.children[1].props.children

    //   input.props.onFocus()

    //   expect(enzymeWrapper.state().manuallyEntering).toEqual('marker')
    // })

    // Not sure how to reproduce thist test in RTL.
    // perhaps checking that on focus and clearing
    // test.skip('focusing the bounding box SW field sets the manuallyEntering state', () => {
    //   const { enzymeWrapper } = setup()

    //   const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
    //   enzymeWrapper.setProps({ boundingBoxSearch: [newBoundingBox] })

    //   const filterStackContents = enzymeWrapper.find(FilterStackContents)
    //   const sw = filterStackContents.props().body.props.children.props.children[0]
    //   const swInput = sw.props.children[1].props.children

    //   swInput.props.onFocus()

    //   expect(enzymeWrapper.state().manuallyEntering).toEqual('rectangle')
    // })

    // Not sure how to reproduce thist test in RTL.
    // perhaps checking that on focus and clearing
    // test.skip('focusing the bounding box NE field sets the manuallyEntering state', () => {
    //   const { enzymeWrapper } = setup()

    //   const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
    //   enzymeWrapper.setProps({ boundingBoxSearch: [newBoundingBox] })

    //   const filterStackContents = enzymeWrapper.find(FilterStackContents)
    //   const ne = filterStackContents.props().body.props.children.props.children[1]
    //   const neInput = ne.props.children[1].props.children

    //   neInput.props.onFocus()

    //   expect(enzymeWrapper.state().manuallyEntering).toEqual('rectangle')
    // })

    // Not sure how to reproduce thist test in RTL.
    // perhaps checking that on focus and clearing
    // test.skip('focusing the circle center field sets the manuallyEntering state', () => {
    //   const { enzymeWrapper } = setup()

    //   const newCircle = '-77.119759,38.791645,20000'
    //   enzymeWrapper.setProps({ circleSearch: [newCircle] })

    //   const filterStackContents = enzymeWrapper.find(FilterStackContents)
    //   const center = filterStackContents.props().body.props.children.props.children[0]
    //   const centerInput = center.props.children[1].props.children

    //   centerInput.props.onFocus()

    //   expect(enzymeWrapper.state().manuallyEntering).toEqual('circle')
    // })

    // Not sure how to reproduce thist test in RTL.
    // perhaps checking that on focus and clearing
    // test.skip('focusing the circle radius field sets the manuallyEntering state', () => {
    //   const { enzymeWrapper } = setup()

    //   const newCircle = '-77.119759,38.791645,20000'
    //   enzymeWrapper.setProps({ circleSearch: [newCircle] })

    //   const filterStackContents = enzymeWrapper.find(FilterStackContents)
    //   const radius = filterStackContents.props().body.props.children.props.children[1]
    //   const radiusInput = radius.props.children[1].props.children

    //   radiusInput.props.onFocus()

    //   expect(enzymeWrapper.state().manuallyEntering).toEqual('circle')
    // })
  })

  describe('#validateCoordinate', () => {
    test('returns an empty string if no coordinate is provided', async () => {
      userEvent.setup()

      setup({ manuallyEntering: 'marker' })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = ''

      await userEvent.click(input)
      await userEvent.type(input, '123')
      // Clears the input so that effectively no coordinate is provided
      await userEvent.clear(input)

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)

      expect(screen.queryAllByTestId('filter-stack-item__error')).toHaveLength(0)
    })

    test('returns no error with a valid coordinate', async () => {
      userEvent.setup()

      setup({ manuallyEntering: 'marker' })

      const input = screen.queryByTestId('spatial-display_point')

      const inputVal = '0,0'

      await userEvent.click(input)
      await userEvent.type(input, inputVal)
      // Clears the input so that effectively no coordinate is provided

      const updatedInput = screen.queryByTestId('spatial-display_point')

      expect(updatedInput.value).toEqual(inputVal)

      expect(screen.queryAllByTestId('filter-stack-item__error')).toHaveLength(0)
    })

    test('returns an error for a coordinate with too many decimal places', async () => {
      const inputVal = '0,0.123456'

      setup({
        manuallyEntering: 'marker',
        pointSearch: [inputVal]
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      const errors = screen.queryAllByTestId('filter-stack-item__error')

      expect(errors).toHaveLength(1)
      expect(errors[0].innerHTML).toEqual('Coordinates (0.123456,0) must use \'lat,lon\' format with up to 5 decimal place(s)')
    })

    // Lat and lon are reversed
    test('returns an error for a coordinate an invalid latitude', () => {
      const inputVal = '0,95'

      setup({
        manuallyEntering: 'marker',
        pointSearch: [inputVal]
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      const errors = screen.queryAllByTestId('filter-stack-item__error')
      expect(errors).toHaveLength(1)

      expect(errors[0].innerHTML).toEqual('Latitude (95) must be between -90 and 90.')
    })

    test('returns an error for a coordinate an invalid longitude', () => {
      const inputVal = '190,0'

      setup({
        manuallyEntering: 'marker',
        pointSearch: [inputVal]
      })

      const input = screen.queryByTestId('spatial-display_point')

      expect(input.value).toEqual(inputVal.split(',').reverse().join(','))

      const errors = screen.queryAllByTestId('filter-stack-item__error')
      expect(errors).toHaveLength(1)

      expect(errors[0].innerHTML).toEqual('Longitude (190) must be between -180 and 180.')
    })
  })

  describe('#validateBoundingBoxCoordinates', () => {
    test('returns an error coordinates match each other.', async () => {
      userEvent.setup()

      const inputVal = '38.791,-77.119'

      setup({
        manuallyEntering: 'rectangle'
      })

      const swInput = screen.queryByTestId('spatial-display_southwest-point')
      await userEvent.click(swInput)
      await userEvent.type(swInput, inputVal)

      const neInput = screen.queryByTestId('spatial-display_northeast-point')
      await userEvent.click(neInput)
      await userEvent.type(neInput, inputVal)

      const updatedSwInput = screen.queryByTestId('spatial-display_southwest-point')
      const updatedNeInput = screen.queryByTestId('spatial-display_northeast-point')

      expect(updatedSwInput.value).toEqual(inputVal)
      expect(updatedNeInput.value).toEqual(inputVal)

      const errors = screen.queryAllByTestId('filter-stack-item__error')
      expect(errors).toHaveLength(1)

      expect(errors[0].innerHTML).toEqual('SW and NE points contain matching coordinates. Please use point selection instead.')
    })

    test('returns an error coordinates match each other and are invalid coordinates', async () => {
      userEvent.setup()

      const inputVal = '-91.119,38.791'

      setup({
        manuallyEntering: 'rectangle'
      })

      const swInput = screen.queryByTestId('spatial-display_southwest-point')
      await userEvent.click(swInput)
      await userEvent.type(swInput, inputVal)

      const neInput = screen.queryByTestId('spatial-display_northeast-point')
      await userEvent.click(neInput)
      await userEvent.type(neInput, inputVal)

      const updatedSwInput = screen.queryByTestId('spatial-display_southwest-point')
      const updatedNeInput = screen.queryByTestId('spatial-display_northeast-point')

      expect(updatedSwInput.value).toEqual(inputVal)
      expect(updatedNeInput.value).toEqual(inputVal)

      const errors = screen.queryAllByTestId('filter-stack-item__error')
      expect(errors).toHaveLength(1)

      expect(errors[0].innerHTML).toEqual('Latitude (-91.119) must be between -90 and 90. SW and NE points contain matching coordinates. Please use point selection instead.')
    })
  })
})
