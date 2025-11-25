import {
  screen,
  waitFor,
  within
} from '@testing-library/react'

import AdminRetrievalDetails from '../AdminRetrievalDetails'
import setupTest from '../../../../../../jestConfigs/setupTest'
import ADMIN_RETRIEVAL from '../../../operations/queries/adminRetrieval'
import { routes } from '../../../constants/routes'
import ADMIN_REQUEUE_ORDER from '../../../operations/mutations/adminRequeueOrder'

// @ts-expect-error This file does not have types
import addToast from '../../../util/addToast'

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const adminRetrievalMock = {
  request: {
    query: ADMIN_RETRIEVAL,
    variables: {
      obfuscatedId: '06347346'
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

const setup = setupTest({
  ComponentsByRoute: {
    [`${routes.ADMIN_RETRIEVALS}/:obfuscatedId`]: AdminRetrievalDetails
  },
  defaultPropsByRoute: {
    [`${routes.ADMIN_RETRIEVALS}/:obfuscatedId`]: {
      onRequeueOrder: jest.fn()
    }
  },
  defaultApolloClientMocks: [
    adminRetrievalMock
  ],
  defaultRouterEntries: [`${routes.ADMIN_RETRIEVALS}/06347346`],
  withRouter: true,
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
      const { user } = setup({
        overrideApolloClientMocks: [
          adminRetrievalMock,
          {
            request: {
              query: ADMIN_REQUEUE_ORDER,
              variables: {
                retrievalOrderId: 42
              }
            },
            result: {
              data: {
                adminRequeueOrder: true
              }
            }
          }
        ]
      })

      await waitFor(() => {
        expect(screen.getByText('06347346')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Requeue/ }))

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Order Requeued for processing', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    describe('when the request fails', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [
            adminRetrievalMock,
            {
              request: {
                query: ADMIN_REQUEUE_ORDER,
                variables: {
                  retrievalOrderId: 42
                }
              },
              error: new Error('Failed to requeue order')
            }
          ],
          overrideZustandState: {
            errors: {
              handleError: jest.fn()
            }
          }
        })

        await waitFor(() => {
          expect(screen.getByText('06347346')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /Requeue/ }))

        expect(addToast).toHaveBeenCalledTimes(0)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'requeueOrder',
          error: new Error('Failed to requeue order'),
          notificationType: 'toast',
          resource: 'admin retrievals'
        })
      })
    })
  })
})
