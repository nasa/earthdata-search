import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'
import { collectionResultsBodyData } from './mocks'
import CollectionResultsTable from '../CollectionResultsTable'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collectionsMetadata: {
      collectionId: {
        consortiums: [],
        summary: 'test summary',
        datasetId: 'test dataset id',
        granuleCount: 42,
        hasMapImagery: false,
        id: 'collectionId',
        isCSDA: false,
        isOpenSearch: false,
        isNrt: false,
        organizations: ['test/org'],
        serviceFeatures: {
          esi: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: false
          },
          opendap: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: false
          },
          harmony: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: false
          }
        },
        shortName: 'test_short_name',
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
    panelView: 'list',
    portal: {
      portalId: 'edsc'
    },
    projectCollectionsIds: [],
    location: {
      pathname: '/test'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionResultsBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsBody component', () => {
  test('renders CollectionResultsList', () => {
    const { enzymeWrapper, props } = setup()

    const {
      browser,
      loadNextPage,
      onAddProjectCollection,
      onRemoveCollectionFromProject,
      onViewCollectionDetails,
      onViewCollectionGranules
    } = props

    const resultsList = enzymeWrapper.find(CollectionResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      browser,
      collectionsMetadata: [{
        ...collectionResultsBodyData
      }],
      itemCount: 2,
      loadMoreItems: loadNextPage,
      onAddProjectCollection,
      onRemoveCollectionFromProject,
      onViewCollectionGranules,
      onViewCollectionDetails,
      visibleMiddleIndex: null
    }))
  })

  test('renders CollectionResultsTable', () => {
    const { enzymeWrapper, props } = setup({
      panelView: 'table'
    })

    const {
      loadNextPage,
      onAddProjectCollection,
      onRemoveCollectionFromProject,
      onViewCollectionDetails,
      onViewCollectionGranules
    } = props

    const resultsTable = enzymeWrapper.find(CollectionResultsTable)

    expect(resultsTable.props()).toEqual(expect.objectContaining({
      collectionsMetadata: [{
        ...collectionResultsBodyData
      }],
      itemCount: 2,
      loadMoreItems: loadNextPage,
      onAddProjectCollection,
      onRemoveCollectionFromProject,
      onViewCollectionGranules,
      onViewCollectionDetails,
      visibleMiddleIndex: null
    }))
  })

  test('adds a dummy item when the first collections are loading', () => {
    const { enzymeWrapper, props } = setup({
      collectionsSearch: {
        allIds: [],
        byId: {},
        isLoading: true
      }
    })

    const resultsList = enzymeWrapper.find(CollectionResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      collectionsMetadata: [],
      itemCount: 1
    }))

    resultsList.props().loadMoreItems()

    expect(props.loadNextPage).toHaveBeenCalledTimes(0)
  })

  test('adds a dummy item when new collections are loading', () => {
    const { enzymeWrapper, props } = setup()

    const resultsList = enzymeWrapper.find(CollectionResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      itemCount: 2
    }))

    resultsList.props().loadMoreItems()

    expect(props.loadNextPage).toHaveBeenCalledTimes(1)
  })

  test('does not add a dummy item when all collections are loaded', () => {
    const { enzymeWrapper, props } = setup({
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
    })

    const resultsList = enzymeWrapper.find(CollectionResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      itemCount: 1
    }))

    resultsList.props().loadMoreItems()

    expect(props.loadNextPage).toHaveBeenCalledTimes(1)
  })

  describe('isItemLoaded', () => {
    describe('when there is no next page', () => {
      test('returns true', () => {
        const { enzymeWrapper } = setup({
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
        })

        const resultsList = enzymeWrapper.find(CollectionResultsList)

        expect(resultsList.props().isItemLoaded()).toEqual(true)
      })
    })

    describe('when there is a next page and the item is loaded', () => {
      test('returns false', () => {
        const { enzymeWrapper } = setup({
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
        })

        const resultsList = enzymeWrapper.find(CollectionResultsList)

        expect(resultsList.props().isItemLoaded(2)).toEqual(false)
      })
    })
  })
})
