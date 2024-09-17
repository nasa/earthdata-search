import React from 'react'
import { render, screen } from '@testing-library/react'

import { AdminPreferencesMetricsList } from '../AdminPreferencesMetricsList'

const setup = (overrideProps) => {
  const props = {
    metricsPreferences: {
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
    },
    ...overrideProps
  }

  render(<AdminPreferencesMetricsList {...props} />)
}

describe('AdminPreferencesMetricsList component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getAllByRole('heading').length).toEqual(11)

    // Retrieval metrics table
    expect(screen.getByRole('heading', { name: 'Top Panel State Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Granule Sort Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Granule List View Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Collection Sort Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Collection List View Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Zoom Values' }))
      .toBeInTheDocument()

    // Retrieval use table
    expect(screen.getByRole('heading', { name: 'Top Latitude Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Longitude Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Projection Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Overlay Layers Values' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Top Base Layer Values' }))
      .toBeInTheDocument()
  })

  test('renders the collections table when collections are provided', () => {
    setup({
      metricsPreferences: {
        isLoaded: true,
        isLoading: false,
        preferences: {
          panelState: [
            ['open', '100% (4)']
          ],
          granuleSort: [
            ['start_date', '100% (4)']
          ],
          granuleListView: [
            ['default', '100% (4)']
          ],
          collectionSort: [
            ['-score', '100% (4)']
          ],
          collectionListView: [
            ['list', '100% (4)']
          ],
          zoom: [
            [3, '100% (4)']
          ],
          latitude: [
            [0, '75% (3)'],
            [1, '25% (1)']
          ],
          longitude: [
            ['-1', '25% (1)'],
            [2, '75% (3)']
          ],
          projection: [
            ['epsg4326', '100% (4)']
          ],
          overlayLayers: [
            ['referenceFeatures', '100% (4)'],
            ['referenceLabels', '100% (4)']
          ],
          baseLayer: [
            ['blueMarble', '100% (4)']
          ]
        }
      }
    })

    // Values render on the table
    expect(screen.getByRole('columnheader', { name: 'open' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'start_date' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'default' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '-score' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'list' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '0' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '-1' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'epsg4326' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'referenceFeatures' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'referenceLabels' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'blueMarble' })).toBeInTheDocument()

    expect(screen.getAllByRole('cell', { name: '100% (4)' }).length).toBe(10)
    expect(screen.getAllByRole('cell', { name: '25% (1)' }).length).toBe(2)
    expect(screen.getAllByRole('cell', { name: '75% (3)' }).length).toBe(2)
  })
})
