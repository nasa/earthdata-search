import nock from 'nock'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import * as getClientId from '../../../../../../sharedUtils/getClientId'
// @ts-expect-error This file does not have types
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

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
      getCollections: expect.any(Function)
    })
  })

  describe('getCollections', () => {
    beforeEach(() => {
      vi.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ client: 'eed-edsc-test-serverless-client' }))

      vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
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

        state.granules.getGranules = vi.fn()
        state.user.edlToken = 'mock-token'

        state.facets.facets.updateFacets = vi.fn()
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

        state.errors.handleError = vi.fn()
        state.granules.getGranules = vi.fn()

        state.facets.facets.updateFacets = vi.fn()
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
})
