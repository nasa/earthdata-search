import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import GranuleResultsHighlights from '../GranuleResultsHighlights'
import Skeleton from '../../Skeleton/Skeleton'
import getByTextWithMarkup from '../../../../../../jestConfigs/getByTextWithMarkup'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn((props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <mock-PortalLinkContainer {...props} />
)))

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search/granules/collection-details',
    search: '?p=C100005-EDSC',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: GranuleResultsHighlights,
  defaultZustandState: {
    granules: {
      granules: {
        count: 5,
        isLoaded: false,
        isLoading: true,
        items: [{
          formattedTemporal: ['2020-03-04 19:30:00', '2020-03-04 19:35:00'],
          title: 'producer_granule_id_1'
        }]
      }
    }
  },
  withRoute: true
})

describe('GranuleResultsHighlights component', () => {
  describe('when granules are loading', () => {
    test('shows the loading state', () => {
      setup()

      expect(Skeleton).toHaveBeenCalledTimes(4)
      expect(Skeleton).toHaveBeenNthCalledWith(1, {
        containerStyle: { height: '18px' },
        shapes: [{
          height: 12,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 3,
          width: 213
        }],
        variant: 'dark'
      }, {})

      const granuleSkeletonProps = {
        className: 'granule-results-highlights__item',
        containerStyle: { height: '99px' },
        shapes: [{
          height: 12,
          left: 13,
          radius: 2,
          shape: 'rectangle',
          top: 12,
          width: 200
        }, {
          height: 12,
          left: 13,
          radius: 2,
          shape: 'rectangle',
          top: 29,
          width: 100
        }, {
          height: 12,
          left: 13,
          radius: 2,
          shape: 'rectangle',
          top: 50,
          width: 35
        }, {
          height: 12,
          left: 160,
          radius: 2,
          shape: 'rectangle',
          top: 50,
          width: 85
        }, {
          height: 12,
          left: 13,
          radius: 2,
          shape: 'rectangle',
          top: 70,
          width: 25
        }, {
          height: 12,
          left: 160,
          radius: 2,
          shape: 'rectangle',
          top: 70,
          width: 85
        }],
        variant: 'dark'
      }
      expect(Skeleton).toHaveBeenNthCalledWith(2, granuleSkeletonProps, {})
      expect(Skeleton).toHaveBeenNthCalledWith(3, granuleSkeletonProps, {})
      expect(Skeleton).toHaveBeenNthCalledWith(4, granuleSkeletonProps, {})
    })
  })

  describe('when granules are loaded', () => {
    test('shows the granule count and granule info', () => {
      setup({
        overrideZustandState: {
          granules: {
            granules: {
              isLoaded: true,
              isLoading: false
            }
          }
        }
      })

      expect(screen.getByText('Showing 1 of 5 matching granules')).toBeInTheDocument()

      expect(getByTextWithMarkup('Start2020-03-04 19:30:00')).toBeInTheDocument()
      expect(getByTextWithMarkup('End2020-03-04 19:35:00')).toBeInTheDocument()
      expect(screen.getByText('producer_granule_id_1')).toBeInTheDocument()

      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      expect(PortalLinkContainer).toHaveBeenCalledWith({
        children: expect.arrayContaining([' View Granules']),
        className: 'granule-results-header__title-link granule-results-header__title-link-icon',
        to: {
          pathname: '/search/granules',
          search: '?p=C100005-EDSC'
        }
      }, {})
    })

    describe('when granules have no start time nor end time', () => {
      test('display not provided instead of date', () => {
        setup({
          overrideZustandState: {
            granules: {
              granules: {
                isLoaded: true,
                isLoading: false,
                items: [{
                  title: 'producer_granule_id_1'
                }]
              }
            }
          }
        })

        expect(getByTextWithMarkup('StartNot Provided')).toBeInTheDocument()
        expect(getByTextWithMarkup('EndNot Provided')).toBeInTheDocument()
      })
    })

    describe('when there are no granules', () => {
      test('displays No Granules Found message', () => {
        setup({
          overrideZustandState: {
            granules: {
              granules: {
                count: 0,
                isLoaded: true,
                isLoading: false,
                items: []
              }
            }
          }
        })

        expect(screen.getByText('No Granules')).toBeInTheDocument()
      })
    })
  })
})
