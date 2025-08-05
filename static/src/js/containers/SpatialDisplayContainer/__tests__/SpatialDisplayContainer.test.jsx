import React from 'react'

import { mapStateToProps, SpatialDisplayContainer } from '../SpatialDisplayContainer'
import SpatialDisplay from '../../../components/SpatialDisplay/SpatialDisplay'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/SpatialDisplay/SpatialDisplay', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SpatialDisplayContainer,
  defaultProps: {
    displaySpatialPolygonWarning: false,
    drawingNewLayer: false
  }
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
      displaySpatialPolygonWarning: false,
      drawingNewLayer: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SpatialDisplayContainer component', () => {
  test('passes its props and renders a single SpatialDisplay component', () => {
    const { props } = setup()

    expect(SpatialDisplay).toHaveBeenCalledTimes(1)
    expect(SpatialDisplay).toHaveBeenCalledWith({
      displaySpatialPolygonWarning: props.displaySpatialPolygonWarning,
      drawingNewLayer: props.drawingNewLayer
    }, {})
  })
})
