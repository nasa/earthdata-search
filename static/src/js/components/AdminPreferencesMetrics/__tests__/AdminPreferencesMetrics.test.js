import React from 'react'
import ReactDOM from 'react-dom'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import { BrowserRouter } from 'react-router-dom'

import { AdminPreferencesMetrics } from '../AdminPreferencesMetrics'

const setup = () => {
  const metricsPreferences = {
    isLoaded: true,
    isLoading: false,
    preferences: {
      panelState: {},
      granuleSort: {},
      granuleListView: {},
      collectionSort: {},
      collectionListView: {},
      zoom: {},
      latitude: {},
      longitude: {},
      projection: {},
      overlayLayers: {},
      baseLayer: {}
    }
  }
  const onFetchAdminMetricsPreferences = jest.fn()

  const props = {
    onFetchAdminMetricsPreferences,
    metricsPreferences
  }

  // https://testing-library.com/docs/example-react-router/
  render(<AdminPreferencesMetrics {...props} />, { wrapper: BrowserRouter })

  return {
    onFetchAdminMetricsPreferences,
    metricsPreferences
  }
}

describe('AdminPreferencesMetrics component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Preferences Metrics' })).toBeInTheDocument()
  })

  describe('when filtering temporally', () => {
    beforeAll(() => {
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
    })

    afterEach(() => {
      ReactDOM.createPortal.mockClear()
    })

    test('clicking on the temporal filter modal opens it', async () => {
      const {
        onFetchAdminMetricsPreferences
      } = setup()

      expect(onFetchAdminMetricsPreferences).toHaveBeenCalledTimes(1)
    })
  })
})
