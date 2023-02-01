import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FaCrop } from 'react-icons/fa'

import SpatialDisplay from '../SpatialDisplay'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import FilterStackContents from '../../FilterStack/FilterStackContents'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
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
  }

  const enzymeWrapper = shallow(<SpatialDisplay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialDisplay component', () => {
  describe('with no props', () => {
    test('should render self without display', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.type()).toBe(null)
    })
  })

  describe('with pointSearch', () => {
    test('should render the spatial info', () => {
      const { enzymeWrapper } = setup()
      const newPoint = '-77.0418825,38.805869' // Lon,Lat
      enzymeWrapper.setProps({ pointSearch: [newPoint] })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackContents.props().title).toEqual('Point')
      const label = filterStackContents.props().body.props.children.props.children.props.children[0]
      const input = filterStackContents.props().body.props.children.props.children.props.children[1]
      expect(label.props.children).toContain('Coordinates:') // Lat,Lon
      expect(input.props.children.props.value).toEqual('38.805869,-77.0418825') // Lat,Lon
    })
  })

  describe('with boundingBoxSearch', () => {
    test('should render the spatial info', () => {
      const { enzymeWrapper } = setup()
      const newBoundingBox = '-77.119759,38.791645,-76.909393,38.995845' // Lon,Lat,Lon,Lat
      enzymeWrapper.setProps({ boundingBoxSearch: [newBoundingBox] })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackContents.props().title).toEqual('Rectangle')

      const sw = filterStackContents.props().body.props.children.props.children[0]
      const swLabel = sw.props.children[0]
      const swInput = sw.props.children[1]
      expect(swLabel.props.children).toEqual('SW:')
      expect(swInput.props.children.props.value).toEqual('38.791645,-77.119759')

      const ne = filterStackContents.props().body.props.children.props.children[1]
      const neLabel = ne.props.children[0]
      const neInput = ne.props.children[1]
      expect(neLabel.props.children).toEqual('NE:')
      expect(neInput.props.children.props.value).toEqual('38.995845,-76.909393')
    })
  })

  describe('with circleSearch', () => {
    test('should render the spatial info', () => {
      const { enzymeWrapper } = setup()
      const newCircle = '-77.119759,38.791645,20000'
      enzymeWrapper.setProps({ circleSearch: [newCircle] })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackContents.props().title).toEqual('Circle')

      const center = filterStackContents.props().body.props.children.props.children[0]
      const centerLabel = center.props.children[0]
      const centerInput = center.props.children[1]
      expect(centerLabel.props.children).toEqual('Center:')
      expect(centerInput.props.children.props.value).toEqual('38.791645,-77.119759')

      const radius = filterStackContents.props().body.props.children.props.children[1]
      const radiusLabel = radius.props.children[0]
      const radiusInput = radius.props.children[1]
      expect(radiusLabel.props.children).toEqual('Radius (m):')
      expect(radiusInput.props.children.props.value).toEqual('20000')
    })
  })

  describe('with polygonSearch', () => {
    test('should render without spatial info', () => {
      const { enzymeWrapper } = setup()
      const newPolygon = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575,'
        + '-77.04444122314453,38.99228142151045'

      enzymeWrapper.setProps({ polygonSearch: [newPolygon] })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackContents.props().title).toEqual('Polygon')

      const pointCount = filterStackContents.props()
        .body.props.children.props.children.props.children
      expect(pointCount).toEqual('3 Points')
    })

    test('should render a hint to draw the polygon on the map', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({ drawingNewLayer: 'polygon' })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)

      expect(filterStackItem.props().hint).toEqual('Draw a polygon on the map to filter results')
    })
  })

  describe('with polygonSearch and displaySpatialPolygonWarning', () => {
    test('should render without spatial info and a warning', () => {
      const { enzymeWrapper } = setup()
      const newPolygon = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575,'
        + '-77.04444122314453,38.99228142151045'

      enzymeWrapper.setProps({
        displaySpatialPolygonWarning: true,
        polygonSearch: [newPolygon]
      })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackItem.props().error).toEqual('This collection does not support polygon search. Your polygon has been converted to a bounding box.')
      expect(filterStackContents.props().title).toEqual('Polygon')

      const pointCount = filterStackContents.props()
        .body.props.children.props.children.props.children
      expect(pointCount).toEqual('3 Points')
    })
  })

  describe('with lineSearch', () => {
    test('should render without spatial info', () => {
      const { enzymeWrapper } = setup()
      const line = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575'

      enzymeWrapper.setProps({ lineSearch: [line] })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackContents.props().title).toEqual('Line')
      expect(filterStackContents.props().body.props.children).toEqual(null)
    })
  })

  describe('with shapefile', () => {
    describe('when the shapefile is loading', () => {
      test('should render with a loading spinner', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.setProps({
          shapefile: {
            shapefileName: 'test file',
            shapefileSize: '',
            isLoaded: false,
            isLoading: true
          }
        })

        const filterStackItem = enzymeWrapper.find(FilterStackItem)
        const filterStackContents = enzymeWrapper.find(FilterStackContents)

        expect(filterStackItem.props().title).toEqual('Spatial')
        expect(filterStackItem.props().icon).toEqual(FaCrop)
        expect(filterStackContents.props().title).toEqual('Shape File')

        const fileWrapper = filterStackContents.props()
          .body.props.children.props.children.props.children
        const loadingIcon = fileWrapper[2].props.children[0]
        const loadingText = fileWrapper[2].props.children[1]

        expect(fileWrapper[2].props.className).toEqual('spatial-display__loading')
        expect(loadingIcon.props.animation).toEqual('border')
        expect(loadingIcon.props.className).toEqual('spatial-display__loading-icon')
        expect(loadingIcon.props.size).toEqual('sm')
        expect(loadingIcon.props.variant).toEqual('light')
        expect(loadingText).toEqual('Loading...')
      })
    })

    describe('when the shapefile is loaded', () => {
      const { enzymeWrapper } = setup()
      const newPolygon = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575,'
        + '-77.04444122314453,38.99228142151045'

      enzymeWrapper.setProps({
        polygonSearch: [newPolygon],
        shapefile: {
          shapefileName: 'test file',
          shapefileSize: '42 KB',
          isLoaded: true,
          isLoading: false
        }
      })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual(FaCrop)
      expect(filterStackContents.props().title).toEqual('Shape File')

      const fileWrapper = filterStackContents.props()
        .body.props.children.props.children.props.children
      const fileName = fileWrapper[0].props.children
      const fileSize = fileWrapper[1].props.children
      const loadingElement = fileWrapper[2]

      test('should render without a loading spinner', () => {
        expect(loadingElement).toEqual(false)
      })

      test('should render without spatial info', () => {
        expect(fileName).toEqual('test file')
        expect(fileSize).toEqual('(42 KB)')
      })
    })

    describe('when the shapefile has selected shapes', () => {
      test('should render a hint with number of shapes selected', () => {
        const { enzymeWrapper } = setup()
        const newPolygon = '-77.04444122314453,38.99228142151045,'
          + '-77.01992797851562,38.79166886339155,'
          + '-76.89415168762207,38.902629947921575,'
          + '-77.04444122314453,38.99228142151045'

        enzymeWrapper.setProps({
          polygonSearch: [newPolygon],
          shapefile: {
            shapefileName: 'test file',
            shapefileSize: '42 KB',
            isLoaded: true,
            isLoading: false,
            selectedFeatures: ['1']
          }
        })

        const filterStackContents = enzymeWrapper.find(FilterStackContents)
        expect(filterStackContents.props().hint).toEqual('1 shape selected')
      })
    })

    describe('when the shapefile is the wrong type', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        shapefile: {
          shapefileName: 'test file',
          shapefileSize: '42 KB',
          isErrored: {
            type: 'upload_shape'
          }
        }
      })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      expect(filterStackItem.props().error).toEqual('To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.')
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
    test('calls onRemoveSpatialFilter', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onSpatialRemove()

      expect(props.onRemoveSpatialFilter).toHaveBeenCalledTimes(1)
    })
  })

  describe('manual entry of spatial values', () => {
    test('changing point search updates the state', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ manuallyEntering: 'marker' })

      enzymeWrapper.instance().onChangePointSearch({ target: { value: '38,-77' } })

      expect(enzymeWrapper.state().pointSearch).toEqual('-77,38')
      expect(enzymeWrapper.state().error).toEqual('')
    })

    test('submitting point search calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setState({
        manuallyEntering: 'marker',
        pointSearch: '-77,38',
        error: ''
      })

      enzymeWrapper.instance().onSubmitPointSearch({
        type: 'blur',
        preventDefault: jest.fn()
      })

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { point: ['-77,38'] } } })
    })

    test('changing bounding box search updates the state', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ manuallyEntering: 'rectangle' })

      enzymeWrapper.instance().onChangeBoundingBoxSearch({ target: { value: '10,20', name: 'swPoint' } })
      expect(enzymeWrapper.state().boundingBoxSearch).toEqual(['10,20', ''])
      expect(enzymeWrapper.state().error).toEqual('')

      enzymeWrapper.instance().onChangeBoundingBoxSearch({ target: { value: '30,40', name: 'nePoint' } })
      expect(enzymeWrapper.state().boundingBoxSearch).toEqual(['10,20', '30,40'])
      expect(enzymeWrapper.state().error).toEqual('')
    })

    test('submitting bounding box search calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setState({
        manuallyEntering: 'rectangle',
        boundingBoxSearch: ['10,20', '30,40'],
        error: ''
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
        error: ''
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

  describe('#transformBoundingBoxCoordinates', () => {
    test('returns the input in the correct order', () => {
      const { enzymeWrapper } = setup()

      const input = '1,2,3,4'

      const result = enzymeWrapper.instance().transformBoundingBoxCoordinates(input)

      expect(result).toEqual(['2,1', '4,3'])
    })

    test('returns an array of empty values if no input was provided', () => {
      const { enzymeWrapper } = setup()

      const input = ''

      const result = enzymeWrapper.instance().transformBoundingBoxCoordinates(input)

      expect(result).toEqual(['', ''])
    })
  })

  describe('#transformCircleCoordinates', () => {
    test('returns the input in the correct order', () => {
      const { enzymeWrapper } = setup()

      const input = '45.60161,-94.60986,200'

      const result = enzymeWrapper.instance().transformCircleCoordinates(input)

      expect(result).toEqual(['-94.60986,45.60161', '200'])
    })

    test('returns an array of empty values if no input was provided', () => {
      const { enzymeWrapper } = setup()

      const input = ''

      const result = enzymeWrapper.instance().transformCircleCoordinates(input)

      expect(result).toEqual(['', ''])
    })

    test('returns an array of empty values if either latitude or longitude was not provided', () => {
      const { enzymeWrapper } = setup()

      const input = '0,,'

      const result = enzymeWrapper.instance().transformCircleCoordinates(input)

      expect(result).toEqual(['', ''])
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
})
