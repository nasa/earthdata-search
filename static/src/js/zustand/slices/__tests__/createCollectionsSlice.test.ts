import nock from 'nock'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import * as getClientId from '../../../../../../sharedUtils/getClientId'
// @ts-expect-error This file does not have types
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'
import addShapefile from '../../../util/addShapefile'

jest.mock('../../../util/addShapefile', () => jest.fn())

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
        state.user.edlToken = 'mock-token'

        state.facets.facets.updateFacets = jest.fn()
      })

      const { collections } = useEdscStore.getState()
      const { getCollections } = collections

      await getCollections()
      const {
        collections: updatedCollections,
        facets: updatedFacets
      } = useEdscStore.getState()

      expect(updatedCollections.collections).toEqual({
        count: 1,
        isLoaded: true,
        isLoading: false,
        items: [{ mockCollectionData: 'goes here' }],
        loadTime: expect.any(Number)
      })

      expect(updatedFacets.facets.updateFacets).toHaveBeenCalledTimes(1)
      expect(updatedFacets.facets.updateFacets).toHaveBeenCalledWith([])
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

        state.errors.handleError = jest.fn()
        state.granules.getGranules = jest.fn()

        state.facets.facets.updateFacets = jest.fn()
      })

      const { collections } = useEdscStore.getState()
      const { getCollections } = collections

      await getCollections()

      const {
        collections: updatedCollections,
        errors,
        facets: updatedFacets
      } = useEdscStore.getState()

      expect(updatedCollections.collections).toEqual({
        count: 0,
        isLoaded: false,
        isLoading: false,
        items: [],
        loadTime: expect.any(Number)
      })

      expect(updatedFacets.facets.updateFacets).toHaveBeenCalledTimes(0)

      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getCollections',
          error: expect.any(Error),
          resource: 'collections',
          showAlertButton: true,
          title: 'Something went wrong fetching collection search results'
        })
      )
    })
  })

  describe('getNlpCollections', () => {
    test('successfully performs NLP search and processes response', async () => {
      nock(/cmr/)
        .post(/search\/nlp\/query\.json/)
        .reply(200, {
          queryInfo: {
            spatial: {
              geoJson: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
                    },
                    properties: {}
                  }
                ]
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
        }, {
          'cmr-hits': '2'
        })

      useEdscStore.setState((state) => {
        state.user.edlToken = 'test-token'
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('test query')

      const updatedState = useEdscStore.getState()
      const { query: updatedQuery, collections: updatedCollections } = updatedState

      expect(updatedQuery.collection).toEqual({
        byId: {},
        hasGranulesOrCwic: true,
        keyword: undefined,
        onlyEosdisCollections: false,
        overrideTemporal: {},
        pageNum: 1,
        sortKey: '-score',
        spatial: {
          geoJson: {
            features: [{
              geometry: {
                coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
                type: 'Polygon'
              },
              properties: {
                nlpGenerated: true
              },
              type: 'Feature'
            }],
            type: 'FeatureCollection'
          },
          geoLocation: 'Test Area'
        },
        tagKey: '',
        temporal: {
          endDate: '2023-12-31T23:59:59.999Z',
          startDate: '2023-01-01T00:00:00.000Z'
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

      expect(addShapefile).toHaveBeenCalledTimes(1)
      expect(addShapefile).toHaveBeenCalledWith({
        file: {
          features: [{
            geometry: {
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
              type: 'Polygon'
            },
            properties: {
              nlpGenerated: true
            },
            type: 'Feature'
          }],
          type: 'FeatureCollection'
        },
        filename: 'Test Area',
        size: '0.17 KB',
        updateQuery: false
      })
    })

    describe('when the spatial value is a geometry object', () => {
      test('processes the geometry correctly and adds the shapefile', async () => {
        nock(/cmr/)
          .post(/search\/nlp\/query\.json/)
          .reply(200, {
            queryInfo: {
              spatial: {
                geoJson: {
                  type: 'Polygon',
                  coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
                },
                geoLocation: 'Test Area'
              }
            },
            metadata: {
              feed: {
                entry: []
              }
            }
          }, {
            'cmr-hits': '0'
          })

        useEdscStore.setState((state) => {
          state.user.edlToken = 'test-token'
        })

        const { collections } = useEdscStore.getState()
        const { getNlpCollections } = collections

        await getNlpCollections('geometry query')

        expect(addShapefile).toHaveBeenCalledTimes(1)
        expect(addShapefile).toHaveBeenCalledWith({
          file: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
              },
              properties: {
                nlpGenerated: true
              }
            }]
          },
          filename: 'Test Area',
          size: '0.06 KB',
          updateQuery: false
        })
      })
    })

    describe('when the geojson is greater than 1 MB', () => {
      test('calculates and formats the size in MB', async () => {
        // Create a large geojson object (>1 MB)
        const largeCoordinates = []
        for (let i = 0; i < 100000; i += 1) {
          largeCoordinates.push([i, i])
        }

        largeCoordinates.push([0, 0]) // Close the polygon

        nock(/cmr/)
          .post(/search\/nlp\/query\.json/)
          .reply(200, {
            queryInfo: {
              spatial: {
                geoJson: {
                  type: 'Polygon',
                  coordinates: [largeCoordinates]
                },
                geoLocation: 'Large Area'
              }
            },
            metadata: {
              feed: {
                entry: []
              }
            }
          }, {
            'cmr-hits': '0'
          })

        useEdscStore.setState((state) => {
          state.user.edlToken = 'test-token'
        })

        const { collections } = useEdscStore.getState()
        const { getNlpCollections } = collections

        await getNlpCollections('large geojson query')

        expect(addShapefile).toHaveBeenCalledTimes(1)
        expect(addShapefile).toHaveBeenCalledWith({
          file: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [largeCoordinates]
              },
              properties: {
                nlpGenerated: true
              }
            }]
          },
          filename: 'Large Area',
          size: '1.31 MB',
          updateQuery: false
        })
      })
    })

    test('handles NLP search errors', async () => {
      nock(/cmr/)
        .post(/search\/nlp\/query\.json/)
        .reply(500, { error: 'Server error' })

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      useEdscStore.setState((state) => {
        state.errors.handleError = jest.fn()
        state.user.edlToken = 'test-token'
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('error query')

      const { errors } = useEdscStore.getState()

      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getNlpCollections',
          resource: 'nlpSearch',
          error: expect.any(Error),
          showAlertButton: true,
          title: 'Something went wrong fetching collection search results'
        })
      )

      const { collections: updatedCollectionsAfterError } = useEdscStore.getState()

      expect(updatedCollectionsAfterError.collections.isLoaded).toBe(false)
      expect(updatedCollectionsAfterError.collections.isLoading).toBe(false)
    })

    test('handles empty NLP response', async () => {
      nock(/cmr/)
        .post(/search\/nlp\/query\.json/)
        .reply(200, {
          queryInfo: {},
          metadata: {
            feed: {
              entry: []
            }
          }
        }, {
          'cmr-hits': '0'
        })

      useEdscStore.setState((state) => {
        state.user.edlToken = 'test-token'
      })

      const { collections } = useEdscStore.getState()
      const { getNlpCollections } = collections

      await getNlpCollections('empty query')

      const updatedState = useEdscStore.getState()
      const { query: updatedQuery, collections: updatedCollectionsEmpty } = updatedState

      expect(updatedQuery.collection).toEqual({
        byId: {},
        hasGranulesOrCwic: true,
        keyword: null,
        onlyEosdisCollections: false,
        overrideTemporal: {},
        pageNum: 1,
        sortKey: '-score',
        spatial: {},
        tagKey: '',
        temporal: {}
      })

      expect(updatedCollectionsEmpty.collections.count).toBe(0)
      expect(updatedCollectionsEmpty.collections.isLoaded).toBe(true)
      expect(updatedCollectionsEmpty.collections.isLoading).toBe(false)
      expect(updatedCollectionsEmpty.collections.items).toEqual([])
      expect(updatedCollectionsEmpty.collections.loadTime).toEqual(expect.any(Number))
    })
  })
})
