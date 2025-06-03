import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CollectionDetailsHighlights from '../CollectionDetailsHighlights'
import Skeleton from '../../Skeleton/Skeleton'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: CollectionDetailsHighlights,
  defaultProps: {
    collectionMetadata: {
      hasAllMetadata: true,
      doi: {
        doiLink: 'https://dx.doi.org/ADFD/DS456SD',
        doiText: 'ADFD/DS456SD'
      },
      temporal: [
        '1860-01-01 to 2050-12-31'
      ],
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt.',
      versionId: '5'
    },
    collectionsSearch: {
      isLoaded: false,
      isLoading: true
    },
    onToggleRelatedUrlsModal: jest.fn()
  },
  defaultZustandState: {
    location: {
      location: {
        pathname: '/search',
        search: ''
      }
    }
  },
  withRedux: true,
  withRouter: true
})

describe('CollectionDetailsHighlights component', () => {
  describe('when collection is loading', () => {
    test('shows the loading state', () => {
      setup()

      // 4 skeletons on the page
      expect(Skeleton).toHaveBeenCalledTimes(4)
    })
  })

  describe('when collection is loaded', () => {
    describe('version', () => {
      test('shows the version', () => {
        setup({
          overrideProps: {
            collectionsSearch: {
              isLoading: false,
              isLoaded: true
            }
          }
        })

        expect(screen.getByText('5')).toBeInTheDocument()
      })
    })

    describe('doi', () => {
      test('shows the doi', () => {
        setup({
          overrideProps: {
            collectionsSearch: {
              isLoading: false,
              isLoaded: true
            }
          }
        })

        expect(screen.getByText('ADFD/DS456SD')).toBeInTheDocument()
      })
    })

    describe('temporal extent', () => {
      test('shows the temporal extent', () => {
        setup({
          overrideProps: {
            collectionsSearch: {
              isLoading: false,
              isLoaded: true
            }
          }
        })

        expect(screen.getByText('1860-01-01 to 2050-12-31')).toBeInTheDocument()
      })
    })

    describe('abstract', () => {
      test('shows the abstract', () => {
        setup({
          overrideProps: {
            collectionsSearch: {
              isLoading: false,
              isLoaded: true
            }
          }
        })

        expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt.')).toBeInTheDocument()
      })

      test('truncates the abstract if it is longer than 300 characters', () => {
        setup({
          overrideProps: {
            collectionMetadata: {
              abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              hasAllMetadata: true,
              doi: {
                doiLink: 'https://dx.doi.org/ADFD/DS456SD',
                doiText: 'ADFD/DS456SD'
              },
              temporal: [
                '1860-01-01 to 2050-12-31'
              ],
              versionId: '5'
            },
            collectionsSearch: {
              isLoading: false,
              isLoaded: true
            }
          }
        })

        expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons...')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking `View All Related URLs` button', () => {
    test('calls the onToggleRelatedUrlsModal prop', async () => {
      const { props, user } = setup({
        overrideProps: {
          collectionsSearch: {
            isLoading: false,
            isLoaded: true
          }
        }
      })

      const button = screen.getByText('View All Related URLs')
      await user.click(button)

      expect(props.onToggleRelatedUrlsModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleRelatedUrlsModal).toHaveBeenCalledWith(true)
    })
  })
})
