import { gql } from '@apollo/client'
import {
  screen,
  waitFor,
  within
} from '@testing-library/react'

import AdminProjectsList from '../AdminProjectsList'
import setupTest from '../../../../../../jestConfigs/setupTest'
import ADMIN_PROJECTS from '../../../operations/queries/adminProjects'

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

// Mock result includes every field typically returned
const defaultApolloClientMocks = [
  {
    request: {
      query: gql(ADMIN_PROJECTS),
      variables: {
        params: {
          limit: 20,
          offset: 0,
          obfuscatedId: undefined,
          ursId: undefined,
          sortKey: undefined
        }
      }
    },
    result: {
      data: {
        adminProjects: {
          adminProjects: [
            {
              id: 64,
              obfuscatedId: '1109324645',
              jsondata: {},
              environment: 'prod',
              createdAt: '2019-08-25T11:59:14.390Z',
              updatedAt: '2019-08-25T11:59:14.390Z',
              name: 'Mock Project',
              path: '/mock-project/64',
              user: {
                id: '1',
                ursId: 'edsc-test'
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
]

const setup = setupTest({
  Component: AdminProjectsList,
  defaultApolloClientMocks,
  withApolloClient: true,
  withRouter: true
})

describe('AdminProjectsList component', () => {
  test('renders itself correctly', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(table).getAllByRole('cell')).toHaveLength(4)
    expect(within(table).getAllByRole('columnheader')[0]).toHaveTextContent('ID')
    expect(within(table).getAllByRole('cell')[0]).toHaveTextContent('64')
    expect(within(table).getAllByRole('columnheader')[1]).toHaveTextContent('Obfuscated ID')
    expect(within(table).getAllByRole('cell')[1]).toHaveTextContent('1109324645')
    expect(within(table).getAllByRole('button')[0]).toHaveTextContent('URS ID')
    expect(within(table).getAllByRole('cell')[2]).toHaveTextContent('edsc-test')
    expect(within(table).getAllByRole('button')[1]).toHaveTextContent('Created')
    expect(within(table).getAllByRole('cell')[3]).toHaveTextContent('2019-08-25T11:59:14.390Z')
  })

  test('navigates to the project page when clicking the project row', async () => {
    setup()
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    const projectRow = screen.getByRole('button', {
      name: /64 1109324645 edsc-test 2019-08-25T11:59:14.390Z/,
      exact: false
    })
    await projectRow.click()
    expect(mockUseNavigate).toHaveBeenCalledTimes(1)
    expect(mockUseNavigate).toHaveBeenCalledWith('/admin/projects/1109324645')
  })

  test('pagination shows next page when enough results', async () => {
    setupTest({
      Component: AdminProjectsList,
      defaultApolloClientMocks: [
        {
          request: {
            query: gql(ADMIN_PROJECTS),
            variables: {
              params: {
                limit: 20,
                offset: 0,
                obfuscatedId: undefined,
                ursId: undefined,
                sortKey: undefined
              }
            }
          },
          result: {
            data: {
              adminProjects: {
                adminProjects: [
                  {
                    id: 64,
                    obfuscatedId: '1109324645',
                    jsondata: {},
                    environment: 'prod',
                    createdAt: '2019-08-25T11:59:14.390Z',
                    updatedAt: '2019-08-25T11:59:14.390Z',
                    name: 'Mock Project',
                    path: '/mock-project/64',
                    user: {
                      id: '1',
                      ursId: 'edsc-test'
                    }
                  }
                ],
                count: 21,
                pageInfo: {
                  currentPage: 1,
                  hasNextPage: true,
                  hasPreviousPage: false,
                  pageCount: 2
                }
              }
            }
          }
        }
      ],
      withApolloClient: true,
      withRouter: true
    })()

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    expect(screen.getByRole('listitem', { name: 'Next Page' })).toBeInTheDocument()
  })
})
