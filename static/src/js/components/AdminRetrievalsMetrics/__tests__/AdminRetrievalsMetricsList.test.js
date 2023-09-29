import React from 'react'
import {
  render,
  screen
} from '@testing-library/react'

import '@testing-library/jest-dom'

import { AdminRetrievalsMetricsList } from '../AdminRetrievalsMetricsList'

const setup = (overrideProps) => {
  const props = {
    retrievals: {
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

  // return {
  //   enzymeWrapper,
  //   props
  // }
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

  // todo how to test that the table entries equal something
  test.skip('renders the collections table when collections are provided', () => {
    setup({
      retrievals: {
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
    const rows = screen.getAllByRole('cell')
    const fieldValue = screen.getByRole('row', { name: 'ESI 1 3 3 N/A N/A/' })
    // console.log('🚀 ~ file: AdminRetrievalsMetricsList.test.js:153 ~ test.only ~ fieldValue:', fieldValue)

    screen.debug()
    expect(rows.length).toEqual(7)

    // expect(enzymeWrapper.find('.admin-retrievals-list__table').length).toBe(1)
    // expect(enzymeWrapper.find('.admin-retrievals-list__pagination-wrapper').length).toBe(1)

    // expect(enzymeWrapper.find('.admin-retrievals-list__table tbody tr').length).toBe(1)
    // expect(enzymeWrapper.find('.admin-retrievals-list__table tbody tr td').at(0).text()).toEqual('64')
    // expect(enzymeWrapper.find('.admin-retrievals-list__table tbody tr td').at(1).text()).toEqual('1109324645')
    // expect(enzymeWrapper.find('.admin-retrievals-list__table tbody tr td').at(2).text()).toEqual('edsc-test')
    // expect(enzymeWrapper.find('.admin-retrievals-list__table tbody tr td').at(3).text()).toEqual('2019-08-25T11:59:14.390Z')
  })
})
