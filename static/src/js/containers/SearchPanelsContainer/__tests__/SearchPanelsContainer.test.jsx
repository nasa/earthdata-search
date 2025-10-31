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
    isExportRunning: {
      csv: false,
      json: false
    },
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
      collectionSubscriptions: [],
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
    const { props } = setup()

    const panels = await screen.findByText('Search Panels')

    expect(panels).toBeInTheDocument()
    expect(SearchPanels).toHaveBeenCalledTimes(1)
    expect(SearchPanels).toHaveBeenCalledWith(
      {
        collectionSubscriptions: [],
        isExportRunning: {
          csv: false,
          json: false
        },
        onChangePath: props.onChangePath,
        onExport: props.onExport,
        onMetricsCollectionSortChange: props.onMetricsCollectionSortChange,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        onToggleAboutCwicModal: props.onToggleAboutCwicModal
      },
      {}
    )
  })
})
