import React from 'react'
import { screen } from '@testing-library/react'

import SavedProjects from '../SavedProjects'
import setupTest from '../../../../../../jestConfigs/setupTest'
import GET_PROJECTS from '../../../operations/queries/getProjects'
import DELETE_PROJECT from '../../../operations/mutations/deleteProject'

// @ts-expect-error This file does not have types
import addToast from '../../../util/addToast'

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ to, onClick, children }) => (
  <a href={to} onClick={onClick}>
    {children}
  </a>
)))

const setup = setupTest({
  Component: SavedProjects,
  defaultApolloClientMocks: [{
    request: {
      query: GET_PROJECTS,
      variables: {
        limit: 20,
        offset: 0
      }
    },
    result: {
      data: {
        projects: null,
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

describe('SavedProjects component', () => {
  describe('When the projects are loading', () => {
    test('shows a loading state', () => {
      setup()

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveClass('saved-projects__spinner')
    })
  })

  describe('When loaded with zero projects', () => {
    test('renders empty-state message and no table', async () => {
      setup()

      expect(await screen.findByText('No saved projects to display.')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('When loaded with one project', () => {
    test('renders a table when a saved project exists with one collection', async () => {
      const project = {
        obfuscatedId: '8069076',
        name: 'test project',
        path: '/search?p=!C123456-EDSC',
        createdAt: '2019-08-25T11:58:14.390Z',
        updatedAt: '2019-08-25T11:58:14.390Z'
      }

      setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_PROJECTS,
            variables: {
              limit: 20,
              offset: 0
            }
          },
          result: {
            data: {
              projects: {
                projects: [project],
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

      const link = await screen.findByRole('link', { name: 'test project' })
      expect(link).toHaveTextContent('test project')
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('?projectId=8069076')
      )

      expect(screen.getByText('1 Collection')).toBeInTheDocument()
      expect(screen.getByText(/ago$/)).toBeInTheDocument()
    })
  })

  describe('When deleting a project', () => {
    const project = {
      obfuscatedId: '8069076',
      name: 'test project',
      path: '/search?p=!C123456-EDSC',
      createdAt: '2019-08-25T11:58:14.390Z',
      updatedAt: '2019-08-25T11:58:14.390Z'
    }

    describe('when the delete is successful', () => {
      test('removes the project from the table', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_PROJECTS,
              variables: {
                limit: 20,
                offset: 0
              }
            },
            result: {
              data: {
                projects: {
                  projects: [project],
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
              query: DELETE_PROJECT,
              variables: {
                obfuscatedId: '8069076'
              }
            },
            result: {
              data: {
                deleteProject: true
              }
            }
          }, {
            request: {
              query: GET_PROJECTS,
              variables: {
                limit: 20,
                offset: 0
              }
            },
            result: {
              data: {
                projects: null,
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

        window.confirm = jest.fn(() => true)

        const deleteButton = await screen.findByRole('button', {
          name: /remove project/i
        })

        await user.click(deleteButton)

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Project removed', {
          appearance: 'success',
          autoDismiss: true
        })

        // The table is now gone and the empty state is showing
        expect(await screen.findByText('No saved projects to display.')).toBeInTheDocument()
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
      })
    })

    describe('when the delete fails', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_PROJECTS,
              variables: {
                limit: 20,
                offset: 0
              }
            },
            result: {
              data: {
                projects: {
                  projects: [project],
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
              query: DELETE_PROJECT,
              variables: {
                obfuscatedId: '8069076'
              }
            },
            result: {
              errors: [new Error('Failed to remove project')]
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
          name: /remove project/i
        })

        await user.click(deleteButton)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith(
          {
            action: 'handleDeleteSavedProject',
            error: new Error('Failed to remove project'),
            notificationType: 'banner',
            resource: 'project',
            verb: 'deleting'
          }
        )
      })
    })
  })
})
