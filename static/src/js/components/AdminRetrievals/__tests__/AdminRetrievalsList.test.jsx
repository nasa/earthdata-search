import React from 'react'
import { screen } from '@testing-library/react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminRetrievalsList from '../AdminRetrievalsList'
import useEdscStore from '../../../zustand/useEdscStore'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

jest.mock('../../EDSCIcon/EDSCIcon', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminRetrievalsList,
  defaultProps: {
    onAdminViewRetrieval: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {
      allIds: [],
      byId: {},
      pagination: {
        pageNum: 1,
        pageSize: 20,
        totalResults: 70
      },
      sortKey: ''
    }
  }
})

describe('AdminRetrievalsList component', () => {
  describe('when retrievals are not provided', () => {
    test('renders itself correctly', () => {
      setup()

      // User and Created sort buttons
      expect(screen.getAllByRole('button').length).toBe(2)

      // One row for the table header
      expect(screen.queryAllByRole('row')).toHaveLength(1)
    })
  })

  describe('when retrievals are provided', () => {
    test('renders the table', () => {
      setup({
        overrideProps: {
          retrievals: {
            allIds: ['1109324645'],
            byId: {
              1109324645: {
                id: 64,
                jsondata: {},
                environment: 'prod',
                created_at: '2019-08-25T11:59:14.390Z',
                user_id: 1,
                username: 'edsc-test',
                total: 40,
                obfuscated_id: '1109324645'
              }
            },
            pagination: {
              pageNum: 1,
              pageSize: 20,
              totalResults: 1
            },
            sortKey: ''
          }
        }
      })

      // One row for the table header
      expect(screen.queryAllByRole('row')).toHaveLength(1)

      // User and Created sort buttons, plus table row button
      expect(screen.getAllByRole('button').length).toBe(3)

      const tableRow = screen.getByRole('button', {
        name: '64 1109324645 edsc-test 2019-08-25T11:59:14.390Z'
      })
      expect(tableRow).toBeInTheDocument()
    })

    describe('when clicking the User sort button', () => {
      test('calls the onUpdateAdminRetrievalsSortKey with the correct sort key', async () => {
        const { props, user } = setup()

        const createdSortButton = screen.getByRole('button', { name: 'User' })
        await user.click(createdSortButton)

        expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledWith('-username')
      })

      describe('when clicking the User sort button with the sort set to -username', () => {
        test('calls the onUpdateAdminRetrievalsSortKey with the reverse sort key', async () => {
          const { props, user } = setup({
            overrideProps: {
              retrievals: {
                allIds: [],
                byId: {},
                pagination: {
                  pageNum: 1,
                  pageSize: 20,
                  totalResults: 70
                },
                sortKey: '-username'
              }
            }
          })

          expect(EDSCIcon).toHaveBeenCalledTimes(1)
          expect(EDSCIcon).toHaveBeenCalledWith(
            expect.objectContaining({
              icon: FaCaretDown
            }),
            {}
          )

          const createdSortButton = screen.getByRole('button', { name: 'User' })
          await user.click(createdSortButton)

          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledTimes(1)
          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledWith('+username')
        })
      })

      describe('when clicking the User sort button with the sort set to +username', () => {
        test('calls the onUpdateAdminRetrievalsSortKey with the no sort key', async () => {
          const { props, user } = setup({
            overrideProps: {
              retrievals: {
                allIds: [],
                byId: {},
                pagination: {
                  pageNum: 1,
                  pageSize: 20,
                  totalResults: 70
                },
                sortKey: '+username'
              }
            }
          })

          expect(EDSCIcon).toHaveBeenCalledTimes(1)
          expect(EDSCIcon).toHaveBeenCalledWith(
            expect.objectContaining({
              icon: FaCaretUp
            }),
            {}
          )

          const createdSortButton = screen.getByRole('button', { name: 'User' })
          await user.click(createdSortButton)

          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledTimes(1)
          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledWith('')
        })
      })
    })

    describe('when clicking the Created sort button', () => {
      test('calls the onUpdateAdminRetrievalsSortKey with the correct sort key', async () => {
        const { props, user } = setup()

        const createdSortButton = screen.getByRole('button', { name: 'Created' })
        await user.click(createdSortButton)

        expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledWith('-created_at')
      })

      describe('when clicking the Created sort button with the sort set to -created_at', () => {
        test('calls the onUpdateAdminRetrievalsSortKey with the reverse sort key', async () => {
          const { props, user } = setup({
            overrideProps: {
              retrievals: {
                allIds: [],
                byId: {},
                pagination: {
                  pageNum: 1,
                  pageSize: 20,
                  totalResults: 70
                },
                sortKey: '-created_at'
              }
            }
          })

          expect(EDSCIcon).toHaveBeenCalledTimes(1)
          expect(EDSCIcon).toHaveBeenCalledWith(
            expect.objectContaining({
              icon: FaCaretDown
            }),
            {}
          )

          const createdSortButton = screen.getByRole('button', { name: 'Created' })
          await user.click(createdSortButton)

          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledTimes(1)
          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledWith('+created_at')
        })
      })

      describe('when clicking the User sort button with the sort set to +created_at', () => {
        test('calls the onUpdateAdminRetrievalsSortKey with the no sort key', async () => {
          const { props, user } = setup({
            overrideProps: {
              retrievals: {
                allIds: [],
                byId: {},
                pagination: {
                  pageNum: 1,
                  pageSize: 20,
                  totalResults: 70
                },
                sortKey: '+created_at'
              }
            }
          })

          expect(EDSCIcon).toHaveBeenCalledTimes(1)
          expect(EDSCIcon).toHaveBeenCalledWith(
            expect.objectContaining({
              icon: FaCaretUp
            }),
            {}
          )

          const createdSortButton = screen.getByRole('button', { name: 'Created' })
          await user.click(createdSortButton)

          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledTimes(1)
          expect(props.onUpdateAdminRetrievalsSortKey).toHaveBeenCalledWith('')
        })
      })
    })

    describe('when clicking a retrieval row', () => {
      test('navigates to the retrieval details page', async () => {
        const { user } = setup({
          overrideProps: {
            retrievals: {
              allIds: ['1109324645'],
              byId: {
                1109324645: {
                  id: 64,
                  jsondata: {},
                  environment: 'prod',
                  created_at: '2019-08-25T11:59:14.390Z',
                  user_id: 1,
                  username: 'edsc-test',
                  total: 40,
                  obfuscated_id: '1109324645'
                }
              },
              pagination: {
                pageNum: 1,
                pageSize: 20,
                totalResults: 1
              },
              sortKey: ''
            }
          },
          overrideZustandState: {
            location: {
              navigate: jest.fn()
            }
          }
        })

        const tableRow = screen.getByRole('button', {
          name: '64 1109324645 edsc-test 2019-08-25T11:59:14.390Z'
        })
        await user.click(tableRow)

        const zustandState = useEdscStore.getState()
        const { location } = zustandState
        const { navigate } = location

        expect(navigate).toHaveBeenCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('/admin/retrievals/1109324645')
      })
    })

    describe('when clicking the pagination controls', () => {
      test('calls the onUpdateAdminRetrievalsPageNum with the correct page number', async () => {
        const { props, user } = setup()

        const paginationButton = screen.getByRole('listitem', { name: 'Next Page' }).childNodes[0]
        await user.click(paginationButton)

        expect(props.onUpdateAdminRetrievalsPageNum).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminRetrievalsPageNum).toHaveBeenCalledWith(2)
      })
    })
  })
})
