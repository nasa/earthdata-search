import {
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { gql } from '@apollo/client'

import { AdminRetrievalDetails } from '../AdminRetrievalDetails'
import setupTest from '../../../../../../jestConfigs/setupTest'
import ADMIN_RETRIEVAL from '../../../operations/queries/adminRetrieval'

const setup = setupTest({
  Component: AdminRetrievalDetails,
  defaultProps: {
    obfuscatedId: '06347346',
    onRequeueOrder: jest.fn()
  },
  defaultApolloClientMocks: [
    {
      request: {
        query: gql(ADMIN_RETRIEVAL),
        variables: {
          params: {
            obfuscatedId: '06347346'
          }
        }
      },
      result: {
        data: {
          adminRetrieval: {
            id: 1,
            obfuscatedId: '06347346',
            jsondata: {
              portal_id: 'testPortal',
              source: '?mock-source'
            },
            environment: 'prod',
            user: {
              id: 1,
              ursId: 'test-ursid'
            },
            createdAt: '2024-08-25T11:59:14.390Z',
            updatedAt: '2024-08-25T11:59:14.390Z',
            retrievalCollections: [{
              id: 1,
              accessMethod: {
                type: 'Harmony'
              },
              collectionId: 'C123451234-EDSC',
              collectionMetadata: {
                dataCenter: 'EDSC'
              },
              granuleCount: 4,
              createdAt: '2024-08-25T11:59:14.390Z',
              updatedAt: '2024-08-25T11:59:14.390Z',
              retrievalOrders: [
                {
                  id: 42,
                  state: 'initialized',
                  orderInformation: {
                    jobId: '12341234-asdfasdf-12341234-asdfasdf'
                  },
                  orderNumber: '12341234-asdfasdf-12341234-asdfasdf',
                  type: 'Harmony',
                  createdAt: '2024-08-25T11:59:14.390Z',
                  updatedAt: '2024-08-25T11:59:14.390Z'
                }
              ]
            }]
          }
        }
      }
    }
  ],
  withApolloClient: true
})

describe('AdminRetrievalDetails component', () => {
  test('should render the site AdminRetrievalDetails', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByText('06347346')).toBeInTheDocument()
    })
  })

  describe('with collections', () => {
    test('should render collections', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByText('06347346')).toBeInTheDocument()
      })

      expect(screen.getByText('test-ursid')).toBeInTheDocument()
      expect(screen.getByText('/portal/testPortal/search?mock-source')).toBeInTheDocument()

      expect(screen.getByRole('heading', { name: 'C123451234-EDSC' })).toBeInTheDocument()
      expect(screen.getByRole('definition', { name: 'Retrieval Collection ID' })).toHaveTextContent('C123451234-EDSC')
      expect(screen.getByRole('definition', { name: 'Type' })).toHaveTextContent('Harmony')
      expect(screen.getByRole('definition', { name: 'Data Provider' })).toHaveTextContent('EDSC')
      expect(screen.getByRole('definition', { name: 'Order Count' })).toHaveTextContent('1')
      expect(screen.getByRole('definition', { name: 'Granule Count' })).toHaveTextContent('4')
      expect(screen.getByRole('definition', { name: 'Created' })).toHaveTextContent('2024-08-25T11:59:14.390Z')
      expect(screen.getByRole('definition', { name: 'Updated' })).toHaveTextContent('2024-08-25T11:59:14.390Z')
    })
  })

  describe('with orders', () => {
    test('should render orders', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByText('06347346')).toBeInTheDocument()
      })

      const table = screen.getByRole('table')
      const rows = screen.getAllByRole('row')
      const row1Data = within(rows[1]).getAllByRole('cell')

      expect(table).toBeInTheDocument()
      expect(rows).toHaveLength(2)

      expect(within(table).getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
      expect(within(table).getByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
      expect(within(table).getByRole('columnheader', { name: 'Order Number' })).toBeInTheDocument()
      expect(within(table).getByRole('columnheader', { name: 'Type' })).toBeInTheDocument()
      expect(within(table).getByRole('columnheader', { name: 'State' })).toBeInTheDocument()
      expect(within(table).getByRole('columnheader', { name: 'Details' })).toBeInTheDocument()

      expect(row1Data[0]).toHaveTextContent('Requeue')
      expect(row1Data[1]).toHaveTextContent('42')
      expect(row1Data[2]).toHaveTextContent('12341234-asdfasdf-12341234-asdfasdf')
      expect(row1Data[3]).toHaveTextContent('Harmony')
      expect(row1Data[4]).toHaveTextContent('initialized')
      expect(row1Data[5]).toHaveTextContent('{"jobId":"12341234-asdfasdf-12341234-asdfasdf"}')
    })
  })

  describe('when clicking Requeue order button', () => {
    test('clicking on the Requeue button calls onRequeueOrder', async () => {
      const user = userEvent.setup()
      const onRequeueOrderMock = jest.fn()

      setup({
        overrideProps: {
          onRequeueOrder: onRequeueOrderMock
        }
      })

      await waitFor(() => {
        expect(screen.getByText('06347346')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Requeue/ }))

      expect(onRequeueOrderMock).toHaveBeenCalledTimes(1)
      expect(onRequeueOrderMock).toHaveBeenCalledWith(42)
    })
  })
})
