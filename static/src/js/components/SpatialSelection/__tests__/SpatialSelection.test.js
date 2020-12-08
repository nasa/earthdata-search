import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {
  EditControl
} from 'react-leaflet-draw'
import L from 'leaflet'

import SpatialSelection, { colorOptions, errorOptions } from '../SpatialSelection'
import * as panFeatureGroupToCenter from '../../../util/map/actions/panFeatureGroupToCenter'

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
  boundingBoxSearch: [],
  circleSearch: [],
  isCwic: false,
  isProjectPage: false,
  lineSearch: [],
  mapRef: {
    leafletElement: {},
    props: {}
  },
  pointSearch: [],
  polygonSearch: [],
  shapefile: {},
  onChangeQuery: jest.fn(),
  onChangeMap: jest.fn(),
  onToggleDrawingNewLayer: jest.fn(),
  onMetricsMap: jest.fn(),
  onMetricsSpatialEdit: jest.fn(),
  onRemoveSpatialFilter: jest.fn()
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
    expect(editControl.props().draw).toEqual({
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
    expect(editControl.props().edit).toEqual({
      selectedPathOptions: {
        opacity: 0.6,
        dashArray: '10, 10',
        maintainColor: true
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

    expect(editControl.props().draw).toEqual(expect.objectContaining({
      circle: false,
      circlemarker: false,
      marker: false,
      polygon: false,
      polyline: false,
      rectangle: false
    }))
    expect(editControl.props().edit).toEqual({
      edit: false,
      remove: false
    })
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
        drawnLayers: [{
          layer: drawnLayer,
          layerPoints: ''
        }]
      })
      enzymeWrapper.setProps({ pointSearch: ['0,0'] })

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
        drawnLayers: [{
          layer: drawnLayer,
          layerPoints: '0,0'
        }]
      })

      enzymeWrapper.setProps({ pointSearch: ['0,0'] })

      expect(enzymeWrapper.instance().renderShape.mock.calls.length).toBe(0)
    })
  })

  describe('onDrawCancel', () => {
    test('disables the drawControl', () => {
      const disableMock = jest.fn()
      const { enzymeWrapper } = setup(defaultProps)

      enzymeWrapper.instance().drawControl = {
        _toolbars: {
          draw: {
            _modes: {
              circle: {
                handler: {
                  disable: disableMock
                }
              },
              rectangle: {
                handler: {
                  disable: disableMock
                }
              },
              marker: {
                handler: {
                  disable: disableMock
                }
              }
            }
          }
        }
      }
      enzymeWrapper.instance().onDrawCancel()

      expect(disableMock).toHaveBeenCalledTimes(3)
    })
  })

  describe('onSpatialDropdownClick', () => {
    test('enables the drawControl for the selected type', () => {
      const enableMock = jest.fn()
      const { enzymeWrapper } = setup(defaultProps)

      enzymeWrapper.instance().drawControl = {
        _toolbars: {
          draw: {
            _modes: {
              circle: {
                handler: {
                  enable: enableMock
                }
              }
            }
          }
        }
      }
      enzymeWrapper.instance().onSpatialDropdownClick({ type: 'circle' })

      expect(enableMock).toHaveBeenCalledTimes(1)
    })

    test('does not try to enable the drawControl if the mode doesn\'t exist', () => {
      const enableMock = jest.fn()
      const { enzymeWrapper } = setup(defaultProps)

      enzymeWrapper.instance().drawControl = {
        _toolbars: {
          draw: {
            _modes: {}
          }
        }
      }
      enzymeWrapper.instance().onSpatialDropdownClick({ type: 'circle' })

      expect(enableMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('onDrawStart', () => {
    test('sets the State and calls onToggleDrawingNewLayer', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: {
          removeLayer: jest.fn()
        }
      }

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDrawStart')({
        layerType: 'marker'
      })

      expect(enzymeWrapper.state().drawnLayers).toHaveLength(0)
      expect(props.onToggleDrawingNewLayer.mock.calls.length).toBe(1)
      expect(props.onToggleDrawingNewLayer.mock.calls[0]).toEqual(['marker'])
    })

    test('sends the metricsMap event', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: {
          removeLayer: jest.fn()
        }
      }

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

      enzymeWrapper.setState({
        drawnLayers: [
          {
            layer: {},
            layerMbr: {}
          }
        ]
      })

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

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('10,20')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            point: ['10,20']
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

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('10,20,30,40')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            boundingBox: ['10,20,30,40']
          }
        }
      }])
    })

    test('with polygon spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = [[
        { lng: 10, lat: 0 },
        { lng: 20, lat: 10 },
        { lng: 5, lat: 15 }
      ]]
      editControl.prop('onCreated')({
        layerType: 'polygon',
        layer: {
          getLatLngs: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('10,0,20,10,5,15')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            polygon: ['10,0,20,10,5,15']
          }
        }
      }])
    })

    test('with counter clockwise polygon spatial sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = [[
        { lng: 5, lat: 15 },
        { lng: 20, lat: 10 },
        { lng: 10, lat: 0 }
      ]]
      editControl.prop('onCreated')({
        layerType: 'polygon',
        layer: {
          getLatLngs: jest.fn(() => latLngResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('10,0,20,10,5,15')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            polygon: ['10,0,20,10,5,15']
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

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('10,20,30,40')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            line: ['10,20,30,40']
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

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('0,0,20000')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            circle: ['0,0,20000']
          }
        }
      }])
    })

    test('with invalid shape does not setState or call onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onCreated')({
        isShapefile: false,
        layerType: 'circleMarker',
        layer: {
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnLayers).toHaveLength(0)
      expect(props.onChangeQuery.mock.calls.length).toBe(0)
    })

    test('with shapefile sets the state and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      const latLngResponse = { lng: 0, lat: 0 }
      const radiusResponse = 20000
      editControl.prop('onCreated')({
        isShapefile: true,
        layerType: 'circle',
        layer: {
          getLatLng: jest.fn(() => latLngResponse),
          getRadius: jest.fn(() => radiusResponse),
          remove: jest.fn()
        }
      })

      expect(enzymeWrapper.state().drawnLayers[0].layerPoints).toEqual('0,0,20000')
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            circle: ['0,0,20000']
          }
        }
      }])
    })
  })

  describe('renderShape', () => {
    test('with point spatial it calls renderPoint', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderPoint = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, pointSearch: ['0,10'] })

      expect(enzymeWrapper.instance().renderPoint.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderPoint.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          featureGroup: enzymeWrapper.instance().featureGroupRef.leafletElement,
          point: [{ lat: 10, lng: 0 }]
        })
      )
    })

    test('with boundingBox spatial it calls renderBoundingBox', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderBoundingBox = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, boundingBoxSearch: ['10,20,30,40'] })

      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderBoundingBox.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          featureGroup: enzymeWrapper.instance().featureGroupRef.leafletElement,
          rectangle: [
            { lat: 20, lng: 10 },
            { lat: 40, lng: 30 }
          ]
        })
      )
    })

    test('with polygon spatial it calls renderPolygon', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderPolygon = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, polygonSearch: ['10,0,20,10,5,15,10,0'] })

      expect(enzymeWrapper.instance().renderPolygon.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderPolygon.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          featureGroup: enzymeWrapper.instance().featureGroupRef.leafletElement,
          polygon: [
            { lat: 0, lng: 10 },
            { lat: 10, lng: 20 },
            { lat: 15, lng: 5 },
            { lat: 0, lng: 10 }
          ]
        })
      )
    })

    test('with line spatial it calls renderLine', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderLine = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, lineSearch: ['10,0,20,10,5,15,10,0'] })

      expect(enzymeWrapper.instance().renderLine.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderLine.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          featureGroup: enzymeWrapper.instance().featureGroupRef.leafletElement,
          points: [
            '10,0',
            '20,10',
            '5,15',
            '10,0'
          ]
        })
      )
    })

    test('with circle spatial it calls renderCircle', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      enzymeWrapper.instance().renderCircle = jest.fn()
      enzymeWrapper.instance().featureGroupRef = { leafletElement: jest.fn() }

      enzymeWrapper.instance().renderShape({ ...props, circleSearch: ['0,0,20000'] })

      expect(enzymeWrapper.instance().renderCircle.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().renderCircle.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          featureGroup: enzymeWrapper.instance().featureGroupRef.leafletElement,
          points: [
            '0',
            '0',
            '20000'
          ]
        })
      )
    })

    test('does not render a shape if there is a shapefile', () => {
      const { enzymeWrapper, props } = setup({
        ...defaultProps,
        shapefile: {
          shapefileId: '1234'
        }
      })
      enzymeWrapper.instance().renderCircle = jest.fn()

      enzymeWrapper.instance().renderShape({ ...props, circleSearch: ['0,0,20000'] })

      expect(enzymeWrapper.instance().renderCircle).toHaveBeenCalledTimes(0)
    })
  })

  describe('onDeleted', () => {
    test('sets the State and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDeleted')({ isShapefile: false, layerId: undefined })

      expect(enzymeWrapper.state().drawnLayers).toHaveLength(0)
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {}
        }
      }])
    })

    test('with shapefile sets the State and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)
      const mockRemoveLayer = jest.fn()
      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: {
          removeLayer: mockRemoveLayer
        }
      }
      enzymeWrapper.setState({
        drawnLayers: [{
          layer: {
            feature: {
              edscId: 0
            },
            getLatLng: () => ({ lat: 10, lng: 5 })
          },
          layerType: 'point'
        }]
      })

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onDeleted')({ isShapefile: true, layerId: 0 })

      expect(mockRemoveLayer.mock.calls.length).toBe(2)
      expect(enzymeWrapper.state().drawnLayers).toHaveLength(0)
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {}
        }
      }])
    })
  })

  describe('onEditStop', () => {
    test('saves metrics for distance changed', () => {
      const mockResult = [
        new L.Point(0, 0),
        new L.Point(10, 10)
      ]
      const latLngToLayerPointMock = jest.fn()
        .mockImplementationOnce(() => mockResult[0])
        .mockImplementationOnce(() => mockResult[1])
      const { enzymeWrapper, props } = setup({
        ...defaultProps,
        mapRef: {
          leafletElement: {
            latLngToLayerPoint: latLngToLayerPointMock
          },
          props: {}
        }
      })

      enzymeWrapper.instance().layers = [{
        getLatLng: () => ([[
          {
            lat: 0,
            lng: 0
          }
        ]]),
        type: 'marker'
      }]
      enzymeWrapper.instance().onEditStart()

      enzymeWrapper.instance().layers = [{
        getLatLng: () => ([[
          {
            lat: 10,
            lng: 10
          }
        ]]),
        type: 'marker'
      }]
      enzymeWrapper.instance().onEditStop()

      expect(props.onMetricsSpatialEdit).toHaveBeenCalledTimes(1)
      expect(props.onMetricsSpatialEdit).toHaveBeenCalledWith({
        distanceSum: 14.142135623730951,
        type: 'marker'
      })
    })
  })

  describe('onEdited', () => {
    test('sets the State and calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup(defaultProps)

      enzymeWrapper.setState({
        drawnLayers: [{
          layer: {
            getLatLng: () => ({ lat: 10, lng: 5 })
          },
          layerType: 'point'
        }]
      })

      const editControl = enzymeWrapper.find(EditControl)
      editControl.prop('onEdited')()

      expect(enzymeWrapper.state().drawnLayers).toHaveLength(1)
      expect(props.onChangeQuery.mock.calls.length).toBe(1)
      expect(props.onChangeQuery.mock.calls[0]).toEqual([{
        collection: {
          spatial: {
            point: ['5,10']
          }
        }
      }])
    })
  })

  describe('getExistingSearch', () => {
    test('returns existing boundingBox search', () => {
      const { enzymeWrapper } = setup({
        ...defaultProps,
        boundingBoxSearch: ['1,2,3,4']
      })

      const result = enzymeWrapper.instance().getExistingSearch('boundingBox')

      expect(result).toEqual(['1,2,3,4'])
    })

    test('returns existing circle search', () => {
      const { enzymeWrapper } = setup({
        ...defaultProps,
        circleSearch: ['1,2,3']
      })

      const result = enzymeWrapper.instance().getExistingSearch('circle')

      expect(result).toEqual(['1,2,3'])
    })

    test('returns existing line search', () => {
      const { enzymeWrapper } = setup({
        ...defaultProps,
        lineSearch: ['1,2,3,4,5,6']
      })

      const result = enzymeWrapper.instance().getExistingSearch('line')

      expect(result).toEqual(['1,2,3,4,5,6'])
    })

    test('returns existing point search', () => {
      const { enzymeWrapper } = setup({
        ...defaultProps,
        pointSearch: ['1,2']
      })

      const result = enzymeWrapper.instance().getExistingSearch('point')

      expect(result).toEqual(['1,2'])
    })

    test('returns existing polygon search', () => {
      const { enzymeWrapper } = setup({
        ...defaultProps,
        polygonSearch: ['1,2,3,4,5,6,7,8']
      })

      const result = enzymeWrapper.instance().getExistingSearch('polygon')

      expect(result).toEqual(['1,2,3,4,5,6,7,8'])
    })

    test('returns undefined as default', () => {
      const { enzymeWrapper } = setup(defaultProps)

      const result = enzymeWrapper.instance().getExistingSearch('')

      expect(result).toEqual(undefined)
    })
  })

  describe('setLayer', () => {
    test('adds the layer and pans the map', () => {
      const layer = { mock: 'layer' }
      const { enzymeWrapper } = setup(defaultProps)

      const panFeatureMock = jest.spyOn(panFeatureGroupToCenter, 'panFeatureGroupToCenter').mockImplementation(() => jest.fn())
      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: jest.fn()
      }

      enzymeWrapper.instance().setLayer(layer, true, false)

      expect(enzymeWrapper.instance().layers).toEqual([layer])
      expect(panFeatureMock).toHaveBeenCalledTimes(1)
    })

    test('with a shapefile adds the layer and pans the map', () => {
      const layer = { mock: 'layer' }
      const { enzymeWrapper } = setup(defaultProps)

      const panFeatureMock = jest.spyOn(panFeatureGroupToCenter, 'panFeatureGroupToCenter').mockImplementation(() => jest.fn())
      enzymeWrapper.instance().featureGroupRef = {
        leafletElement: jest.fn()
      }

      enzymeWrapper.instance().setLayer(layer, false, true)

      expect(enzymeWrapper.instance().layers).toEqual([layer])
      expect(panFeatureMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('boundsToPoints', () => {
    test('converts the circle layer bounds to an array of points', () => {
      const mockResult = [{ x: 0, y: 15 }]
      const latLngToLayerPointMock = jest.fn().mockImplementation(() => mockResult[0])
      const layer = {
        getLatLng: () => ({
          lat: 10,
          lng: 5
        }),
        type: 'circle'
      }
      const { enzymeWrapper } = setup({
        ...defaultProps,
        mapRef: {
          leafletElement: {
            latLngToLayerPoint: latLngToLayerPointMock
          },
          props: {}
        }
      })

      const result = enzymeWrapper.instance().boundsToPoints(layer)

      expect(latLngToLayerPointMock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResult)
    })

    test('converts the polygon layer bounds to an array of points', () => {
      const mockResult = [
        { x: 0, y: 15 },
        { x: 10, y: 20 },
        { x: 5, y: 20 },
        { x: 0, y: 15 }
      ]
      const latLngToLayerPointMock = jest.fn()
        .mockImplementationOnce(() => mockResult[0])
        .mockImplementationOnce(() => mockResult[1])
        .mockImplementationOnce(() => mockResult[2])
        .mockImplementationOnce(() => mockResult[3])
      const layer = {
        getLatLngs: () => ([[
          {
            lat: 10,
            lng: 5
          },
          {
            lat: 15,
            lng: 20
          },
          {
            lat: 0,
            lng: 20
          },
          {
            lat: 10,
            lng: 5
          }
        ]]),
        type: 'polygon'
      }
      const { enzymeWrapper } = setup({
        ...defaultProps,
        mapRef: {
          leafletElement: {
            latLngToLayerPoint: latLngToLayerPointMock
          },
          props: {}
        }
      })

      const result = enzymeWrapper.instance().boundsToPoints(layer)

      expect(latLngToLayerPointMock).toHaveBeenCalledTimes(4)
      expect(result).toEqual(mockResult)
    })
  })
})
