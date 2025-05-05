import React from 'react'

import { render, screen } from '@testing-library/react'

import actions from '../../../actions'
import * as metricsCollectionSortChange from '../../../middleware/metrics/actions'

import SearchPanels from '../../../components/SearchPanels/SearchPanels'
import {
  mapDispatchToProps,
  mapStateToProps,
  SearchPanelsContainer
} from '../SearchPanelsContainer'

jest.mock('../../../components/SearchPanels/SearchPanels', () => jest.fn(() => <div>Search Panels</div>))

const mockOnApplyGranuleFilters = jest.fn
const mockOnChangeQuery = jest.fn
const mockOnChangePath = jest.fn
const mockOnFocusedCollectionChange = jest.fn
const mockOnMetricsCollectionSortChange = jest.fn
const mockOnToggleAboutCSDAModal = jest.fn
const mockOnToggleAboutCwicModal = jest.fn
const mockOnTogglePanels = jest.fn
const mockOnSetActivePanel = jest.fn
const mockOnExport = jest.fn

function setup() {
  const props = {
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
    onApplyGranuleFilters: mockOnApplyGranuleFilters,
    onChangeQuery: mockOnChangeQuery,
    onChangePath: mockOnChangePath,
    onFocusedCollectionChange: mockOnFocusedCollectionChange,
    onMetricsCollectionSortChange: mockOnMetricsCollectionSortChange,
    onToggleAboutCSDAModal: mockOnToggleAboutCSDAModal,
    onToggleAboutCwicModal: mockOnToggleAboutCwicModal,
    onTogglePanels: mockOnTogglePanels,
    onSetActivePanel: mockOnSetActivePanel,
    onExport: mockOnExport,
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
  }

  render(
    <SearchPanelsContainer {...props} />
  )

  return {
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onApplyGranuleFilters calls actions.applyGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'applyGranuleFilters')

    mapDispatchToProps(dispatch).onApplyGranuleFilters({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('/search')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('/search')
  })

  test('onFocusedCollectionChange calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onFocusedCollectionChange('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onMetricsCollectionSortChange calls metricsCollectionSortChange', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsCollectionSortChange, 'metricsCollectionSortChange')

    mapDispatchToProps(dispatch).onMetricsCollectionSortChange({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onSetActivePanel calls actions.setActivePanel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanel')

    mapDispatchToProps(dispatch).onSetActivePanel('panelId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('panelId')
  })

  test('onToggleAboutCSDAModal calls actions.toggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(true)
  })

  test('onToggleAboutCwicModal calls actions.toggleAboutCwicModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCwicModal')

    mapDispatchToProps(dispatch).onToggleAboutCwicModal(true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(true)
  })

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels('value')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('value')
  })

  test('onExport calls actions.exportSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'exportSearch')

    mapDispatchToProps(dispatch).onExport('json')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('json')
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
      expect.objectContaining({
        match: { url: '/search' },
        onSetActivePanel: mockOnSetActivePanel,
        onTogglePanels: mockOnTogglePanels,
        panels: {
          activePanel: '0.0.0',
          isOpen: false
        },
        portal: {
          test: 'portal'
        }
      }),
      {}
    )
  })
})
