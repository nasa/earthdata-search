import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CollectionDetailsHighlights, { granuleListTotalStyle } from '../CollectionDetailsHighlights'
import Skeleton from '../../Skeleton/Skeleton'
import { collectionDetailsParagraph, collectionDetailsRow } from '../skeleton'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))
jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search/granules/granule-details',
    search: '?p=collectionId&g=granuleId',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const collectionMetadata = {
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
}

const setup = setupTest({
  Component: CollectionDetailsHighlights,
  defaultProps: {
    onToggleRelatedUrlsModal: jest.fn()
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId',
      collectionMetadata: {
        collectionId: collectionMetadata
      }
    },
    collections: {
      collections: {
        isLoaded: true,
        isLoading: false
      }
    }
  }
})

describe('CollectionDetailsHighlights component', () => {
  describe('when the collection is loading', () => {
    test('shows the loading state', () => {
      setup({
        overrideZustandState: {
          collections: {
            collections: {
              isLoaded: false,
              isLoading: true
            }
          }
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(4)
      expect(Skeleton).toHaveBeenNthCalledWith(1, {
        containerStyle: granuleListTotalStyle,
        shapes: collectionDetailsRow,
        variant: 'dark'
      }, {})

      expect(Skeleton).toHaveBeenNthCalledWith(2, {
        containerStyle: granuleListTotalStyle,
        shapes: collectionDetailsRow,
        variant: 'dark'
      }, {})

      expect(Skeleton).toHaveBeenNthCalledWith(3, {
        containerStyle: granuleListTotalStyle,
        shapes: collectionDetailsRow,
        variant: 'dark'
      }, {})

      expect(Skeleton).toHaveBeenNthCalledWith(4, {
        containerStyle: {
          height: '4.125rem',
          width: '100%'
        },
        shapes: collectionDetailsParagraph,
        variant: 'dark'
      }, {})
    })
  })

  describe('when the collection is loaded', () => {
    test('shows the version', () => {
      setup()

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    test('shows the doi', () => {
      setup()

      expect(screen.getByText('ADFD/DS456SD')).toBeInTheDocument()
    })

    test('shows the temporal extent', () => {
      setup()

      expect(screen.getByText('1860-01-01 to 2050-12-31')).toBeInTheDocument()
    })

    test('shows the abstract', () => {
      setup()

      expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt.')).toBeInTheDocument()
    })

    test('renders a View More Collection Details button', () => {
      setup()

      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      expect(PortalLinkContainer).toHaveBeenCalledWith({
        children: 'View More Collection Details',
        className: 'collection-details-header__title-link collection-details-header__title-link-icon',
        to: {
          pathname: '/search/granules/collection-details',
          search: '?p=collectionId&g=granuleId'
        }
      }, {})
    })

    describe('when the abstract is more than 300 characters', () => {
      test('shows the truncated abstract', () => {
        setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  ...collectionMetadata,
                  abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt.'
                }
              }
            }
          }
        })

        expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida ac risus id blandit. In mollis ultricies lorem vel tincidunt. Lorem ipsum dolor sit amet, consecte...')).toBeInTheDocument()
      })
    })

    describe('when clicking the View All Related URLs button', () => {
      test('calls onToggleRelatedUrlsModal', async () => {
        const { props, user } = setup()

        await user.click(screen.getByText('View All Related URLs'))

        expect(props.onToggleRelatedUrlsModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleRelatedUrlsModal).toHaveBeenCalledWith(true)
      })
    })
  })
})
