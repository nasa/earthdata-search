import React from 'react'
import { screen } from '@testing-library/react'

import DownloadHistory from '../DownloadHistory'
import setupTest from '../../../../../../jestConfigs/setupTest'
import HISTORY_RETRIEVALS from '../../../operations/queries/historyRetrievals'
import DELETE_RETRIEVAL from '../../../operations/mutations/deleteRetrieval'

// @ts-expect-error This file does not have types
import addToast from '../../../util/addToast'

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ to, onClick, children }) => {
  const href = typeof to === 'string' ? to : `${to.pathname}${to.search ? `?${to.search}` : ''}`

  return (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  )
}))

const setup = setupTest({
  Component: DownloadHistory,
  defaultApolloClientMocks: [{
    request: {
      query: HISTORY_RETRIEVALS,
      variables: {
        limit: 20,
        offset: 0
      }
    },
    result: {
      data: {
        historyRetrievals: null,
        pageInfo: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          pageCount: 1
        },
        count: 0
      }
    }
  }],
  withApolloClient: true
})

describe('DownloadHistorys component', () => {
  describe('When the history retrievals are loading', () => {
    test('shows a loading state', () => {
      setup()

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveClass('download-history__spinner')
    })
  })

  describe('When loaded with zero history retrievals', () => {
    test('renders empty-state message and no table', async () => {
      setup()

      expect(await screen.findByText('No download history to display.')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('When loaded with one retrieval', () => {
    test('renders a table when a history retrieval exists with one collection', async () => {
      const historyRetrieval = {
        createdAt: '2019-08-25T11:58:14.390Z',
        id: 1,
        obfuscatedId: '8069076',
        portalId: 'edsc',
        titles: ['title 1']
      }

      setup({
        overrideApolloClientMocks: [{
          request: {
            query: HISTORY_RETRIEVALS,
            variables: {
              limit: 20,
              offset: 0
            }
          },
          result: {
            data: {
              historyRetrievals: {
                historyRetrievals: [historyRetrieval],
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
        }]
      })

      const link = await screen.findByRole('link', { name: 'title 1' })
      expect(link).toHaveTextContent('title 1')
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('downloads/8069076')
      )

      expect(screen.getByText(/ago$/)).toBeInTheDocument()
    })

    test('renders a table when a history retrieval exists with more than one collection', async () => {
      const historyRetrieval = {
        createdAt: '2019-08-25T11:58:14.390Z',
        id: 1,
        obfuscatedId: '8069076',
        portalId: 'edsc',
        titles: ['title 1', 'title 2', 'title 3']
      }

      setup({
        overrideApolloClientMocks: [{
          request: {
            query: HISTORY_RETRIEVALS,
            variables: {
              limit: 20,
              offset: 0
            }
          },
          result: {
            data: {
              historyRetrievals: {
                historyRetrievals: [historyRetrieval],
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
        }]
      })

      const link = await screen.findByRole('link', { name: 'title 1 and 2 more' })
      expect(link).toHaveTextContent('title 1 and 2 more')
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('downloads/8069076')
      )

      expect(screen.getByText(/ago$/)).toBeInTheDocument()
    })
  })

  describe('When fetching hisotry retrievals fail', () => {
    test('calls handleError', async () => {
      const { zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: HISTORY_RETRIEVALS,
            variables: {
              limit: 20,
              offset: 0
            }
          },
          error: new Error('Failed to fetch history retrievals')
        }],
        overrideZustandState: {
          errors: {
            handleError: jest.fn()
          }
        }
      })

      expect(await screen.findByText('No download history to display.')).toBeInTheDocument()

      expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        error: new Error('Failed to fetch history retrievals'),
        action: 'fetchHistoryRetrievals',
        resource: 'history retrievals',
        verb: 'fetching',
        notificationType: 'banner'
      })

      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      expect(screen.queryByText('Failed to fetch history retrievals')).not.toBeInTheDocument()
    })
  })

  describe('When deleting a history retrieval', () => {
    const historyRetrieval = {
      createdAt: '2019-08-25T11:58:14.390Z',
      id: 1,
      obfuscatedId: '8069076',
      portalId: 'edsc',
      titles: ['title 1']
    }

    describe('when the delete is successful', () => {
      test('removes the history retrieval from the table', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: HISTORY_RETRIEVALS,
              variables: {
                limit: 20,
                offset: 0
              }
            },
            result: {
              data: {
                historyRetrievals: {
                  historyRetrievals: [historyRetrieval],
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
          }, {
            request: {
              query: DELETE_RETRIEVAL,
              variables: {
                obfuscatedId: '8069076'
              }
            },
            result: {
              data: {
                deleteRetrieval: true
              }
            }
          }, {
            request: {
              query: HISTORY_RETRIEVALS,
              variables: {
                limit: 20,
                offset: 0
              }
            },
            result: {
              data: {
                historyRetrievals: null,
                pageInfo: {
                  currentPage: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                  pageCount: 1
                },
                count: 0
              }
            }
          }]
        })

        await screen.findByRole('link', { name: 'title 1' })

        window.confirm = jest.fn(() => true)

        const deleteButton = await screen.findByRole('button', {
          name: /Delete Download/i
        })

        await user.click(deleteButton)

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Downloads removed', {
          appearance: 'success',
          autoDismiss: true
        })

        // The table is now gone and the empty state is showing
        expect(await screen.findByText('No download history to display.')).toBeInTheDocument()
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
      })
    })

    describe('when the delete fails', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: HISTORY_RETRIEVALS,
              variables: {
                limit: 20,
                offset: 0
              }
            },
            result: {
              data: {
                historyRetrievals: {
                  historyRetrievals: [historyRetrieval],
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
          }, {
            request: {
              query: DELETE_RETRIEVAL,
              variables: {
                obfuscatedId: '8069076'
              }
            },
            result: {
              errors: [new Error('Failed to remove retrieval')]
            }
          }],
          overrideZustandState: {
            errors: {
              handleError: jest.fn()
            }
          }
        })

        window.confirm = jest.fn(() => true)

        const deleteButton = await screen.findByRole('button', {
          name: /Delete Download/i
        })

        await user.click(deleteButton)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith(
          {
            action: 'handleDeleteRetrieval',
            error: new Error('Failed to remove retrieval'),
            notificationType: 'banner',
            resource: 'retrieval',
            verb: 'deleting'
          }
        )
      })
    })
  })
})
