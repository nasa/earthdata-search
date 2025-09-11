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
      getNlpCollections: expect.any(Function)
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

  describe('getNlpCollections', () => {
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
                  id: 'C1000000000-EDSC',
                  title: 'Test Collection'
                },
                {
                  id: 'C1000000001-EDSC',
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

      useEdscStore.setState((state) => {
        state.query.nlpCollection = { query: 'test query' }
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections()

      const updatedState = useEdscStore.getState()
      const { query: updatedQuery, collections: updatedCollections } = updatedState

      expect(updatedQuery.nlpCollection).toEqual({
        query: 'test query',
        spatial: expect.objectContaining({
          geoJson: expect.objectContaining({ type: 'Polygon' }),
          geoLocation: 'Test Area'
        }),
        temporal: {
          startDate: '2023-01-01T00:00:00.000Z',
          endDate: '2023-12-31T23:59:59.999Z'
        }
      })

      expect(updatedCollections.collections.count).toBe(2)
      expect(updatedCollections.collections.isLoaded).toBe(true)
      expect(updatedCollections.collections.isLoading).toBe(false)
      expect(updatedCollections.collections.items).toEqual(expect.arrayContaining([
        expect.objectContaining({ conceptId: 'C1000000000-EDSC' }),
        expect.objectContaining({ conceptId: 'C1000000001-EDSC' })
      ]))

      expect(updatedCollections.collections.loadTime).toEqual(expect.any(Number))
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

      useEdscStore.setState((state) => {
        state.query.nlpCollection = { query: 'spatial query' }
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections()

      const updatedState = useEdscStore.getState()
      const { query: updatedQuery, collections: updatedCollections } = updatedState

      expect(updatedQuery.nlpCollection).toEqual({
        query: 'spatial query',
        spatial: expect.objectContaining({
          geoJson: expect.objectContaining({ type: 'Point' }),
          geoLocation: 'Point Location'
        })
      })

      expect(updatedCollections.collections.count).toBe(0)
      expect(updatedCollections.collections.isLoaded).toBe(true)
      expect(updatedCollections.collections.isLoading).toBe(false)
      expect(updatedCollections.collections.items).toEqual([])
      expect(updatedCollections.collections.loadTime).toEqual(expect.any(Number))
    })

    test('handles NLP search errors', async () => {
      nock(/cmr/)
        .get(/search\/nlp\/query\.json/)
        .reply(500, { error: 'Server error' })

      mockGetState.mockReturnValue({
        authToken: 'test-token'
      })

      useEdscStore.setState((state) => {
        state.query.nlpCollection = { query: 'error query' }
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections()

      expect(actions.handleError).toHaveBeenCalledTimes(1)
      expect(actions.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getNlpCollections',
          resource: 'nlpSearch',
          error: expect.any(Error)
        })
      )

      const { collections: updatedCollectionsAfterError } = useEdscStore.getState()

      expect(updatedCollectionsAfterError.collections.isLoaded).toBe(false)
      expect(updatedCollectionsAfterError.collections.isLoading).toBe(false)
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

      useEdscStore.setState((state) => {
        state.query.nlpCollection = { query: 'empty query' }
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections()

      const updatedState = useEdscStore.getState()
      const { query: updatedQuery, collections: updatedCollectionsEmpty } = updatedState

      expect(updatedQuery.nlpCollection).toEqual({ query: 'empty query' })
      expect(updatedCollectionsEmpty.collections.count).toBe(0)
      expect(updatedCollectionsEmpty.collections.isLoaded).toBe(true)
      expect(updatedCollectionsEmpty.collections.isLoading).toBe(false)
      expect(updatedCollectionsEmpty.collections.items).toEqual([])
      expect(updatedCollectionsEmpty.collections.loadTime).toEqual(expect.any(Number))
    })
  })
})
