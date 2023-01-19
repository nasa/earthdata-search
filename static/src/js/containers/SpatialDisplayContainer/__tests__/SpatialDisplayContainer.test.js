import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SpatialDisplayContainer } from '../SpatialDisplayContainer'
import SpatialDisplay from '../../../components/SpatialDisplay/SpatialDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    boundingBoxSearch: ['Test Bounding Box'],
    circleSearch: ['Test Circle'],
    displaySpatialPolygonWarning: false,
    drawingNewLayer: false,
    lineSearch: ['Test Line'],
    onChangeQuery: jest.fn(),
    onRemoveSpatialFilter: jest.fn(),
    pointSearch: ['Test Point Search'],
    polygonSearch: ['Test Polygon Search'],
    shapefile: {}
  }

  const enzymeWrapper = shallow(<SpatialDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onRemoveSpatialFilter calls actions.removeSpatialFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeSpatialFilter')

    mapDispatchToProps(dispatch).onRemoveSpatialFilter()

    expect(spy).toBeCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {
          spatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          }
        }
      },
      shapefile: {},
      ui: {
        map: {
          drawingNewLayer: false
        },
        spatialPolygonWarning: {
          isDisplayed: false
        }
      }
    }

    const expectedState = {
      boundingBoxSearch: [],
      circleSearch: [],
      displaySpatialPolygonWarning: false,
      drawingNewLayer: false,
      lineSearch: [],
      pointSearch: [],
      polygonSearch: [],
      shapefile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SpatialDisplayContainer component', () => {
  test('passes its props and renders a single SpatialDisplay component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SpatialDisplay).length).toBe(1)
    expect(enzymeWrapper.find(SpatialDisplay).props()).toEqual({
      boundingBoxSearch: ['Test Bounding Box'],
      circleSearch: ['Test Circle'],
      displaySpatialPolygonWarning: false,
      drawingNewLayer: false,
      lineSearch: ['Test Line'],
      onChangeQuery: props.onChangeQuery,
      onRemoveGridFilter: props.onRemoveGridFilter,
      onRemoveSpatialFilter: props.onRemoveSpatialFilter,
      pointSearch: ['Test Point Search'],
      polygonSearch: ['Test Polygon Search'],
      shapefile: {}
    })
  })
})
