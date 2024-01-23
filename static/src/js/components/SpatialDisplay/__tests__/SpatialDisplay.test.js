import React from 'react'
import Enzyme, { shallow } from 'enzyme'

import {
  act,
  render,
  screen
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaCrop } from 'react-icons/fa'

import SpatialDisplay from '../SpatialDisplay'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import FilterStackContents from '../../FilterStack/FilterStackContents'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (overrides) => {
  const {
    overrideMetadata = {},
    overrideProps = {}
  } = overrides || {}

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

  const enzymeWrapper = shallow(<SpatialDisplay {...props} />)

  act(() => {
    render(<SpatialDisplay {...props} />)
  })

  return {
    enzymeWrapper,
    props,
    onChangeQuery,
    onRemoveSpatialFilter
  }
}

describe('SpatialDisplay component', () => {
  describe('with no props', () => {
    test('should render self without display', () => {
      setup()
      expect(screen.queryAllByText('Spatial')).toHaveLength(2)
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
      expect(screen.queryAllByText('Spatial')).toHaveLength(0)

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


      // test('should render without a loading spinner', () => {
      //   expect(screen.getAllByTestId('spatial-display__loading')).toHaveLength(0)
      // })

      // test('should render without spatial info', () => {
      //   expect(screen.queryAllByText('test file')).toHaveLength(0)
      //   expect(screen.queryAllByText('(42 KB)')).toHaveLength(0)
      // })
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

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().pointSearch).toEqual(undefined)
    const newPoint = '0,0'
    enzymeWrapper.setProps({ pointSearch: [newPoint] })
    expect(enzymeWrapper.state().pointSearch).toEqual(newPoint)
  })

  describe('#onSpatialRemove', () => {
    test('calls onRemoveSpatialFilter', async () => {
      userEvent.setup()

      const { props } = setup({
        manuallyEntering: 'marker',
        pointSearch: ['0,0']
      })

      const { onRemoveSpatialFilter } = props

      console.log(screen.debug())
      const actionBtns = screen.queryAllByTestId('filter-stack-item__action-button')
      const actionBtn = actionBtns[0]
      const filterStackSpatial = screen.queryAllByTestId('filter-stack__spatial')
      console.log(actionBtns)
      console.log(actionBtn)
      expect(actionBtns).toHaveLength(1)

      userEvent.click(actionBtn)

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
        pointSearch: '',
        // error: ''
      })

      const input = screen.queryByTestId('spatial-display_point')

      await userEvent.click(input)
      await userEvent.type(input, '38,-77')

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { point: ['-77,38'] } } })
    })

    test('changing bounding box search updates the state', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ manuallyEntering: 'rectangle' })

      enzymeWrapper.instance().onChangeBoundingBoxSearch({
        target: {
          value: '10,20',
          name: 'swPoint'
        }
      })

      expect(enzymeWrapper.state().boundingBoxSearch).toEqual(['10,20', ''])
      expect(enzymeWrapper.state().error).toEqual('')

      enzymeWrapper.instance().onChangeBoundingBoxSearch({
        target: {
          value: '30,40',
          name: 'nePoint'
        }
      })

      expect(enzymeWrapper.state().boundingBoxSearch).toEqual(['10,20', '30,40'])
      expect(enzymeWrapper.state().error).toEqual('')
    })

    test('submitting bounding box search calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setState({
        manuallyEntering: 'rectangle',
        boundingBoxSearch: ['10,20', '30,40'],
        // error: ''
      })

      enzymeWrapper.instance().onSubmitBoundingBoxSearch({
        type: 'blur',
        preventDefault: jest.fn()
      })

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { boundingBox: ['20,10,40,30'] } } })
    })

    test('changing circle search updates the state', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ manuallyEntering: 'circle' })

      enzymeWrapper.instance().onChangeCircleCenter({ target: { value: '38,-77' } })
      expect(enzymeWrapper.state().circleSearch).toEqual(['38,-77', ''])
      expect(enzymeWrapper.state().error).toEqual('')

      enzymeWrapper.instance().onChangeCircleRadius({ target: { value: '10000' } })
      expect(enzymeWrapper.state().circleSearch).toEqual(['38,-77', '10000'])
      expect(enzymeWrapper.state().error).toEqual('')
    })

    test('submitting circle search calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setState({
        manuallyEntering: 'circle',
        circleSearch: ['38,-77', '10000'],
        // error: ''
      })

      enzymeWrapper.instance().onSubmitCircleSearch({
        type: 'blur',
        preventDefault: jest.fn()
      })

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { circle: ['-77,38,10000'] } } })
    })
  })

  describe('#trimCoordinate', () => {
    test('returns the input trimmed', () => {
      const { enzymeWrapper } = setup()

      const input = '45.60161000002, -94.60986000001'

      const result = enzymeWrapper.instance().trimCoordinate(input)

      expect(result).toEqual('45.60161,-94.60986')
    })

    test('returns the input if no match was found', () => {
      const { enzymeWrapper } = setup()

      const input = 'test'

      const result = enzymeWrapper.instance().trimCoordinate(input)

      expect(result).toEqual(input)
    })
  })

  describe('#onFocusSpatialSearch', () => {
    test('focusing the point field sets the manuallyEntering state', () => {
      const { enzymeWrapper } = setup()

      const newPoint = '-77.0418825,38.805869' // Lon,Lat
      enzymeWrapper.setProps({ pointSearch: [newPoint] })

      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      const input = filterStackContents.props()
        .body.props.children.props.children.props.children[1].props.children

      input.props.onFocus()

      expect(enzymeWrapper.state().manuallyEntering).toEqual('marker')
    })

    test('focusing the bounding box SW field sets the manuallyEntering state', () => {
      const { enzymeWrapper } = setup()

      const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
      enzymeWrapper.setProps({ boundingBoxSearch: [newBoundingBox] })

      const filterStackContents = enzymeWrapper.find(FilterStackContents)
      const sw = filterStackContents.props().body.props.children.props.children[0]
      const swInput = sw.props.children[1].props.children

      swInput.props.onFocus()

      expect(enzymeWrapper.state().manuallyEntering).toEqual('rectangle')
    })

    test('focusing the bounding box NE field sets the manuallyEntering state', () => {
      const { enzymeWrapper } = setup()

      const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
      enzymeWrapper.setProps({ boundingBoxSearch: [newBoundingBox] })

      const filterStackContents = enzymeWrapper.find(FilterStackContents)
      const ne = filterStackContents.props().body.props.children.props.children[1]
      const neInput = ne.props.children[1].props.children

      neInput.props.onFocus()

      expect(enzymeWrapper.state().manuallyEntering).toEqual('rectangle')
    })

    test('focusing the circle center field sets the manuallyEntering state', () => {
      const { enzymeWrapper } = setup()

      const newCircle = '-77.119759,38.791645,20000'
      enzymeWrapper.setProps({ circleSearch: [newCircle] })

      const filterStackContents = enzymeWrapper.find(FilterStackContents)
      const center = filterStackContents.props().body.props.children.props.children[0]
      const centerInput = center.props.children[1].props.children

      centerInput.props.onFocus()

      expect(enzymeWrapper.state().manuallyEntering).toEqual('circle')
    })

    test('focusing the circle radius field sets the manuallyEntering state', () => {
      const { enzymeWrapper } = setup()

      const newCircle = '-77.119759,38.791645,20000'
      enzymeWrapper.setProps({ circleSearch: [newCircle] })

      const filterStackContents = enzymeWrapper.find(FilterStackContents)
      const radius = filterStackContents.props().body.props.children.props.children[1]
      const radiusInput = radius.props.children[1].props.children

      radiusInput.props.onFocus()

      expect(enzymeWrapper.state().manuallyEntering).toEqual('circle')
    })
  })

  describe('#validateCoordinate', () => {
    test('returns an empty string if no coordinate is provided', () => {
      const { enzymeWrapper } = setup()

      const input = ''

      const result = enzymeWrapper.instance().validateCoordinate(input)

      expect(result).toEqual(input)
    })

    test('returns no error with a valid coordinate', () => {
      const { enzymeWrapper } = setup()

      const input = '0,0'

      const result = enzymeWrapper.instance().validateCoordinate(input)

      expect(result).toEqual('')
    })

    test('returns an error for a coordinate with too many decimal places', () => {
      const { enzymeWrapper } = setup()

      const input = '0,0.123456'

      const result = enzymeWrapper.instance().validateCoordinate(input)

      expect(result).toEqual('Coordinates (0,0.123456) must use \'lat,lon\' format with up to 5 decimal place(s)')
    })

    test('returns an error for a coordinate an invalid latitude', () => {
      const { enzymeWrapper } = setup()

      const input = '95,0'

      const result = enzymeWrapper.instance().validateCoordinate(input)

      expect(result).toEqual('Latitude (95) must be between -90 and 90.')
    })

    test('returns an error for a coordinate an invalid longitude', () => {
      const { enzymeWrapper } = setup()

      const input = '0,190'

      const result = enzymeWrapper.instance().validateCoordinate(input)

      expect(result).toEqual('Longitude (190) must be between -180 and 180.')
    })
  })

  describe('#validateBoundingBoxCoordinates', () => {
    test('returns an error coordinates match each other.', () => {
      const { enzymeWrapper } = setup()
      const input = '-77.119,38.791'

      const boundingBoxResult = enzymeWrapper.instance()
        .validateBoundingBoxCoordinates([input, input])

      expect(boundingBoxResult).toEqual('SW and NE points contain matching coordinates. Please use point selection instead.')
    })

    test('returns an error coordinates match each other and are invalid coordinates', () => {
      const { enzymeWrapper } = setup()
      const input = '-91.119,38.791'

      const boundingBoxResult = enzymeWrapper.instance()
        .validateBoundingBoxCoordinates([input, input])

      expect(boundingBoxResult).toEqual('Latitude (-91.119) must be between -90 and 90. SW and NE points contain matching coordinates. Please use point selection instead.')
    })
  })
})
