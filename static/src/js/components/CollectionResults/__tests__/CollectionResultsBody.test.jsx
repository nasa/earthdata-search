import React from 'react'
import { screen } from '@testing-library/react'
import { FaDoorOpen } from 'react-icons/fa'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'
import { collectionResultsBodyData } from './mocks'
import CollectionResultsTable from '../CollectionResultsTable'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import * as PortalUtils from '../../../util/portals'

vi.mock('../CollectionResultsList', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../CollectionResultsTable', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: CollectionResultsBody,
  defaultProps: {
    loadNextPage: vi.fn(),
    panelView: 'list'
  },
  defaultZustandState: {
    collections: {
      collections: {
        count: 181,
        isLoaded: true,
        isLoading: false,
        items: [{
          cloudHosted: true,
          collectionDataType: 'SCIENCE_QUALITY',
          consortiums: [],
          datasetId: 'test dataset id',
          granuleCount: 42,
          hasMapImagery: false,
          id: 'collectionId',
          isCSDA: false,
          isNrt: false,
          isOpenSearch: false,
          organizations: ['test/org'],
          serviceFeatures: {
            esi: {
              has_formats: false,
              has_spatial_subsetting: false,
              has_temporal_subsetting: false,
              has_transforms: false,
              has_variables: false
            },
            harmony: {
              has_formats: false,
              has_spatial_subsetting: false,
              has_temporal_subsetting: false,
              has_transforms: false,
              has_variables: false
            },
            opendap: {
              has_formats: false,
              has_spatial_subsetting: false,
              has_temporal_subsetting: false,
              has_transforms: false,
              has_variables: false
            }
          },
          shortName: 'test_short_name',
          summary: 'test summary',
          thumbnail: 'http://some.test.com/thumbnail/url.jpg',
          timeEnd: '2019-01-15T00:00:00.000Z',
          timeStart: '2019-01-14T00:00:00.000Z',
          versionId: '2'
        }]
      }
    },
    portal: {
      portalId: 'default-portal',
      features: {
        featureFacets: {
          showMapImagery: true,
          showCustomizable: true,
          showAvailableInEarthdataCloud: true
        }
      }
    }
  }
})

describe('CollectionResultsBody component', () => {
  test('renders CollectionResultsList', () => {
    setup()

    expect(CollectionResultsList).toHaveBeenCalledTimes(1)
    expect(CollectionResultsList).toHaveBeenCalledWith({
      collectionsMetadata: [{
        ...collectionResultsBodyData
      }],
      isItemLoaded: expect.any(Function),
      itemCount: 2,
      loadMoreItems: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  test('renders CollectionResultsTable', () => {
    setup({
      overrideProps: {
        panelView: 'table'
      }
    })

    expect(CollectionResultsTable).toHaveBeenCalledTimes(1)
    expect(CollectionResultsTable).toHaveBeenCalledWith({
      collectionsMetadata: [{
        ...collectionResultsBodyData
      }],
      isItemLoaded: expect.any(Function),
      itemCount: 2,
      loadMoreItems: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  test('adds a dummy item when the first collections are loading', () => {
    setup({
      overrideZustandState: {
        collections: {
          collections: {
            isLoaded: false,
            isLoading: true,
            items: []
          }
        }
      }
    })

    expect(CollectionResultsList).toHaveBeenCalledTimes(1)
    expect(CollectionResultsList).toHaveBeenCalledWith({
      collectionsMetadata: [],
      isItemLoaded: expect.any(Function),
      itemCount: 1,
      loadMoreItems: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  describe('isItemLoaded', () => {
    describe('when there is no next page', () => {
      test('returns true', () => {
        setup({
          overrideZustandState: {
            collections: {
              collections: {
                count: 1,
                isLoaded: true,
                isLoading: false,
                loadTime: 1150,
                items: [{
                  summary: 'test summary',
                  datasetId: 'test dataset id',
                  granuleCount: 42,
                  hasFormats: false,
                  hasMapImagery: false,
                  hasSpatialSubsetting: false,
                  hasTemporalSubsetting: false,
                  hasTransforms: false,
                  hasVariables: false,
                  id: 'collectionId',
                  isOpenSearch: false,
                  isNrt: false,
                  organizations: ['test/org'],
                  shortName: 'test_short_name',
                  thumbnail: 'http://some.test.com/thumbnail/url.jpg',
                  timeEnd: '2019-01-15T00:00:00.000Z',
                  timeStart: '2019-01-14T00:00:00.000Z',
                  versionId: '2'
                }]
              }
            }
          }
        })

        const result = CollectionResultsList.mock.calls[0][0].isItemLoaded(1)
        expect(result).toEqual(true)
      })
    })

    describe('when there is a next page and the item is loaded', () => {
      test('returns false', () => {
        setup({
          overrideZustandState: {
            collections: {
              collections: {
                count: 2,
                isLoaded: true,
                isLoading: false,
                loadTime: 1150,
                items: [{
                  summary: 'test summary',
                  datasetId: 'test dataset id',
                  granuleCount: 42,
                  hasFormats: false,
                  hasMapImagery: false,
                  hasSpatialSubsetting: false,
                  hasTemporalSubsetting: false,
                  hasTransforms: false,
                  hasVariables: false,
                  id: 'collectionId',
                  isOpenSearch: false,
                  isNrt: false,
                  organizations: ['test/org'],
                  shortName: 'test_short_name',
                  thumbnail: 'http://some.test.com/thumbnail/url.jpg',
                  timeEnd: '2019-01-15T00:00:00.000Z',
                  timeStart: '2019-01-14T00:00:00.000Z',
                  versionId: '2'
                }]
              }
            }
          }
        })

        const result = CollectionResultsList.mock.calls[0][0].isItemLoaded(2)
        expect(result).toEqual(false)
      })
    })
  })

  describe('when in the default portal', () => {
    test('does not show the link to the default portal', () => {
      vi.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => true)
      setup()

      expect(PortalLinkContainer).toHaveBeenCalledTimes(0)
    })
  })

  describe('when not in the default portal', () => {
    test('does not show the link to the default portal', () => {
      vi.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => false)
      setup({
        overrideZustandState: {
          portal: {
            portalId: 'another-portal',
            title: {
              primary: 'Another Portal'
            }
          }
        }
      })

      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      expect(PortalLinkContainer).toHaveBeenCalledWith(expect.objectContaining({
        className: 'collection-results-body__portal-escape',
        icon: FaDoorOpen,
        newPortal: {},
        to: {
          hash: '',
          key: 'testKey',
          pathname: '/search',
          search: '',
          state: null
        },
        type: 'button',
        updatePath: true
      }), {})

      expect(screen.getByText('Looking for more collections?')).toBeInTheDocument()
      expect(screen.getByText('Leave the Another Portal Portal')).toBeInTheDocument()
    })
  })
})
