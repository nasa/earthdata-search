import nock from 'nock'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

// @ts-expect-error This file does not have types
import actions from '../../../actions'

// @ts-expect-error This file does not have types
import * as getClientId from '../../../../../../sharedUtils/getClientId'
// @ts-expect-error This file does not have types
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

jest.mock('../../../actions', () => ({
  handleError: jest.fn(),
  onFacetsErrored: jest.fn(),
  onFacetsLoaded: jest.fn(),
  onFacetsLoading: jest.fn(),
  updateFacets: jest.fn()
}))

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createCollectionsSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { collections } = zustandState

    expect(collections).toEqual({
      collections: {
        count: 0,
        isLoaded: false,
        isLoading: false,
        loadTime: 0,
        items: []
      },
      getCollections: expect.any(Function),
      getNlpCollections: expect.any(Function),
      setCollectionsErrored: expect.any(Function),
      setCollectionsLoaded: expect.any(Function),
      setCollectionsLoading: expect.any(Function)
    })
  })

  describe('getCollections', () => {
    beforeEach(() => {
      jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ client: 'eed-edsc-test-serverless-client' }))

      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))
    })

    test('calls the API to get collections', async () => {
      nock(/cmr/)
        .post(/collections/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
            title: 'ECHO dataset metadata',
            entry: [{
              mockCollectionData: 'goes here'
            }],
            facets: {}
          }
        }, {
          'cmr-hits': '1'
        })

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'C10000000000-EDSC'
        state.collection.collectionMetadata['C10000000000-EDSC'] = {
          conceptId: 'C10000000000-EDSC',
          hasAllMetadata: true
        }

        state.granules.getGranules = jest.fn()
      })

      mockGetState.mockReturnValue({
        authToken: ''
      })

      const { collections } = useEdscStore.getState()
      const { getCollections } = collections

      await getCollections()
      const {
        collections: updatedCollections
      } = useEdscStore.getState()

      expect(updatedCollections.collections).toEqual({
        count: 1,
        isLoaded: true,
        isLoading: false,
        items: [{ mockCollectionData: 'goes here' }],
        loadTime: expect.any(Number)
      })

      expect(actions.onFacetsLoading).toHaveBeenCalledTimes(1)
      expect(actions.onFacetsLoading).toHaveBeenCalledWith()

      expect(actions.onFacetsLoaded).toHaveBeenCalledTimes(1)
      expect(actions.onFacetsLoaded).toHaveBeenCalledWith({ loaded: true })

      expect(actions.updateFacets).toHaveBeenCalledTimes(1)
      expect(actions.updateFacets).toHaveBeenCalledWith({ facets: [] })
    })

    test('calls lambda to get authenticated collections', async () => {
      nock(/localhost/)
        .post(/collections/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
            title: 'ECHO dataset metadata',
            entry: [{
              mockCollectionData: 'goes here'
            }],
            facets: {}
          }
        }, {
          'cmr-hits': '1',
          'jwt-token': 'token'
        })

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'C10000000000-EDSC'
        state.collection.collectionMetadata['C10000000000-EDSC'] = {
          conceptId: 'C10000000000-EDSC',
          hasAllMetadata: true
        }

        state.granules.getGranules = jest.fn()
      })

      mockGetState.mockReturnValue({
        authToken: 'mock-token'
      })

      const { collections } = useEdscStore.getState()
      const { getCollections } = collections

      await getCollections()

      const {
        collections: updatedCollections
      } = useEdscStore.getState()

      expect(updatedCollections.collections).toEqual({
        count: 1,
        isLoaded: true,
        isLoading: false,
        items: [{ mockCollectionData: 'goes here' }],
        loadTime: expect.any(Number)
      })

      expect(actions.onFacetsLoading).toHaveBeenCalledTimes(1)
      expect(actions.onFacetsLoading).toHaveBeenCalledWith()

      expect(actions.onFacetsLoaded).toHaveBeenCalledTimes(1)
      expect(actions.onFacetsLoaded).toHaveBeenCalledWith({ loaded: true })

      expect(actions.updateFacets).toHaveBeenCalledTimes(1)
      expect(actions.updateFacets).toHaveBeenCalledWith({ facets: [] })
    })

    test('does not call updateCollectionResults on error', async () => {
      nock(/cmr/)
        .post(/collections/)
        .reply(500)

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'C10000000000-EDSC'
        state.collection.collectionMetadata['C10000000000-EDSC'] = {
          conceptId: 'C10000000000-EDSC',
          hasAllMetadata: true
        }

        state.granules.getGranules = jest.fn()
      })

      mockGetState.mockReturnValue({
        authToken: ''
      })

      const { collections } = useEdscStore.getState()
      const { getCollections } = collections

      await getCollections()

      const {
        collections: updatedCollections
      } = useEdscStore.getState()

      expect(updatedCollections.collections).toEqual({
        count: 0,
        isLoaded: false,
        isLoading: false,
        items: [],
        loadTime: expect.any(Number)
      })

      expect(actions.onFacetsLoading).toHaveBeenCalledTimes(1)
      expect(actions.onFacetsLoading).toHaveBeenCalledWith()

      expect(actions.onFacetsLoaded).toHaveBeenCalledTimes(1)
      expect(actions.onFacetsLoaded).toHaveBeenCalledWith({ loaded: false })

      expect(actions.updateFacets).toHaveBeenCalledTimes(0)

      expect(actions.handleError).toHaveBeenCalledTimes(1)
      expect(actions.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getCollections',
          error: expect.any(Error),
          resource: 'collections'
        })
      )
    })
  })

  describe('slice methods', () => {
    test('setCollectionsLoading sets loading state and clears items for page 1', () => {
      useEdscStore.setState((state) => {
        state.collections.collections.items = [{
          conceptId: 'C1000000000-EDSC',
          mockData: 'existing'
        }]

        state.collections.collections.isLoading = false
      })

      const { collections } = useEdscStore.getState()
      const { setCollectionsLoading } = collections

      setCollectionsLoading(1)

      const { collections: updatedCollections } = useEdscStore.getState()
      expect(updatedCollections.collections.isLoading).toBe(true)
      expect(updatedCollections.collections.items).toEqual([])

      setCollectionsLoading(2)

      const { collections: secondUpdate } = useEdscStore.getState()
      expect(secondUpdate.collections.isLoading).toBe(true)
      expect(secondUpdate.collections.items).toEqual([])
    })

    test('setCollectionsLoaded updates state correctly', () => {
      const mockItems1 = [{
        conceptId: 'C1000000001-EDSC',
        id: '1',
        title: 'Collection 1'
      }]
      const mockItems2 = [{
        conceptId: 'C1000000002-EDSC',
        id: '2',
        title: 'Collection 2'
      }]

      useEdscStore.setState((state) => {
        state.collections.collections.isLoaded = false
        state.collections.collections.isLoading = true
        state.collections.collections.count = 0
        state.collections.collections.items = []
      })

      const { collections } = useEdscStore.getState()
      const { setCollectionsLoaded } = collections

      setCollectionsLoaded(mockItems1, 5, 1)

      const { collections: firstUpdate } = useEdscStore.getState()
      expect(firstUpdate.collections.isLoaded).toBe(true)
      expect(firstUpdate.collections.isLoading).toBe(false)
      expect(firstUpdate.collections.count).toBe(5)
      expect(firstUpdate.collections.items).toEqual(mockItems1)

      setCollectionsLoaded(mockItems2, 10, 2)

      const { collections: secondUpdate } = useEdscStore.getState()
      expect(secondUpdate.collections.isLoaded).toBe(true)
      expect(secondUpdate.collections.isLoading).toBe(false)
      expect(secondUpdate.collections.count).toBe(10)
      expect(secondUpdate.collections.items).toEqual([...mockItems1, ...mockItems2])
    })

    test('setCollectionsErrored sets error state', () => {
      useEdscStore.setState((state) => {
        state.collections.collections.isLoaded = true
        state.collections.collections.isLoading = true
      })

      const { collections } = useEdscStore.getState()
      const { setCollectionsErrored } = collections

      setCollectionsErrored()

      const { collections: updatedCollections } = useEdscStore.getState()
      expect(updatedCollections.collections.isLoading).toBe(false)
      expect(updatedCollections.collections.isLoaded).toBe(false)
    })
  })

  describe('getNlpCollections', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      nock.cleanAll()
    })

    test('successfully performs NLP search and processes response', async () => {
      const mockNlpResponse = {
        data: {
          queryInfo: {
            spatial: {
              geoJson: {
                type: 'Polygon',
                coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
              },
              geoLocation: 'Test Area'
            },
            temporal: {
              startDate: '2023-01-01T00:00:00.000Z',
              endDate: '2023-12-31T23:59:59.999Z'
            }
          },
          metadata: {
            feed: {
              entry: [
                {
                  conceptId: 'C1000000000-EDSC',
                  title: 'Test Collection'
                },
                {
                  conceptId: 'C1000000001-EDSC',
                  title: 'Another Collection'
                }
              ]
            }
          }
        }
      }

      nock(/cmr/)
        .get(/search\/nlp\/query\.json/)
        .reply(200, mockNlpResponse)

      mockGetState.mockReturnValue({
        authToken: 'test-token'
      })

      const mockSetNlpCollection = jest.fn()
      const mockChangeQuery = jest.fn()
      const mockSetNlpSearchCompleted = jest.fn()

      useEdscStore.setState((state) => {
        state.query.setNlpCollection = mockSetNlpCollection
        state.query.changeQuery = mockChangeQuery
        state.query.setNlpSearchCompleted = mockSetNlpSearchCompleted
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('test query')

      expect(mockSetNlpCollection).toHaveBeenCalledWith({
        query: 'test query',
        spatial: expect.objectContaining({
          type: 'Polygon'
        }),
        geoLocation: 'Test Area',
        temporal: {
          startDate: '2023-01-01T00:00:00.000Z',
          endDate: '2023-12-31T23:59:59.999Z'
        }
      })

      expect(mockChangeQuery).toHaveBeenCalledWith({
        collection: {
          spatial: {
            polygon: ['0,0,1,0,1,1,0,1,0,0']
          }
        }
      })

      expect(mockChangeQuery).toHaveBeenCalledWith({
        collection: {
          temporal: {
            startDate: '2023-01-01T00:00:00.000Z',
            endDate: '2023-12-31T23:59:59.999Z'
          }
        }
      })


      expect(mockSetNlpSearchCompleted).toHaveBeenCalledWith(true)
    })

    test('handles NLP search with only spatial data', async () => {
      const mockNlpResponse = {
        data: {
          queryInfo: {
            spatial: {
              geoJson: {
                type: 'Point',
                coordinates: [0, 0]
              },
              geoLocation: 'Point Location'
            }
          },
          metadata: {
            feed: {
              entry: []
            }
          }
        }
      }

      nock(/cmr/)
        .get(/search\/nlp\/query\.json/)
        .reply(200, mockNlpResponse)

      mockGetState.mockReturnValue({
        authToken: 'test-token'
      })

      const mockSetNlpCollection = jest.fn()
      const mockChangeQuery = jest.fn()
      const mockSetNlpSearchCompleted = jest.fn()

      useEdscStore.setState((state) => {
        state.query.setNlpCollection = mockSetNlpCollection
        state.query.changeQuery = mockChangeQuery
        state.query.setNlpSearchCompleted = mockSetNlpSearchCompleted
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('spatial query')

      expect(mockSetNlpCollection).toHaveBeenCalledWith({
        query: 'spatial query',
        spatial: expect.objectContaining({
          type: 'Point'
        }),
        geoLocation: 'Point Location',
        temporal: null
      })

      expect(mockChangeQuery).toHaveBeenCalledWith({
        collection: {
          spatial: {
            point: ['0,0']
          }
        }
      })


      expect(mockSetNlpSearchCompleted).toHaveBeenCalledWith(true)
    })

    test('handles NLP search errors', async () => {
      nock(/cmr/)
        .get(/search\/nlp\/query\.json/)
        .reply(500, { error: 'Server error' })

      mockGetState.mockReturnValue({
        authToken: 'test-token'
      })

      const mockSetNlpSearchCompleted = jest.fn()
      const mockSetCollectionsErrored = jest.fn()

      useEdscStore.setState((state) => {
        state.query.setNlpSearchCompleted = mockSetNlpSearchCompleted
        state.collections.setCollectionsErrored = mockSetCollectionsErrored
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('error query')

      expect(mockSetNlpSearchCompleted).toHaveBeenCalledWith(true)
      expect(mockSetCollectionsErrored).toHaveBeenCalledWith()
      expect(actions.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getNlpCollections',
          resource: 'nlpSearch',
          error: expect.any(Error)
        })
      )
    })

    test('handles empty NLP response', async () => {
      const mockNlpResponse = {
        data: {
          queryInfo: {},
          metadata: {
            feed: {
              entry: []
            }
          }
        }
      }

      nock(/cmr/)
        .get(/search\/nlp\/query\.json/)
        .reply(200, mockNlpResponse)

      mockGetState.mockReturnValue({
        authToken: 'test-token'
      })

      const mockSetNlpCollection = jest.fn()
      const mockSetNlpSearchCompleted = jest.fn()
      const mockSetCollectionsLoaded = jest.fn()

      useEdscStore.setState((state) => {
        state.query.setNlpCollection = mockSetNlpCollection
        state.query.setNlpSearchCompleted = mockSetNlpSearchCompleted
        state.collections.setCollectionsLoaded = mockSetCollectionsLoaded
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('empty query')

      expect(mockSetNlpCollection).not.toHaveBeenCalled()
      expect(mockSetCollectionsLoaded).toHaveBeenCalledWith([], 0, 1)
      expect(mockSetNlpSearchCompleted).toHaveBeenCalledWith(true)
    })
  })
})
