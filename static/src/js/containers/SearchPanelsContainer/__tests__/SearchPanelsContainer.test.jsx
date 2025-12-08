import React from 'react'

import { screen } from '@testing-library/react'

import actions from '../../../actions'
import * as metricsCollectionSortChange from '../../../middleware/metrics/actions'

import SearchPanels from '../../../components/SearchPanels/SearchPanels'
import {
  mapDispatchToProps,
  mapStateToProps,
  SearchPanelsContainer
} from '../SearchPanelsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/SearchPanels/SearchPanels', () => jest.fn(() => <div>Search Panels</div>))

const setup = setupTest({
  Component: SearchPanelsContainer,
  defaultProps: {
    collectionSubscriptions: [],
    onChangePath: jest.fn(),
    onMetricsCollectionSortChange: jest.fn()
  },
  defaultZustandState: {
    preferences: {
      preferences: {
        panelState: 'default',
        collectionListView: 'default',
        granuleListView: 'default',
        collectionSort: 'default',
        granuleSort: 'default',
        mapView: {
          zoom: 3,
          latitude: 0,
          longitude: 0,
          projection: 'epsg4326',
          baseLayer: 'worldImagery',
          overlayLayers: ['bordersRoads', 'placeLabels'],
          rotation: 0
        }
      }
    }
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('/search')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/search')
  })

  test('onMetricsCollectionSortChange calls metricsCollectionSortChange', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsCollectionSortChange, 'metricsCollectionSortChange')

    mapDispatchToProps(dispatch).onMetricsCollectionSortChange({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {}

    const expectedState = {
      collectionSubscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchPanelsContainer component', () => {
  test('passes its props and renders a single SearchPanels component', async () => {
    const { props } = setup()

    const panels = await screen.findByText('Search Panels')

    expect(panels).toBeInTheDocument()
    expect(SearchPanels).toHaveBeenCalledTimes(1)
    expect(SearchPanels).toHaveBeenCalledWith(
      {
        collectionSubscriptions: [],
        onChangePath: props.onChangePath,
        onMetricsCollectionSortChange: props.onMetricsCollectionSortChange
      },
      {}
    )
  })
})
