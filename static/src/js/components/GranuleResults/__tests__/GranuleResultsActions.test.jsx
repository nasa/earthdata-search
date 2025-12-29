import React from 'react'
import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import GranuleResultsActions from '../GranuleResultsActions'
import { metricsAddCollectionToProject } from '../../../util/metrics/metricsAddCollectionToProject'

jest.mock('../../../util/metrics/metricsAddCollectionToProject', () => ({
  metricsAddCollectionToProject: jest.fn()
}))

jest.mock('../../../containers/AuthRequiredContainer/AuthRequiredContainer', () => jest.fn(({ children }) => <div>{children}</div>))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search/granules',
    search: '?p=collectionId',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: GranuleResultsActions,
  defaultProps: {
    addedGranuleIds: [],
    allGranulesInProject: false,
    focusedCollectionId: 'collectionId',
    focusedProjectCollection: {
      granules: {
        allIds: ['granuleId'],
        hits: 1
      }
    },
    granuleLimit: 10000000,
    handoffLinks: [],
    initialLoading: false,
    isCollectionInProject: false,
    onSetActivePanelSection: jest.fn(),
    removedGranuleIds: [],
    searchGranuleCount: 5000
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId',
      collectionMetadata: {
        collectionId: {
          subscriptions: {}
        }
      }
    },
    portal: {
      features: {
        authentication: true
      }
    },
    project: {
      addProjectCollection: jest.fn(),
      removeProjectCollection: jest.fn()
    }
  },
  withRouter: true,
  withRedux: true
})

describe('GranuleResultsActions component', () => {
  describe('when no granules are in the project', () => {
    test('renders a Download All button', () => {
      setup()

      expect(screen.getByRole('button', { name: 'Download All' })).toBeInTheDocument()
    })
  })

  describe('when some granules are in the project', () => {
    test('renders a Download button', () => {
      setup({
        overrideProps: {
          addedGranuleIds: ['one'],
          projectGranuleCount: 1,
          isCollectionInProject: true
        }
      })

      const button = screen.getByRole('button', { name: 'Download' })
      expect(button).toBeInTheDocument()

      // The badge should show the number of granules in the project
      expect(within(button).getByText('1')).toBeInTheDocument()
    })
  })

  describe('when all granules are in the project', () => {
    test('renders a Download All button', () => {
      setup({
        overrideProps: {
          projectGranuleCount: 5000,
          isCollectionInProject: true
        }
      })

      const button = screen.getByRole('button', { name: 'Download All' })
      expect(button).toBeInTheDocument()

      // The badge should show the number of granules in the project
      expect(within(button).getByText('5,000')).toBeInTheDocument()
    })
  })

  describe('addToProjectButton', () => {
    test('calls onAddProjectCollection', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Add collection to the current project' })
      await user.click(button)

      expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId')

      expect(metricsAddCollectionToProject).toHaveBeenCalledTimes(1)
      expect(metricsAddCollectionToProject).toHaveBeenCalledWith({
        collectionConceptId: 'collectionId',
        page: 'granules',
        view: ''
      })
    })
  })

  describe('removeFromProjectButton', () => {
    test('calls onRemoveCollectionFromProject', async () => {
      const { user, zustandState } = setup({
        overrideProps: {
          isCollectionInProject: true
        }
      })

      const button = screen.getByRole('button', { name: 'Remove collection from the current project' })
      await user.click(button)

      expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('when handoff links are present', () => {
    test('renders the handoff links', async () => {
      const { user } = setup({
        overrideProps: {
          handoffLinks: [
            {
              href: 'https://example.com/handoff1',
              title: 'Handoff 1'
            },
            {
              href: 'https://example.com/handoff2',
              title: 'Handoff 2'
            }
          ]
        }
      })

      // Open the dropdown
      const dropdown = screen.getByRole('button', { name: 'Explore' })
      await user.click(dropdown)

      const handoffLinks = screen.getAllByRole('link')
      expect(handoffLinks).toHaveLength(2)
      expect(handoffLinks[0]).toHaveTextContent('Handoff 1')
      expect(handoffLinks[0]).toHaveAttribute('href', 'https://example.com/handoff1')
      expect(handoffLinks[1]).toHaveTextContent('Handoff 2')
      expect(handoffLinks[1]).toHaveAttribute('href', 'https://example.com/handoff2')
    })
  })

  describe('when a user is not subscribed', () => {
    test('renders the correct subscription button', () => {
      setup()

      const button = screen.getByRole('button', { name: 'Create subscription' })
      expect(button).toBeInTheDocument()
    })
  })

  describe('when a user is subscribed', () => {
    test('renders the correct subscription button', () => {
      setup({
        overrideZustandState: {
          collection: {
            collectionMetadata: {
              collectionId: {
                subscriptions: {
                  items: [
                    {
                      name: 'Sub 1'
                    }
                  ]
                }
              }
            }
          }
        }
      })

      const button = screen.getByRole('button', { name: 'View or edit subscriptions' })
      expect(button).toBeInTheDocument()
    })
  })
})
