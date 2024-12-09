import React from 'react'
import { render, screen } from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'

import { AdminPreferencesMetrics } from '../AdminPreferencesMetrics'

const setup = () => {
  const preferencesMetrics = {
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

  const props = {
    preferencesMetrics
  }

  render(
    <MemoryRouter>
      <AdminPreferencesMetrics {...props} />
    </MemoryRouter>
  )

  return {
    preferencesMetrics
  }
}

describe('AdminPreferencesMetrics component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Preferences Metrics' })).toBeInTheDocument()
  })
})
