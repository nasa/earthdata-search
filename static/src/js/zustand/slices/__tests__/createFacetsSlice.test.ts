import nock from 'nock'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error There are no types for this file
import * as collectionUtils from '../../../util/collections'

import type{ Facet } from '../../types'

describe('createFacetsSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { facets } = zustandState

    expect(facets).toEqual({
      facets: {
        allIds: [],
        byId: {},
        isLoaded: false,
        isLoading: false,
        updateFacets: expect.any(Function)
      },
      viewAllFacets: {
        allIds: [],
        byId: {},
        collectionCount: null,
        isLoaded: false,
        isLoading: false,
        selectedCategory: null,
        getViewAllFacets: expect.any(Function),
        resetState: expect.any(Function)
      }
    })
  })

  describe('facets', () => {
    describe('updateFacets', () => {
      test('updates the facets in the store', () => {
        const zustandState = useEdscStore.getState()
        const { facets } = zustandState

        const testFacets = [
          ({
            applied: true,
            title: 'Test Facet 1',
            has_children: true,
            type: 'group',
            children: [{
              title: 'Item 1',
              count: 10,
              applied: false
            }, {
              title: 'Item 2',
              count: 5,
              applied: true
            }]
          } as Facet),
          ({
            applied: true,
            title: 'Test Facet 2',
            has_children: true,
            type: 'group',
            children: [
              {
                title: 'Item A',
                count: 8,
                applied: true
              },
              {
                title: 'Item B',
                count: 12,
                applied: false
              }
            ]
          } as Facet)
        ]

        facets.facets.updateFacets(testFacets)

        const updatedState = useEdscStore.getState()
        const { facets: updatedFacets } = updatedState

        expect(updatedFacets.facets.allIds).toEqual(['Test Facet 1', 'Test Facet 2'])
        expect(updatedFacets.facets.byId).toEqual({
          'Test Facet 1': {
            applied: true,
            children: [{
              applied: false,
              count: 10,
              title: 'Item 1'
            }, {
              applied: true,
              count: 5,
              title: 'Item 2'
            }],
            has_children: true,
            title: 'Test Facet 1',
            totalSelected: 1,
            type: 'group'
          },
          'Test Facet 2': {
            applied: true,
            children: [{
              applied: true,
              count: 8,
              title: 'Item A'
            }, {
              applied: false,
              count: 12,
              title: 'Item B'
            }],
            has_children: true,
            title: 'Test Facet 2',
            totalSelected: 1,
            type: 'group'
          }
        })
      })
    })
  })

  describe('viewAllFacets', () => {
    describe('getViewAllFacets', () => {
      test('calls the API to get the View All Facets', async () => {
        nock(/cmr/)
          .post(/collections/)
          .reply(
            200,
            {
              feed: {
                updated: '2019-03-27T20:21:14.705Z',
                id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000',
                title: 'ECHO dataset metadata',
                entry: [{
                  mockCollectionData: 'goes here'
                }],
                facets: {
                  children: [{
                    applied: true,
                    has_children: true,
                    title: 'Instruments',
                    type: 'group',
                    children: [
                      {
                        title: '1 Test facet',
                        type: 'filter',
                        applied: false,
                        has_children: false,
                        links: {
                          apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=1+Test+facet'
                        }
                      },
                      {
                        title: 'Test facet 2',
                        type: 'filter',
                        applied: false,
                        has_children: false,
                        links: {
                          apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=Test+facet+2'
                        }
                      }
                    ]
                  }, {
                    applied: false,
                    has_children: true,
                    title: 'Platforms',
                    type: 'group',
                    children: []
                  }]
                }
              }
            },
            {
              'cmr-hits': '1'
            }
          )

        const prepareCollectionParamsSpy = vi.spyOn(collectionUtils, 'prepareCollectionParams')

        const zustandState = useEdscStore.getState()
        const { facets } = zustandState

        await facets.viewAllFacets.getViewAllFacets('Instruments')

        const updatedState = useEdscStore.getState()
        const { facets: updatedFacets } = updatedState

        expect(prepareCollectionParamsSpy).toHaveBeenCalledTimes(1)
        expect(prepareCollectionParamsSpy).toHaveBeenCalledWith()

        expect(updatedFacets.viewAllFacets.allIds).toEqual(['Instruments'])
        expect(updatedFacets.viewAllFacets.byId).toEqual({
          Instruments: {
            applied: true,
            children: [{
              applied: false,
              has_children: false,
              links: { apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=1+Test+facet' },
              title: '1 Test facet',
              type: 'filter'
            }, {
              applied: false,
              has_children: false,
              links: { apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=Test+facet+2' },
              title: 'Test facet 2',
              type: 'filter'
            }],
            has_children: true,
            startingLetters: ['#', 'T'],
            title: 'Instruments',
            totalSelected: 0,
            type: 'group'
          }
        })

        expect(updatedFacets.viewAllFacets.collectionCount).toEqual(1)
        expect(updatedFacets.viewAllFacets.selectedCategory).toEqual('Instruments')
      })

      test('does not call updateCollectionResults on error', async () => {
        nock(/cmr/)
          .post(/collections/)
          .reply(500, {}, { 'cmr-hits': '1' })

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        useEdscStore.setState((state) => {
          // eslint-disable-next-line no-param-reassign
          state.errors.handleError = vi.fn()
        })

        const prepareCollectionParamsSpy = vi.spyOn(collectionUtils, 'prepareCollectionParams')

        const zustandState = useEdscStore.getState()
        const { facets } = zustandState

        await facets.viewAllFacets.getViewAllFacets('Instruments')

        expect(prepareCollectionParamsSpy).toHaveBeenCalledTimes(1)
        expect(prepareCollectionParamsSpy).toHaveBeenCalledWith()

        const { errors } = useEdscStore.getState()
        expect(errors.handleError).toHaveBeenCalledTimes(1)
        expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
          action: 'getViewAllFacets',
          resource: 'facets',
          showAlertButton: true,
          title: 'Something went wrong fetching all filter options'
        }))
      })
    })

    describe('resetState', () => {
      test('resets the viewAllFacets state', () => {
        const zustandState = useEdscStore.getState()
        const { facets } = zustandState

        // Manually set some state to be reset
        useEdscStore.setState((state) => {
          state.facets.viewAllFacets.allIds = ['Test']
          state.facets.viewAllFacets.byId = { Test: {} as Facet }
          state.facets.viewAllFacets.collectionCount = 10
          state.facets.viewAllFacets.isLoaded = true
          state.facets.viewAllFacets.isLoading = true
          state.facets.viewAllFacets.selectedCategory = 'Test'
        })

        // Call the resetState function
        facets.viewAllFacets.resetState()

        const updatedState = useEdscStore.getState()
        const { facets: updatedFacets } = updatedState

        expect(updatedFacets.viewAllFacets).toEqual({
          allIds: [],
          byId: {},
          collectionCount: null,
          isLoaded: false,
          isLoading: false,
          selectedCategory: null,
          getViewAllFacets: expect.any(Function),
          resetState: expect.any(Function)
        })
      })
    })
  })
})
