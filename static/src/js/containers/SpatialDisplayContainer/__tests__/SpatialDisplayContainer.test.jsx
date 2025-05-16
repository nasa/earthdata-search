import React from 'react'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SpatialDisplayContainer
} from '../SpatialDisplayContainer'
import SpatialDisplay from '../../../components/SpatialDisplay/SpatialDisplay'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/SpatialDisplay/SpatialDisplay', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SpatialDisplayContainer,
  defaultProps: {
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
})

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
      polygonSearch: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SpatialDisplayContainer component', () => {
  test('passes its props and renders a single SpatialDisplay component', () => {
    const { props } = setup()

    expect(SpatialDisplay).toHaveBeenCalledTimes(1)
    expect(SpatialDisplay).toHaveBeenCalledWith({
      boundingBoxSearch: props.boundingBoxSearch,
      circleSearch: props.circleSearch,
      displaySpatialPolygonWarning: props.displaySpatialPolygonWarning,
      drawingNewLayer: props.drawingNewLayer,
      lineSearch: props.lineSearch,
      onChangeQuery: props.onChangeQuery,
      onRemoveSpatialFilter: props.onRemoveSpatialFilter,
      pointSearch: props.pointSearch,
      polygonSearch: props.polygonSearch
    }, {})
  })
})
