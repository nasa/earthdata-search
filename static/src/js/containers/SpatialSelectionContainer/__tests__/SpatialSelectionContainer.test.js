import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SpatialSelectionContainer } from '../SpatialSelectionContainer'
import SpatialSelection from '../../../components/SpatialSelection/SpatialSelection'
import * as metrics from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-leaflet', () => ({
  useMap: jest.fn().mockImplementation(() => ({ mock: 'map' }))
}))

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

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onMetricsMap calls metricsMap', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metrics, 'metricsMap')

    mapDispatchToProps(dispatch).onMetricsMap('type')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('type')
  })

  test('onMetricsSpatialEdit calls metricsSpatialEdit', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metrics, 'metricsSpatialEdit')

    mapDispatchToProps(dispatch).onMetricsSpatialEdit({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onRemoveSpatialFilter calls actions.removeSpatialFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeSpatialFilter')

    mapDispatchToProps(dispatch).onRemoveSpatialFilter()

    expect(spy).toBeCalledTimes(1)
  })

  test('onToggleDrawingNewLayer calls actions.toggleDrawingNewLayer', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleDrawingNewLayer')

    mapDispatchToProps(dispatch).onToggleDrawingNewLayer(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      advancedSearch: {},
      metadata: {
        collection: {}
      },
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
      router: {},
      shapefile: {}
    }

    const expectedState = {
      advancedSearch: {},
      boundingBoxSearch: [],
      circleSearch: [],
      collectionMetadata: {},
      lineSearch: [],
      router: {},
      pointSearch: [],
      polygonSearch: [],
      shapefile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SpatialSelectionContainer component', () => {
  test('passes its props and renders a single SpatialSelection component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SpatialSelection).length).toBe(1)
    expect(enzymeWrapper.find(SpatialSelection).props().boundingBoxSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().circleSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().isOpenSearch).toEqual(false)
    expect(enzymeWrapper.find(SpatialSelection).props().isProjectPage).toEqual(false)
    expect(enzymeWrapper.find(SpatialSelection).props().pointSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().polygonSearch).toEqual(['Test value'])
    expect(enzymeWrapper.find(SpatialSelection).props().onChangeQuery).toEqual(props.onChangeQuery)
    expect(enzymeWrapper.find(SpatialSelection).props().onToggleDrawingNewLayer)
      .toEqual(props.onToggleDrawingNewLayer)
  })
})
