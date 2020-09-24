import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { SpatialSelectionContainer } from '../SpatialSelectionContainer'
import SpatialSelection from '../../../components/SpatialSelection/SpatialSelection'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    advancedSearch: {
      regionSearch: {}
    },
    boundingBoxSearch: ['Test value'],
    circleSearch: ['Test value'],
    collectionMetadata: {},
    mapRef: {
      leafletElement: {}
    },
    onChangeQuery: jest.fn(),
    onToggleDrawingNewLayer: jest.fn(),
    router: {
      location: {
        pathname: '/search'
      }
    },
    pointSearch: ['Test value'],
    polygonSearch: ['Test value'],
    onMetricsMap: jest.fn(),
    onMetricsSpatialEdit: jest.fn(),
    onRemoveSpatialFilter: jest.fn()
  }

  const enzymeWrapper = shallow(<SpatialSelectionContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialSelectionContainer component', () => {
  test('passes its props and renders a single SpatialSelection component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SpatialSelection).length).toBe(1)
    expect(enzymeWrapper.find(SpatialSelection).props().boundingBoxSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().circleSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().isCwic).toEqual(false)
    expect(enzymeWrapper.find(SpatialSelection).props().isProjectPage).toEqual(false)
    expect(enzymeWrapper.find(SpatialSelection).props().pointSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().polygonSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().onChangeQuery).toEqual(props.onChangeQuery)
    expect(enzymeWrapper.find(SpatialSelection).props().onToggleDrawingNewLayer)
      .toEqual(props.onToggleDrawingNewLayer)
  })
})
