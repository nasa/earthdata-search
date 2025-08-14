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
import { initialState } from '../../../zustand/slices/createQuerySlice'

jest.mock('../../../components/SearchPanels/SearchPanels', () => jest.fn(() => <div>Search Panels</div>))

const setup = setupTest({
  Component: SearchPanelsContainer,
  defaultProps: {
    authToken: '',
    collectionMetadata: {},
    collectionsSearch: {},
    collectionSubscriptions: [],
    granuleMetadata: {},
    granuleSearchResults: {},
    isExportRunning: {
      csv: false,
      json: false
    },
    location: {},
    match: {
      url: '/search'
    },
    onChangePath: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onToggleAboutCwicModal: jest.fn(),
    onExport: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    }
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
  }
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

  test('onToggleAboutCSDAModal calls actions.toggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

  test('onToggleAboutCwicModal calls actions.toggleAboutCwicModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCwicModal')

    mapDispatchToProps(dispatch).onToggleAboutCwicModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

  test('onExport calls actions.exportSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'exportSearch')

    mapDispatchToProps(dispatch).onExport('json')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('json')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      metadata: {
        collections: {}
      },
      panels: {},
      searchResults: {
        collections: {}
      },
      ui: {
        export: {
          isExportRunning: {
            csv: false,
            json: false
          }
        }
      }
    }

    const expectedState = {
      authToken: 'mock-token',
      collectionMetadata: {},
      collectionsSearch: {},
      collectionSubscriptions: [],
      granuleMetadata: {},
      granuleSearchResults: {},
      isExportRunning: {
        csv: false,
        json: false
      }
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchPanelsContainer component', () => {
  test('passes its props and renders a single SearchPanels component', async () => {
    const { props, zustandState } = setup()

    const panels = await screen.findByText('Search Panels')

    expect(panels).toBeInTheDocument()
    expect(SearchPanels).toHaveBeenCalledTimes(1)
    expect(SearchPanels).toHaveBeenCalledWith(
      {
        authToken: '',
        changeFocusedCollection: zustandState.focusedCollection.changeFocusedCollection,
        collectionMetadata: {},
        collectionQuery: initialState.collection,
        collectionSubscriptions: [],
        collectionsSearch: {},
        granuleMetadata: {},
        granuleQuery: {},
        granuleSearchResults: {},
        isExportRunning: {
          csv: false,
          json: false
        },
        location: {},
        match: { url: '/search' },
        onApplyGranuleFilters: zustandState.query.changeGranuleQuery,
        onChangePath: props.onChangePath,
        onChangeQuery: zustandState.query.changeQuery,
        onExport: props.onExport,
        onMetricsCollectionSortChange: props.onMetricsCollectionSortChange,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        onToggleAboutCwicModal: props.onToggleAboutCwicModal,
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
      },
      {}
    )
  })
})
