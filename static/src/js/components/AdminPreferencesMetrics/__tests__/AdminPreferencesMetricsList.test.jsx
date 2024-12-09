import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'

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

    const tables = screen.getAllByRole('table')

    expect(within(tables[0]).getByRole('columnheader', { name: 'open' })).toBeInTheDocument()
    expect(within(tables[0]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[1]).getByRole('columnheader', { name: 'start_date' })).toBeInTheDocument()
    expect(within(tables[1]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[2]).getByRole('columnheader', { name: 'default' })).toBeInTheDocument()
    expect(within(tables[2]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[3]).getByRole('columnheader', { name: '-score' })).toBeInTheDocument()
    expect(within(tables[3]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[4]).getByRole('columnheader', { name: 'list' })).toBeInTheDocument()
    expect(within(tables[4]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[5]).getByRole('columnheader', { name: '3' })).toBeInTheDocument()
    expect(within(tables[5]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[6]).getByRole('columnheader', { name: '0' })).toBeInTheDocument()
    expect(within(tables[6]).getByRole('cell', { name: '75% (3)' })).toBeInTheDocument()

    expect(within(tables[6]).getByRole('columnheader', { name: '1' })).toBeInTheDocument()
    expect(within(tables[6]).getByRole('cell', { name: '25% (1)' })).toBeInTheDocument()

    expect(within(tables[7]).getByRole('columnheader', { name: '-1' })).toBeInTheDocument()
    expect(within(tables[7]).getByRole('cell', { name: '25% (1)' })).toBeInTheDocument()

    expect(within(tables[7]).getByRole('columnheader', { name: '2' })).toBeInTheDocument()
    expect(within(tables[7]).getByRole('cell', { name: '75% (3)' })).toBeInTheDocument()

    expect(within(tables[8]).getByRole('columnheader', { name: 'epsg4326' })).toBeInTheDocument()
    expect(within(tables[8]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

    expect(within(tables[9]).getByRole('columnheader', { name: 'referenceFeatures' })).toBeInTheDocument()
    expect(within(tables[9]).queryAllByRole('cell', { name: '100% (4)' })[0]).toBeInTheDocument()

    expect(within(tables[9]).getByRole('columnheader', { name: 'referenceLabels' })).toBeInTheDocument()
    expect(within(tables[9]).queryAllByRole('cell', { name: '100% (4)' })[1]).toBeInTheDocument()

    expect(within(tables[10]).getByRole('columnheader', { name: 'blueMarble' })).toBeInTheDocument()
    expect(within(tables[10]).getByRole('cell', { name: '100% (4)' })).toBeInTheDocument()

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

    expect(screen.getByTestId('admin-preferences-metric-list-spinner')).toBeInTheDocument()
  })
})
