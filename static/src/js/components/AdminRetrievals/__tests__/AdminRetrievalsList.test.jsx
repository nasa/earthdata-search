import {
  screen,
  waitFor,
  within
} from '@testing-library/react'

import AdminRetrievalsList from '../AdminRetrievalsList'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import ADMIN_RETRIEVALS from '../../../operations/queries/adminRetrievals'
import { routes } from '../../../constants/routes'
import { adminSortKeys } from '../../../constants/adminSortKeys'

const mockUseNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockUseNavigate
}))

const defaultApolloClientMocks = [
  {
    request: {
      query: ADMIN_RETRIEVALS,
      variables: {
        limit: 20,
        offset: 0
      }
    },
    result: {
      data: {
        adminRetrievals: {
          adminRetrievals: [
            {
              id: 1,
              obfuscatedId: '1234',
              jsondata: {},
              environment: 'prod',
              createdAt: '2019-08-25T11:59:14.390Z',
              updatedAt: '2019-08-25T11:59:14.390Z',
              user: {
                id: 1,
                ursId: 'test-ursid1'
              }
            }, {
              id: 2,
              obfuscatedId: '5678',
              jsondata: {},
              environment: 'prod',
              createdAt: '2019-08-26T11:59:14.390Z',
              updatedAt: '2019-08-26T11:59:14.390Z',
              user: {
                id: 2,
                ursId: 'test-ursid2'
              }
            }
          ],
          count: 2,
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
  Component: AdminRetrievalsList,
  defaultApolloClientMocks,
  withRouter: true,
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
    expect(within(table).getAllByRole('columnheader')[0]).toHaveTextContent('ID')
    expect(within(table).getAllByRole('columnheader')[1]).toHaveTextContent('Obfuscated ID')
    expect(within(table).getAllByRole('button')[0]).toHaveTextContent('URS ID')
    expect(within(table).getAllByRole('button')[1]).toHaveTextContent('Created')

    expect(within(table).getAllByRole('cell')).toHaveLength(8)
    expect(within(table).getAllByRole('cell')[0]).toHaveTextContent('1')
    expect(within(table).getAllByRole('cell')[1]).toHaveTextContent('1234')
    expect(within(table).getAllByRole('cell')[2]).toHaveTextContent('test-ursid1')
    expect(within(table).getAllByRole('cell')[3]).toHaveTextContent('2019-08-25T11:59:14.390Z')

    expect(within(table).getAllByRole('cell')[4]).toHaveTextContent('2')
    expect(within(table).getAllByRole('cell')[5]).toHaveTextContent('5678')
    expect(within(table).getAllByRole('cell')[6]).toHaveTextContent('test-ursid2')
    expect(within(table).getAllByRole('cell')[7]).toHaveTextContent('2019-08-26T11:59:14.390Z')
  })

  describe('when clicking the retrieval row', () => {
    test('navigates to the retrieval page', async () => {
      const { user } = setup()

      expect(await screen.findByRole('table')).toBeInTheDocument()

      const retrievalRow = screen.getByRole('button', {
        name: /1 1234 test-ursid1 2019-08-25T11:59:14.390Z/
      })

      await user.click(retrievalRow)

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith(`${routes.ADMIN_RETRIEVALS}/1234`)
    })
  })

  describe('when sorting the table', () => {
    describe('when clicking on the URS ID heading', () => {
      test('sorts the table by URS ID descending', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [
            ...defaultApolloClientMocks,
            {
              request: {
                query: ADMIN_RETRIEVALS,
                variables: {
                  limit: 20,
                  offset: 0,
                  sortKey: adminSortKeys.ursIdDescending
                }
              },
              result: {
                data: {
                  adminRetrievals: {
                    adminRetrievals: [
                      {
                        id: 2,
                        obfuscatedId: '1234',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-25T11:59:14.390Z',
                        updatedAt: '2019-08-25T11:59:14.390Z',
                        user: {
                          id: 2,
                          ursId: 'test-ursid2'
                        }
                      }, {
                        id: 1,
                        obfuscatedId: '5678',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-25T11:59:14.390Z',
                        updatedAt: '2019-08-25T11:59:14.390Z',
                        user: {
                          id: 1,
                          ursId: 'test-ursid1'
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
            },
            {
              request: {
                query: ADMIN_RETRIEVALS,
                variables: {
                  limit: 20,
                  offset: 0,
                  sortKey: adminSortKeys.ursIdAscending
                }
              },
              result: {
                data: {
                  adminRetrievals: {
                    adminRetrievals: [
                      {
                        id: 1,
                        obfuscatedId: '5678',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-25T11:59:14.390Z',
                        updatedAt: '2019-08-25T11:59:14.390Z',
                        user: {
                          id: 1,
                          ursId: 'test-ursid1'
                        }
                      }, {
                        id: 2,
                        obfuscatedId: '1234',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-25T11:59:14.390Z',
                        updatedAt: '2019-08-25T11:59:14.390Z',
                        user: {
                          id: 2,
                          ursId: 'test-ursid2'
                        }
                      }
                    ],
                    count: 2,
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
        })

        expect(await screen.findByRole('table')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'URS ID' }))

        expect(within(screen.getByRole('table')).getAllByRole('cell')[2]).toHaveTextContent('test-ursid2')
        expect(within(screen.getByRole('table')).getAllByRole('cell')[6]).toHaveTextContent('test-ursid1')

        // Click on the sort button again to reverse the order
        await user.click(screen.getByRole('button', { name: 'URS ID' }))

        expect(within(screen.getByRole('table')).getAllByRole('cell')[2]).toHaveTextContent('test-ursid1')
        expect(within(screen.getByRole('table')).getAllByRole('cell')[6]).toHaveTextContent('test-ursid2')

        // Click on the sort button again to reset the sort
        await user.click(screen.getByRole('button', { name: 'URS ID' }))

        expect(within(screen.getByRole('table')).getAllByRole('cell')[2]).toHaveTextContent('test-ursid1')
        expect(within(screen.getByRole('table')).getAllByRole('cell')[6]).toHaveTextContent('test-ursid2')
      })
    })

    describe('when clicking on the Created heading', () => {
      test('sorts the table by URS ID descending', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [
            ...defaultApolloClientMocks,
            {
              request: {
                query: ADMIN_RETRIEVALS,
                variables: {
                  limit: 20,
                  offset: 0,
                  sortKey: adminSortKeys.createdAtDescending
                }
              },
              result: {
                data: {
                  adminRetrievals: {
                    adminRetrievals: [
                      {
                        id: 2,
                        obfuscatedId: '1234',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-26T11:59:14.390Z',
                        updatedAt: '2019-08-26T11:59:14.390Z',
                        user: {
                          id: 2,
                          ursId: 'test-ursid2'
                        }
                      }, {
                        id: 1,
                        obfuscatedId: '5678',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-25T11:59:14.390Z',
                        updatedAt: '2019-08-25T11:59:14.390Z',
                        user: {
                          id: 1,
                          ursId: 'test-ursid1'
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
            },
            {
              request: {
                query: ADMIN_RETRIEVALS,
                variables: {
                  limit: 20,
                  offset: 0,
                  sortKey: adminSortKeys.createdAtAscending
                }
              },
              result: {
                data: {
                  adminRetrievals: {
                    adminRetrievals: [
                      {
                        id: 1,
                        obfuscatedId: '5678',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-25T11:59:14.390Z',
                        updatedAt: '2019-08-25T11:59:14.390Z',
                        user: {
                          id: 1,
                          ursId: 'test-ursid1'
                        }
                      }, {
                        id: 2,
                        obfuscatedId: '1234',
                        jsondata: {},
                        environment: 'prod',
                        createdAt: '2019-08-26T11:59:14.390Z',
                        updatedAt: '2019-08-26T11:59:14.390Z',
                        user: {
                          id: 2,
                          ursId: 'test-ursid2'
                        }
                      }
                    ],
                    count: 2,
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
        })

        expect(await screen.findByRole('table')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Created' }))

        expect(within(screen.getByRole('table')).getAllByRole('cell')[3]).toHaveTextContent('2019-08-26T11:59:14.390Z')
        expect(within(screen.getByRole('table')).getAllByRole('cell')[7]).toHaveTextContent('2019-08-25T11:59:14.390Z')

        // Click on the sort button again to reverse the order
        await user.click(screen.getByRole('button', { name: 'Created' }))

        expect(within(screen.getByRole('table')).getAllByRole('cell')[3]).toHaveTextContent('2019-08-25T11:59:14.390Z')
        expect(within(screen.getByRole('table')).getAllByRole('cell')[7]).toHaveTextContent('2019-08-26T11:59:14.390Z')

        // Click on the sort button again to reset the sort
        await user.click(screen.getByRole('button', { name: 'Created' }))

        expect(within(screen.getByRole('table')).getAllByRole('cell')[3]).toHaveTextContent('2019-08-25T11:59:14.390Z')
        expect(within(screen.getByRole('table')).getAllByRole('cell')[7]).toHaveTextContent('2019-08-26T11:59:14.390Z')
      })
    })
  })
})
