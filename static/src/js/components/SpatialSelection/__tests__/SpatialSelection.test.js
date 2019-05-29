import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {
  EditControl
} from 'react-leaflet-draw'

import SpatialSelection, { colorOptions, errorOptions } from '../SpatialSelection'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<SpatialSelection {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

const defaultProps = {
  boundingBoxSearch: '',
  isProjectPage: false,
  mapRef: {
    leafletElement: jest.fn()
  },
  pointSearch: '',
  polygonSearch: '',
  onChangeQuery: jest.fn(),
  onChangeMap: jest.fn()
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SpatialSelection component', () => {
  test('should render self and controls', () => {
    const { enzymeWrapper } = setup(defaultProps)
    expect(enzymeWrapper.exists()).toBe(true)

    const editControl = enzymeWrapper.find(EditControl)

    expect(editControl.length).toBe(1)
    expect(editControl.prop('draw')).toEqual({
      polygon: {
        drawError: errorOptions,
        shapeOptions: colorOptions
      },
      rectangle: {
        drawError: errorOptions,
        shapeOptions: colorOptions
      },
      polyline: false,
      circlemarker: false,
      circle: false
    })
  })

  test('should not render controls on project page', () => {
    const { enzymeWrapper } = setup({
      ...defaultProps,
      isProjectPage: true
    })
    expect(enzymeWrapper.exists()).toBe(true)

    const editControl = enzymeWrapper.find(EditControl)

    expect(editControl.length).toBe(0)
  })

  describe('componentWillReceiveProps', () => {
    test('removes the drawnLayer and calls renderShape', () => {
      const { enzymeWrapper } = setup(defaultProps)
      enzymeWrapper.instance().renderShape = jest.fn()
      const drawnLayer = { remove: jest.fn() }

      enzymeWrapper.setState({
        drawnLayer,
        drawnPoints: ''
      })
      enzymeWrapper.setProps({ pointSearch: '0,0' })

      expect(drawnLayer.remove.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderShape.mock.calls.length).toBe(1)
    })

    test('returns when there is no mapRef', () => {
      const { enzymeWrapper, props } = setup({ ...defaultProps, mapRef: {} })
      enzymeWrapper.instance().renderShape = jest.fn()

      enzymeWrapper.setProps(props)
      expect(enzymeWrapper.instance().renderShape.mock.calls.length).toBe(0)
    })

    test('does not draw the new shape if it is equal to the old shape', () => {
      const { enzymeWrapper } = setup(defaultProps)
      enzymeWrapper.instance().renderShape = jest.fn()
      enzymeWrapper.instance().renderPoint = jest.fn()

      const drawnLayer = { remove: jest.fn() }
      enzymeWrapper.setState({
        drawnLayer,
        drawnPoints: '0,0'
      })

      enzymeWrapper.setProps({ pointSearch: '0,0' })

      expect(enzymeWrapper.instance().renderShape.mock.calls.length).toBe(0)
    })
  })

  describe('onDrawStart', () => {
    test('sets the State and calls onChangeMap', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDrawStart')({
        layerType: 'marker'
      })

      expect(enzymeWrapper.state().drawnLayer).toEqual(null)
      expect(props.onChangeMap.mock.calls.length).toBe(1)
      expect(props.onChangeMap.mock.calls[0]).toEqual([{ drawingNewLayer: 'marker' }])
    })

    test('removes drawnLayers if they exist', () => {
      const { enzymeWrapper } = setup(defaultProps)

      const drawnLayer = { remove: jest.fn() }
      enzymeWrapper.setState({ drawnLayer })

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDrawStart')({ layerType: 'marker' })

      expect(drawnLayer.remove.mock.calls.length).toBe(1)
    })
  })

  test('onDrawStop calls onChangeMap', () => {
    const { enzymeWrapper, props } = setup(defaultProps)

    const editControl = enzymeWrapper.find(EditControl)
    editControl.prop('onDrawStop')()

    expect(props.onChangeMap.mock.calls.length).toBe(1)
    expect(props.onChangeMap.mock.calls[0]).toEqual([{ drawingNewLayer: '' }])
  })

  describe('onDrawCreate', () => {
    test('with point spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = {
        lng: 10,
        lat: 20
      }
      editControl.prop('onCreated')({
        layerType: 'marker',
        layer: {
          getLatLng: jest.fn(() => latLngResponse)
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,20')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{ spatial: { point: '10,20' } }])
    })

    test('with boundingBox spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = [[
        { lng: 10, lat: 20 },
        { lng: 30, lat: 20 },
        { lng: 30, lat: 40 },
        { lng: 10, lat: 40 }
      ]]
      editControl.prop('onCreated')({
        layerType: 'rectangle',
        layer: {
          getLatLngs: jest.fn(() => latLngResponse)
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,20,30,40')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{ spatial: { boundingBox: '10,20,30,40' } }])
    })

    test('with polygon spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = [
        { lng: 10, lat: 0 },
        { lng: 20, lat: 10 },
        { lng: 5, lat: 15 }
      ]
      editControl.prop('onCreated')({
        layerType: 'polygon',
        layer: {
          getLatLngs: jest.fn(() => latLngResponse)
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,0,20,10,5,15,10,0')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        spatial: {
          polygon: '10,0,20,10,5,15,10,0'
        }
      }])
    })

    test('with counter clockwise polygon spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = [
        { lng: 5, lat: 15 },
        { lng: 20, lat: 10 },
        { lng: 10, lat: 0 }
      ]
      editControl.prop('onCreated')({
        layerType: 'polygon',
        layer: {
          getLatLngs: jest.fn(() => latLngResponse)
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,0,20,10,5,15,10,0')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        spatial: {
          polygon: '10,0,20,10,5,15,10,0'
        }
      }])
    })

    test('with invalid shape does not setState or call onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onCreated')({
        layerType: 'circle'
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual(null)
      expect(props.onChangeQuery.mock.calls.length).toBe(0)
    })
  })

  test('getShape returns a shape', () => {
    const { enzymeWrapper } = setup(defaultProps)

    const shape = enzymeWrapper.instance().getShape([
      '10,0',
      '20,10',
      '5,15',
      '10,0'
    ])

    expect(shape).toEqual([{
      lat: 0,
      lng: 10
    }, {
      lat: 10,
      lng: 20
    }, {
      lat: 15,
      lng: 5
    }, {
      lat: 0,
      lng: 10
    }])
  })

  test('splitListOfPoints splits a string of points into array of lat/lng points', () => {
    const { enzymeWrapper } = setup(defaultProps)

    const points = enzymeWrapper.instance().splitListOfPoints('10,0,20,10,5,15,10,0')

    expect(points).toEqual([
      '10,0',
      '20,10',
      '5,15',
      '10,0'
    ])
  })

  describe('renderShape', () => {
    test('with point spatial it calls renderPoint', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderPoint = jest.fn()

      enzymeWrapper.instance().renderShape({ ...props, pointSearch: '0,10' })

      expect(enzymeWrapper.instance().renderPoint.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderPoint.mock.calls[0][0]).toEqual([{ lat: 10, lng: 0 }])
      expect(enzymeWrapper.instance().renderPoint.mock.calls[0][1]).toBe(props.mapRef.leafletElement)
    })

    test('with boundingBox spatial it calls renderBoundingBox', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderBoundingBox = jest.fn()

      enzymeWrapper.instance().renderShape({ ...props, boundingBoxSearch: '10,20,30,40' })

      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls[0][0]).toEqual([
        { lat: 20, lng: 10 },
        { lat: 40, lng: 30 }
      ])
      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls[0][1]).toBe(props.mapRef.leafletElement)
    })

    test('with rectangle spatial it calls renderPolygon', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderPolygon = jest.fn()

      enzymeWrapper.instance().renderShape({ ...props, polygonSearch: '10,0,20,10,5,15,10,0' })

      expect(enzymeWrapper.instance().renderPolygon.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderPolygon.mock.calls[0][0]).toEqual([
        { lat: 0, lng: 10 },
        { lat: 10, lng: 20 },
        { lat: 15, lng: 5 },
        { lat: 0, lng: 10 }
      ])
      expect(enzymeWrapper.instance().renderPolygon.mock.calls[0][1]).toBe(props.mapRef.leafletElement)
    })
  })

  test.skip('renderPoint adds a point to the map and updates the state', () => {
    const { enzymeWrapper } = setup(defaultProps)
    // How to mock what leaflet is doing when creating a Marker and adding it to a map?

    const point = [{ lat: 10, lng: 0 }]
    enzymeWrapper.instance().renderPoint(point)
  })
  test.skip('renderBoundingBox adds a bounding box to the map and updates the state', () => { })
  test.skip('renderPolygon adds a poolygon to the map and updates the state', () => { })
})
