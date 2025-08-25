import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  getViewAllFacets,
  onViewAllFacetsErrored,
  onViewAllFacetsLoaded,
  onViewAllFacetsLoading,
  updateViewAllFacets
} from '../viewAllFacets'

import {
  ERRORED_VIEW_ALL_FACETS,
  LOADED_VIEW_ALL_FACETS,
  LOADING_VIEW_ALL_FACETS,
  UPDATE_VIEW_ALL_FACETS,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateViewAllFacets', () => {
  test('should create an action to update the View All facets', () => {
    const payload = ['test payload']
    const expectedAction = {
      type: UPDATE_VIEW_ALL_FACETS,
      payload
    }
    expect(updateViewAllFacets(payload)).toEqual(expectedAction)
  })
})

describe('onViewAllFacetsLoading', () => {
  test('should create an action to update the selected category', () => {
    const payload = { selectedCategory: 'Test Category' }
    const expectedAction = {
      type: LOADING_VIEW_ALL_FACETS,
      payload
    }
    expect(onViewAllFacetsLoading('Test Category')).toEqual(expectedAction)
  })
})

describe('onCollectionsLoaded', () => {
  test('should create an action to update the View All facets', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_VIEW_ALL_FACETS,
      payload
    }
    expect(onViewAllFacetsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('onViewAllFacetsErrored', () => {
  test('should create an action to update the View All facets', () => {
    const expectedAction = {
      type: ERRORED_VIEW_ALL_FACETS
    }
    expect(onViewAllFacetsErrored()).toEqual(expectedAction)
  })
})

describe('getViewAllFacets', () => {
  const stubResponse = {
    feed: {
      updated: '2019-03-27T20:21:14.705Z',
      id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000',
      title: 'ECHO dataset metadata',
      entry: [{
        mockCollectionData: 'goes here'
      }],
      facets: {
        children: {
          instrument: {
            applied: true,
            hasChildren: true,
            title: 'Instrument',
            type: 'group',
            children: [
              {
                title: '1 Test facet',
                type: 'filter',
                applied: false,
                hasChildren: false,
                links: {
                  apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=1+Test+facet'
                }
              },
              {
                title: 'Test facet 2',
                type: 'filter',
                applied: false,
                hasChildren: false,
                links: {
                  apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=Test+facet+2'
                }
              }
            ]
          }
        }
      }
    }
  }

  const facetsPayload = {
    hits: 1,
    selectedCategory: 'Instruments',
    facets: {
      instrument: {
        applied: true,
        hasChildren: true,
        title: 'Instrument',
        type: 'group',
        children: [
          {
            title: '1 Test facet',
            type: 'filter',
            applied: false,
            hasChildren: false,
            links: {
              apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=1+Test+facet'
            }
          },
          {
            title: 'Test facet 2',
            type: 'filter',
            applied: false,
            hasChildren: false,
            links: {
              apply: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic&facets_size[instrument]=10000&instrument_h[]=Test+facet+2'
            }
          }
        ]
      }
    }
  }

  test('calls the API to get the View All Facets', async () => {
    nock(/cmr/)
      .post(/collections/)
      .reply(200, stubResponse, { 'cmr-hits': 1 })

    // MockStore with initialState
    const store = mockStore({
      authToken: '',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      },
      query: {
        collection: {
          keyword: 'search keyword'
        }
      }
    })

    // Call the dispatch
    await store.dispatch(getViewAllFacets('Instruments')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: LOADING_VIEW_ALL_FACETS,
        payload: {
          selectedCategory: 'Instruments'
        }
      })

      expect(storeActions[1]).toEqual({
        type: TOGGLE_VIEW_ALL_FACETS_MODAL,
        payload: true
      })

      expect(storeActions[2]).toEqual({
        type: LOADED_VIEW_ALL_FACETS,
        payload: {
          loaded: true
        }
      })

      expect(storeActions[3]).toEqual({
        type: UPDATE_VIEW_ALL_FACETS,
        payload: facetsPayload
      })
    })
  })

  test('calls lambda to get the authenticated View All Facets', async () => {
    nock(/localhost/)
      .post(/collections/)
      .reply(200, stubResponse, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: 'token',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      },
      query: {
        collection: {
          keyword: 'search keyword'
        }
      }
    })

    // Call the dispatch
    await store.dispatch(getViewAllFacets('Instruments')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: LOADING_VIEW_ALL_FACETS,
        payload: {
          selectedCategory: 'Instruments'
        }
      })

      expect(storeActions[1]).toEqual({
        type: TOGGLE_VIEW_ALL_FACETS_MODAL,
        payload: true
      })

      expect(storeActions[2]).toEqual({
        type: LOADED_VIEW_ALL_FACETS,
        payload: {
          loaded: true
        }
      })

      expect(storeActions[3]).toEqual({
        type: UPDATE_VIEW_ALL_FACETS,
        payload: facetsPayload
      })
    })
  })

  test('does not call updateCollectionResults on error', async () => {
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    nock(/cmr/)
      .post(/collections/)
      .reply(500, {}, { 'cmr-hits': 1 })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    // MockStore with initialState
    const store = mockStore({
      authToken: '',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        viewAllFacets: {}
      },
      query: {
        collection: {
          keyword: 'search keyword'
        }
      }
    })

    // Call the dispatch
    await store.dispatch(getViewAllFacets('Instruments')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: LOADING_VIEW_ALL_FACETS,
        payload: {
          selectedCategory: 'Instruments'
        }
      })

      expect(storeActions[1]).toEqual({
        type: TOGGLE_VIEW_ALL_FACETS_MODAL,
        payload: true
      })

      expect(storeActions[2]).toEqual({
        type: ERRORED_VIEW_ALL_FACETS
      })

      expect(storeActions[3]).toEqual({
        type: LOADED_VIEW_ALL_FACETS,
        payload: {
          loaded: false
        }
      })

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
