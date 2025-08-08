import { gql } from '@apollo/client'
import {
  screen,
  waitFor,
  within
} from '@testing-library/react'

import { AdminRetrievalsList } from '../AdminRetrievalsList'
import setupTest from '../../../../../../jestConfigs/setupTest'
import ADMIN_RETRIEVALS from '../../../operations/queries/adminRetrievals'

const setup = setupTest({
  Component: AdminRetrievalsList,
  defaultProps: {
    obfuscatedId: '1',
    historyPush: jest.fn()
  },
  defaultApolloClientMocks: [
    {
      request: {
        query: gql(ADMIN_RETRIEVALS),
        variables: {
          params: {
            limit: 20,
            offset: 0
          }
        }
      },
      result: {
        data: {
          adminRetrievals: {
            adminRetrievals: [
              {
                id: 1,
                obfuscatedId: '1',
                jsondata: {},
                environment: 'prod',
                createdAt: '2019-08-25T11:59:14.390Z',
                updatedAt: '2019-08-25T11:59:14.390Z',
                user: {
                  id: 1,
                  ursId: 'test-ursid'
                }
              }
            ],
            count: 1,
            pageInfo: {
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              pageCount: 1
            }
          }
        }
      }
    }
  ],
  withApolloClient: true
})

describe('AdminRetrievalsList component', () => {
  test('renders itself correctly', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    const table = screen.getByRole('table')

    expect(within(table).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(table).getAllByRole('cell')).toHaveLength(4)
    expect(within(table).getAllByRole('columnheader')[0]).toHaveTextContent('ID')
    expect(within(table).getAllByRole('cell')[0]).toHaveTextContent('1')
    expect(within(table).getAllByRole('columnheader')[1]).toHaveTextContent('Obfuscated ID')
    expect(within(table).getAllByRole('cell')[1]).toHaveTextContent('1')
    expect(within(table).getAllByRole('button')[0]).toHaveTextContent('URS ID')
    expect(within(table).getAllByRole('cell')[2]).toHaveTextContent('test-ursid')
    expect(within(table).getAllByRole('button')[1]).toHaveTextContent('Created')
    expect(within(table).getAllByRole('cell')[3]).toHaveTextContent('2019-08-25T11:59:14.390Z')
  })
})
