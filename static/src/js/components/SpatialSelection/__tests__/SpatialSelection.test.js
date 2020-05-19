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
  advancedSearch: {
    regionSearch: {}
  },
  boundingBoxSearch: '',
  circleSearch: '',
  isCwic: false,
  isProjectPage: false,
  lineSearch: '',
  mapRef: {
    leafletElement: {}
  },
  pointSearch: '',
  polygonSearch: '',
  onChangeQuery: jest.fn(),
  onChangeMap: jest.fn(),
  onToggleDrawingNewLayer: jest.fn(),
  onMetricsMap: jest.fn(),
  onMetricsSpatialEdit: jest.fn()
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
      circle: {
        drawError: errorOptions,
        shapeOptions: colorOptions
      }
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
    test('removes the drawnLayers and drawnMbr and calls renderShape', () => {
      const mockRemoveLayer = jest.fn()
      const { enzymeWrapper } = setup(defaultProps)

      enzymeWrapper.instance().renderShape = jest.fn()
      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: {
          removeLayer: mockRemoveLayer
        }
      }
      const drawnLayer = { remove: jest.fn() }

      enzymeWrapper.setState({
        drawnLayer,
        drawnPoints: ''
      })
      enzymeWrapper.setProps({ pointSearch: '0,0' })

      expect(mockRemoveLayer).toHaveBeenCalledTimes(2)
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
    test('sets the State and calls onToggleDrawingNewLayer', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDrawStart')({
        layerType: 'marker'
      })

      expect(enzymeWrapper.state().drawnLayer).toEqual(null)
      expect(props.onToggleDrawingNewLayer.mock.calls.length).toBe(1)
      expect(props.onToggleDrawingNewLayer.mock.calls[0]).toEqual(['marker'])
    })

    test('sends the metricsMap event', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDrawStart')({
        layerType: 'marker'
      })

      expect(props.onMetricsMap.mock.calls.length).toBe(1)
      expect(props.onMetricsMap.mock.calls[0]).toEqual(['Spatial: Marker'])
    })

    test('removes drawnLayers and drawnMbr if they exist', () => {
      const { enzymeWrapper } = setup(defaultProps)

      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: {
          removeLayer: jest.fn()
        }
      }

      enzymeWrapper.setState({ drawnLayer: {} })

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDrawStart')({ layerType: 'marker' })

      expect(enzymeWrapper.instance().featureGroupRef.leafletElement.removeLayer.mock.calls.length)
        .toBe(2)
    })
  })

  test('onDrawStop calls onToggleDrawingNewLayer', () => {
    const { enzymeWrapper, props } = setup(defaultProps)

    const editControl = enzymeWrapper.find(EditControl)
    editControl.prop('onDrawStop')()

    expect(props.onToggleDrawingNewLayer.mock.calls.length).toBe(1)
    expect(props.onToggleDrawingNewLayer.mock.calls[0]).toEqual([false])
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
          getLatLng: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,20')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            point: '10,20'
          }
        }
      }])
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
          getLatLngs: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,20,30,40')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            boundingBox: '10,20,30,40'
          }
        }
      }])
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
          getLatLngs: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,0,20,10,5,15,10,0')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            polygon: '10,0,20,10,5,15,10,0'
          }
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
          getLatLngs: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,0,20,10,5,15,10,0')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            polygon: '10,0,20,10,5,15,10,0'
          }
        }
      }])
    })

    test('with line spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = [
        { lng: 10, lat: 20 },
        { lng: 30, lat: 40 }
      ]
      editControl.prop('onCreated')({
        layerType: 'polyline',
        layer: {
          getLatLngs: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('10,20,30,40')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            line: '10,20,30,40'
          }
        }
      }])
    })

    test('with circle spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = { lng: 0, lat: 0 }
      const radiusResponse = 20000
      editControl.prop('onCreated')({
        layerType: 'circle',
        layer: {
          getLatLng: jest.fn(() => latLngResponse),
          getRadius: jest.fn(() => radiusResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual('0,0,20000')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            circle: '0,0,20000'
          }
        }
      }])
    })

    test('with invalid shape does not setState or call onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onCreated')({
        layerType: 'circleMarker',
        layer: {
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnPoints).toEqual(null)
      expect(props.onChangeQuery.mock.calls.length).toBe(0)
    })
  })

  describe('renderShape', () => {
    test('with point spatial it calls renderPoint', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderPoint = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, pointSearch: '0,10' })

      expect(enzymeWrapper.instance().renderPoint.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderPoint.mock.calls[0][0]).toEqual([{ lat: 10, lng: 0 }])
      expect(enzymeWrapper.instance().renderPoint.mock.calls[0][1])
        .toBe(enzymeWrapper.instance().featureGroupRef.leafletElement)
    })

    test('with boundingBox spatial it calls renderBoundingBox', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderBoundingBox = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, boundingBoxSearch: '10,20,30,40' })

      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls[0][0]).toEqual([
        { lat: 20, lng: 10 },
        { lat: 40, lng: 30 }
      ])
      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls[0][1])
        .toBe(enzymeWrapper.instance().featureGroupRef.leafletElement)
    })

    test('with polygon spatial it calls renderPolygon', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderPolygon = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, polygonSearch: '10,0,20,10,5,15,10,0' })

      expect(enzymeWrapper.instance().renderPolygon.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderPolygon.mock.calls[0][0]).toEqual([
        { lat: 0, lng: 10 },
        { lat: 10, lng: 20 },
        { lat: 15, lng: 5 },
        { lat: 0, lng: 10 }
      ])
      expect(enzymeWrapper.instance().renderPolygon.mock.calls[0][1])
        .toBe(enzymeWrapper.instance().featureGroupRef.leafletElement)
    })

    test('with line spatial it calls renderLine', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderLine = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, lineSearch: '10,0,20,10,5,15,10,0' })

      expect(enzymeWrapper.instance().renderLine.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderLine.mock.calls[0][0]).toEqual([
        '10,0',
        '20,10',
        '5,15',
        '10,0'
      ])
      expect(enzymeWrapper.instance().renderLine.mock.calls[0][1])
        .toBe(enzymeWrapper.instance().featureGroupRef.leafletElement)
    })

    test('with circle spatial it calls renderCircle', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderCircle = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, circleSearch: '0,0,20000' })

      expect(enzymeWrapper.instance().renderCircle.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderCircle.mock.calls[0][0]).toEqual([
        '0',
        '0',
        '20000'
      ])
      expect(enzymeWrapper.instance().renderCircle.mock.calls[0][1])
        .toBe(enzymeWrapper.instance().featureGroupRef.leafletElement)
    })
  })

  describe('onDeleted', () => {
    test('sets the State and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDeleted')()

      expect(enzymeWrapper.state().drawnLayer).toEqual(null)
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {}
        }
      }])
    })
  })
})
