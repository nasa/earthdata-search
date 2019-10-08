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
    drawingNewLayer: false,
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
      expect(input.props.children.props.value).toEqual('38.805869, -77.0418825') // Lat,Lon
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
      expect(swInput.props.children.props.value).toEqual('38.79165, -77.11976')

      const ne = filterStackContents.props().body.props.children.props.children[1]
      const neLabel = ne.props.children[0]
      const neInput = ne.props.children[1]
      expect(neLabel.props.children).toEqual('NE:')
      expect(neInput.props.children.props.value).toEqual('38.99585, -76.90939')
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

        const fileWrapper = filterStackContents.props().body.props.children.props.children.props.children
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

      const fileWrapper = filterStackContents.props().body.props.children.props.children.props.children
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
        boundingBoxSearch: '',
        gridCoords: 'test coords',
        gridName: '',
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
})
