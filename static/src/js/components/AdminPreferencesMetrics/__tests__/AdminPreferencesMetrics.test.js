import React from 'react'
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

  const props = {
    metricsPreferences
  }

  // https://testing-library.com/docs/example-react-router/
  render(<AdminPreferencesMetrics {...props} />, { wrapper: BrowserRouter })

  return {
    metricsPreferences
  }
}

describe('AdminPreferencesMetrics component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Preferences Metrics' })).toBeInTheDocument()
  })
})
