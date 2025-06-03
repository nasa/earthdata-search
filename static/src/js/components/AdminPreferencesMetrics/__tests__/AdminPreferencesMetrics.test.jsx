import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminPreferencesMetrics from '../AdminPreferencesMetrics'
import AdminPreferencesMetricsList from '../AdminPreferencesMetricsList'

jest.mock('../AdminPreferencesMetricsList', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminPreferencesMetrics,
  defaultProps: {
    preferencesMetrics: {
      isLoaded: true,
      isLoading: false,
      preferences: {
        panelState: [],
        granuleSort: [],
        granuleListView: [],
        collectionSort: [],
        collectionListView: [],
        zoom: [],
        latitude: [],
        longitude: [],
        projection: [],
        overlayLayers: [],
        baseLayer: []
      }
    }
  },
  withRouter: true
})

describe('AdminPreferencesMetrics component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(AdminPreferencesMetricsList).toHaveBeenCalledTimes(1)
    expect(AdminPreferencesMetricsList).toHaveBeenCalledWith({
      preferencesMetrics: {
        isLoaded: true,
        isLoading: false,
        preferences: {
          panelState: [],
          granuleSort: [],
          granuleListView: [],
          collectionSort: [],
          collectionListView: [],
          zoom: [],
          latitude: [],
          longitude: [],
          projection: [],
          overlayLayers: [],
          baseLayer: []
        }
      }
    }, {})
  })
})
