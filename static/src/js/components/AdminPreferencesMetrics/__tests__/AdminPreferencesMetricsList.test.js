import React from 'react'
import { render, screen } from '@testing-library/react'

import { AdminPreferencesMetricsList } from '../AdminPreferencesMetricsList'

const setup = (overrideProps) => {
  const props = {
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
      preferencesMetrics: {
        isLoaded: true,
        isLoading: false,
        preferences: {
          panelState: [
            ['open', '100% (4)'] // Column Header 1
          ],
          granuleSort: [
            ['start_date', '100% (4)'] // Column Header 2
          ],
          granuleListView: [
            ['default', '100% (4)'] // Column Header 3
          ],
          collectionSort: [
            ['-score', '100% (4)'] // Column Header 4
          ],
          collectionListView: [
            ['list', '100% (4)'] // Column Header 5
          ],
          zoom: [
            [3, '100% (4)'] // Column Header 6
          ],
          latitude: [
            [0, '75% (3)'], // Column Header 7
            [1, '25% (1)'] // Column Header 8
          ],
          longitude: [
            ['-1', '25% (1)'], // Column Header 9
            [2, '75% (3)'] // Column Header 10
          ],
          projection: [
            ['epsg4326', '100% (4)'] // // Column Header 11
          ],
          overlayLayers: [
            ['referenceFeatures', '100% (4)'], // Column Header 12
            ['referenceLabels', '100% (4)'] // Column Header 13
          ],
          baseLayer: [
            ['blueMarble', '100% (4)'] // Column Header 14
          ]
        }
      }
    })

    // Values render on the table
    // make sure there are 14 column headers
    expect(screen.getAllByRole('columnheader').length).toEqual(14)
    expect(screen.getByLabelText('open 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('open 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('start_date 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('start_date 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('default 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('default 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('-score 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('-score 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('list 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('list 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('3 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('3 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('0 75% (3) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('0 75% (3) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('1 25% (1) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('1 25% (1) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('-1 25% (1) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('-1 25% (1) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('2 75% (3) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('2 75% (3) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('epsg4326 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('epsg4326 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('referenceFeatures 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('referenceFeatures 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('referenceLabels 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('referenceLabels 100% (4) Body')).toBeInTheDocument()

    expect(screen.getByLabelText('blueMarble 100% (4) Header')).toBeInTheDocument()
    expect(screen.getByLabelText('blueMarble 100% (4) Body')).toBeInTheDocument()

    expect(screen.queryAllByLabelText('Preferences Metrics Spinner').length).toEqual(0)
  })

  test('renders spinner when isLoading is true', () => {
    setup({
      preferencesMetrics: {
        isLoaded: false,
        isLoading: true,
        preferences: {}
      }
    })

    expect(screen.getByLabelText('Preferences Metrics Spinner')).toBeInTheDocument()
  })
})
