import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SpatialDisplay from '../SpatialDisplay'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import FilterStackContents from '../../FilterStack/FilterStackContents'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    boundingBoxSearch: '',
    circleSearch: '',
    displaySpatialPolygonWarning: false,
    drawingNewLayer: false,
    lineSearch: '',
    pointSearch: '',
    polygonSearch: '',
    gridName: '',
    gridCoords: '',
    onChangeQuery: jest.fn(),
    onGranuleGridCoords: jest.fn(),
    onRemoveGridFilter: jest.fn(),
    onRemoveSpatialFilter: jest.fn(),
    selectingNewGrid: false,
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
      enzymeWrapper.setProps({ pointSearch: newPoint })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual('crop')
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
      enzymeWrapper.setProps({ boundingBoxSearch: newBoundingBox })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual('crop')
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
      enzymeWrapper.setProps({ circleSearch: newCircle })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual('crop')
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

      enzymeWrapper.setProps({ polygonSearch: newPolygon })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual('crop')
      expect(filterStackContents.props().title).toEqual('Polygon')

      const pointCount = filterStackContents.props()
        .body.props.children.props.children.props.children
      expect(pointCount).toEqual('3 Points')
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
        polygonSearch: newPolygon
      })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual('crop')
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

      enzymeWrapper.setProps({ lineSearch: line })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Spatial')
      expect(filterStackItem.props().icon).toEqual('crop')
      expect(filterStackContents.props().title).toEqual('Line')
      expect(filterStackContents.props().body.props.children).toEqual(null)
    })
  })

  describe('with shapefile', () => {
    describe('when the shapfile is loading', () => {
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
        expect(filterStackItem.props().icon).toEqual('crop')
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

    describe('when the shapfile is loaded', () => {
      const { enzymeWrapper } = setup()
      const newPolygon = '-77.04444122314453,38.99228142151045,'
        + '-77.01992797851562,38.79166886339155,'
        + '-76.89415168762207,38.902629947921575,'
        + '-77.04444122314453,38.99228142151045'

      enzymeWrapper.setProps({
        polygonSearch: newPolygon,
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
      expect(filterStackItem.props().icon).toEqual('crop')
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
  })

  describe('with grid', () => {
    test('should render the spatial info', () => {
      const { enzymeWrapper } = setup()
      const gridName = 'WRS-1'
      const gridCoords = 'test coords'
      enzymeWrapper.setProps({ gridCoords, gridName })

      const filterStackItem = enzymeWrapper.find(FilterStackItem)
      const filterStackContents = enzymeWrapper.find(FilterStackContents)

      expect(filterStackItem.props().title).toEqual('Grid')
      expect(filterStackItem.props().icon).toEqual('edsc-globe')
      expect(filterStackContents.props().title).toEqual('Grid')

      const gridNameSelect = filterStackContents.props().body.props.children.props.children[0]
      const gridNameSelectLabel = gridNameSelect.props.children[0]
      const gridNameSelectInput = gridNameSelect.props.children[1]
      expect(gridNameSelectLabel.props.children).toEqual('Coordinate System')
      expect(gridNameSelectInput.props.value).toEqual(gridName)

      const gridCoordsInput = filterStackContents.props().body.props.children.props.children[1]
      const gridCoordsInputLabel = gridCoordsInput.props.children[0]
      const gridCoordsInputInput = gridCoordsInput.props.children[1]
      expect(gridCoordsInputLabel.props.children).toEqual('Coordinates')
      expect(gridCoordsInputInput.props.value).toEqual(gridCoords)
    })
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().pointSearch).toEqual('')
    const newPoint = '0,0'
    enzymeWrapper.setProps({ pointSearch: newPoint })
    expect(enzymeWrapper.state().pointSearch).toEqual(newPoint)
  })

  describe('#onChangeGridType', () => {
    test('calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const preventDefaultMock = jest.fn()
      enzymeWrapper.instance().onChangeGridType({
        target: {
          value: 'test'
        },
        preventDefault: preventDefaultMock
      })

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          gridName: 'test'
        }
      })
    })

    test('calls preventDefault', () => {
      const { enzymeWrapper } = setup()

      const preventDefaultMock = jest.fn()
      enzymeWrapper.instance().onChangeGridType({
        target: {
          value: 'test'
        },
        preventDefault: preventDefaultMock
      })
      expect(preventDefaultMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('#onChangeGridCoords', () => {
    test('calls onChangeQuery', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onChangeGridCoords({
        target: {
          value: 'test coords'
        }
      })

      expect(enzymeWrapper.state()).toEqual({
        error: '',
        boundingBoxSearch: ['', ''],
        circleSearch: ['', '', ''],
        gridCoords: 'test coords',
        gridName: '',
        lineSearch: '',
        manuallyEntering: false,
        pointSearch: '',
        polygonSearch: '',
        shapefile: {}
      })
    })
  })

  describe('#onSubmitGridCoords', () => {
    describe('when blurred', () => {
      test('calls onChangeQuery', () => {
        const { enzymeWrapper, props } = setup()

        const preventDefaultMock = jest.fn()
        enzymeWrapper.instance().onSubmitGridCoords({
          type: 'blur',
          target: {
            value: 'test'
          },
          preventDefault: preventDefaultMock
        })

        expect(props.onGranuleGridCoords).toHaveBeenCalledTimes(1)
        expect(props.onGranuleGridCoords).toHaveBeenCalledWith('test')
      })
    })

    describe('when enter key pressed', () => {
      test('calls onChangeQuery', () => {
        const { enzymeWrapper, props } = setup()

        const preventDefaultMock = jest.fn()
        enzymeWrapper.instance().onSubmitGridCoords({
          type: 'keyUp',
          key: 'Enter',
          target: {
            value: 'test'
          },
          preventDefault: preventDefaultMock
        })

        expect(props.onGranuleGridCoords).toHaveBeenCalledTimes(1)
        expect(props.onGranuleGridCoords).toHaveBeenCalledWith('test')
      })
    })

    test('calls preventDefault', () => {
      const { enzymeWrapper } = setup()

      const preventDefaultMock = jest.fn()
      enzymeWrapper.instance().onChangeGridType({
        target: {
          value: 'test'
        },
        preventDefault: preventDefaultMock
      })
      expect(preventDefaultMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('#onGridRemove', () => {
    test('calls onRemoveGridFilter', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onGridRemove()

      expect(props.onRemoveGridFilter).toHaveBeenCalledTimes(1)
    })
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
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { point: '-77,38' } } })
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
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { boundingBox: '20,10,40,30' } } })
    })

    test('changing circle search updates the state', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setState({ manuallyEntering: 'circle' })

      enzymeWrapper.instance().onChangeCircleSearch({ target: { value: '38,-77', name: 'center' } })
      expect(enzymeWrapper.state().circleSearch).toEqual(['38,-77', ''])
      expect(enzymeWrapper.state().error).toEqual('')

      enzymeWrapper.instance().onChangeCircleSearch({ target: { value: '10000', name: 'radius' } })
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
      expect(props.onChangeQuery).toHaveBeenCalledWith({ collection: { spatial: { circle: '-77,38,10000' } } })
    })
  })
})
