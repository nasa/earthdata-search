import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SpatialDisplayContainer } from '../SpatialDisplayContainer'
import SpatialDisplay from '../../../components/SpatialDisplay/SpatialDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    boundingBoxSearch: 'Test Bounding Box',
    drawingNewLayer: false,
    gridName: 'Test Grid',
    gridCoords: 'Test Grid Coords',
    lineSearch: 'Test Line',
    onChangeQuery: jest.fn(),
    onGranuleGridCoords: jest.fn(),
    onRemoveGridFilter: jest.fn(),
    onRemoveSpatialFilter: jest.fn(),
    pointSearch: 'Test Point Search',
    polygonSearch: 'Test Polygon Search',
    selectingNewGrid: false,
    shapefile: {}
  }

  const enzymeWrapper = shallow(<SpatialDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialDisplayContainer component', () => {
  test('passes its props and renders a single SpatialDisplay component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SpatialDisplay).length).toBe(1)
    expect(enzymeWrapper.find(SpatialDisplay).props()).toEqual({
      boundingBoxSearch: 'Test Bounding Box',
      drawingNewLayer: false,
      gridName: 'Test Grid',
      gridCoords: 'Test Grid Coords',
      lineSearch: 'Test Line',
      onChangeQuery: props.onChangeQuery,
      onGranuleGridCoords: props.onGranuleGridCoords,
      onRemoveGridFilter: props.onRemoveGridFilter,
      onRemoveSpatialFilter: props.onRemoveSpatialFilter,
      pointSearch: 'Test Point Search',
      polygonSearch: 'Test Polygon Search',
      selectingNewGrid: false,
      shapefile: {}
    })
  })
})
