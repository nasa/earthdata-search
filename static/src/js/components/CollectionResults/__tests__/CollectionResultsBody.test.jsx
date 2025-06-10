import React from 'react'
import { screen } from '@testing-library/react'
import { FaDoorOpen } from 'react-icons/fa'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'
import { collectionResultsBodyData } from './mocks'
import CollectionResultsTable from '../CollectionResultsTable'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import * as PortalUtils from '../../../util/portals'

jest.mock('../CollectionResultsList', () => jest.fn(() => <div />))
jest.mock('../CollectionResultsTable', () => jest.fn(() => <div />))
jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children }) => <div>{children}</div>))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
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
    collectionsMetadata: {
      collectionId: {
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
      }
    },
    collectionsSearch: {
      allIds: ['collectionId'],
      hits: 181,
      isLoaded: true,
      isLoading: false,
      loadTime: 1150,
      timerStart: null
    },
    loadNextPage: jest.fn(),
    onAddProjectCollection: jest.fn(),
    onMetricsAddCollectionProject: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    panelView: 'list',
    projectCollectionsIds: []
  },
  defaultZustandState: {
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
      onAddProjectCollection: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      onRemoveCollectionFromProject: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
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
      onAddProjectCollection: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      onRemoveCollectionFromProject: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  test('adds a dummy item when the first collections are loading', () => {
    setup({
      overrideProps: {
        collectionsSearch: {
          allIds: [],
          byId: {},
          isLoading: true
        }
      }
    })

    expect(CollectionResultsList).toHaveBeenCalledTimes(1)
    expect(CollectionResultsList).toHaveBeenCalledWith({
      collectionsMetadata: [],
      isItemLoaded: expect.any(Function),
      itemCount: 1,
      loadMoreItems: expect.any(Function),
      onAddProjectCollection: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      onRemoveCollectionFromProject: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  describe('isItemLoaded', () => {
    describe('when there is no next page', () => {
      test('returns true', () => {
        setup({
          overrideProps: {
            collectionsMetadata: {
              collectionId: {
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
              }
            },
            collectionsSearch: {
              allIds: ['collectionId'],
              hits: 1,
              isLoaded: true,
              isLoading: false,
              loadTime: 1150,
              timerStart: null
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
          overrideProps: {
            collectionsMetadata: {
              collectionId: {
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
              }
            },
            collectionsSearch: {
              allIds: ['collectionId'],
              hits: 2,
              isLoaded: true,
              isLoading: false,
              loadTime: 1150,
              timerStart: null
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
      jest.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => true)
      setup()

      expect(PortalLinkContainer).toHaveBeenCalledTimes(0)
    })
  })

  describe('when not in the default portal', () => {
    test('does not show the link to the default portal', () => {
      jest.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => false)
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
