import React from 'react'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import { AdminRetrievalsMetricsList } from '../AdminRetrievalsMetricsList'

const setup = (overrideProps) => {
  const props = {
    metricsRetrievals: {
      isLoaded: true,
      isLoading: false,
      accessMethodType: {},
      allAccessMethodTypes: [
      ],
      multCollectionResponse: [],
      byAccessMethodType: {},
      startDate: '',
      endDate: ''
    },
    ...overrideProps
  }

  render(<AdminRetrievalsMetricsList {...props} />)
}

describe('AdminRetrievalsList component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getAllByRole('columnheader').length).toEqual(8)

    // Retrieval metrics table
    expect(screen.getByRole('columnheader', { name: 'Data Access Type' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Total Times Access Method Used' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Average Granule Count' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Total Granules Retrieved' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Max Granule Link Count' }))
      .toBeInTheDocument()

    // Retrieval use table
    expect(screen.getByRole('columnheader', { name: 'Minimum Granule Link Count' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Retrieval-id for retrievals that included multiple collections' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Number of collections in the retrieval' }))
  })

  // Todo how to test that the table entries equal something
  test('renders the collections table when collections are provided', () => {
    setup({
      metricsRetrievals: {
        allAccessMethodTypes: [
          'ESI',
          'Harmony',
          'OPeNDAP',
          'ECHO ORDERS',
          'download'
        ],
        accessMethodType: {},
        multCollectionResponse: [
          {
            retrieval_id: 112,
            count: '2'
          },
          {
            retrieval_id: 5,
            count: '2'
          },
          {
            retrieval_id: 74,
            count: '3'
          },
          {
            retrieval_id: 110,
            count: '2'
          }
        ],
        isLoading: false,
        isLoaded: true,
        sortKey: '',
        pagination: {
          pageSize: 20,
          pageNum: 1,
          pageCount: null,
          totalResults: null
        },
        startDate: '2019-02-12T00:00:00.000Z',
        endDate: '2023-09-28T23:59:59.999Z',
        byAccessMethodType: {
          ESI: {
            access_method_type: 'ESI',
            total_times_access_method_used: '1',
            average_granule_count: '3',
            average_granule_link_count: '0',
            total_granules_retrieved: '3',
            max_granule_link_count: 0,
            min_granule_link_count: 0
          },
          Harmony: {
            access_method_type: 'Harmony',
            total_times_access_method_used: '1',
            average_granule_count: '59416',
            average_granule_link_count: null,
            total_granules_retrieved: '59416',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          OPeNDAP: {
            access_method_type: 'OPeNDAP',
            total_times_access_method_used: '2',
            average_granule_count: '1',
            average_granule_link_count: null,
            total_granules_retrieved: '2',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          'ECHO ORDERS': {
            access_method_type: 'ECHO ORDERS',
            total_times_access_method_used: '3',
            average_granule_count: '7',
            average_granule_link_count: null,
            total_granules_retrieved: '22',
            max_granule_link_count: null,
            min_granule_link_count: null
          },
          download: {
            access_method_type: 'download',
            total_times_access_method_used: '121',
            average_granule_count: '208',
            average_granule_link_count: '33',
            total_granules_retrieved: '25218',
            max_granule_link_count: 167,
            min_granule_link_count: 0
          }
        }
      }
    })

    // Values render on the table
    expect(screen.getByText('25218')).toBeInTheDocument()
    expect(screen.getByText('download')).toBeInTheDocument()
    expect(screen.getByText('121')).toBeInTheDocument()

    // Values which were `null` fill in as `N/A`
    expect(screen.getAllByText(/N\/A/).length).toBe(7)
  })
})
