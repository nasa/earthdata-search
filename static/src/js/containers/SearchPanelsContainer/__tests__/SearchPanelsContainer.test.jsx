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
    authToken: '',
    collectionMetadata: {},
    collectionQuery: {},
    collectionsSearch: {},
    collectionSubscriptions: [],
    granuleMetadata: {},
    granuleSearchResults: {},
    granuleQuery: {},
    isExportRunning: {
      csv: false,
      json: false
    },
    location: {},
    match: {
      url: '/search'
    },
    onApplyGranuleFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangePath: jest.fn(),
    onFocusedCollectionChange: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onToggleAboutCwicModal: jest.fn(),
    onTogglePanels: jest.fn(),
    onExport: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    preferences: {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    },
    portal: {
      test: 'portal'
    }
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onApplyGranuleFilters calls actions.applyGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'applyGranuleFilters')

    mapDispatchToProps(dispatch).onApplyGranuleFilters({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('/search')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/search')
  })

  test('onFocusedCollectionChange calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onFocusedCollectionChange('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
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

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels('value')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('value')
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
      focusedCollection: 'collectionId',
      panels: {},
      preferences: {
        preferences: {}
      },
      portal: {},
      query: {
        collection: {}
      },
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
      collectionQuery: {},
      collectionsSearch: {},
      collectionSubscriptions: [],
      granuleMetadata: {},
      granuleSearchResults: {},
      granuleQuery: {},
      isExportRunning: {
        csv: false,
        json: false
      },
      panels: {},
      preferences: {},
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchPanelsContainer component', () => {
  test('passes its props and renders a single SearchPanels component', async () => {
    setup()

    const panels = await screen.findByText('Search Panels')

    expect(panels).toBeInTheDocument()
    expect(SearchPanels).toHaveBeenCalledTimes(1)
    expect(SearchPanels).toHaveBeenCalledWith(
      {
        authToken: '',
        collectionMetadata: {},
        collectionQuery: {},
        collectionSubscriptions: [],
        collectionsSearch: {},
        granuleMetadata: {},
        granuleQuery: {},
        granuleSearchResults: {},
        isExportRunning: {
          csv: false,
          json: false
        },
        onApplyGranuleFilters: expect.any(Function),
        onChangePath: expect.any(Function),
        onChangeQuery: expect.any(Function),
        onExport: expect.any(Function),
        onFocusedCollectionChange: expect.any(Function),
        onMetricsCollectionSortChange: expect.any(Function),
        onToggleAboutCSDAModal: expect.any(Function),
        onToggleAboutCwicModal: expect.any(Function),
        onTogglePanels: expect.any(Function),
        panels: {
          activePanel: '0.0.0',
          isOpen: false
        },
        portal: { test: 'portal' },
        preferences: {
          collectionListView: 'default',
          granuleListView: 'default',
          panelState: 'default'
        }
      },
      {}
    )
  })
})
