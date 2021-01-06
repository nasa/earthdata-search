import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as tinyCookie from 'tiny-cookie'

import {
  applyViewAllFacets,
  changeViewAllFacet,
  copyCMRFacets,
  getViewAllFacets,
  onViewAllFacetsErrored,
  onViewAllFacetsLoaded,
  onViewAllFacetsLoading,
  triggerViewAllFacets,
  updateViewAllFacets
} from '../viewAllFacets'

import {
  COPY_CMR_FACETS_TO_VIEW_ALL,
  ERRORED_VIEW_ALL_FACETS,
  LOADED_VIEW_ALL_FACETS,
  LOADING_VIEW_ALL_FACETS,
  UPDATE_SELECTED_VIEW_ALL_FACET,
  UPDATE_VIEW_ALL_FACETS,
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  UPDATE_COLLECTION_QUERY,
  UPDATE_SELECTED_CMR_FACET
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

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

describe('applyViewAllFacets', () => {
  test('should create an action to update CMR facets', () => {
    nock(/cmr/)
      .post(/collections/)
      .reply(200, {
        feed: {
          entry: [],
          facets: {}
        }
      }, { 'cmr-hits': 0 })

    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: true
        }
      },
      facetsParams: {
        cmr: {},
        viewAll: {
          instrument_h: ['1 Test facet', 'Test facet 2']
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        viewAllFacets: {}
      }
    })

    store.dispatch(applyViewAllFacets())
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_VIEW_ALL_FACETS_MODAL,
      payload: false
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_COLLECTION_QUERY,
      payload: {
        pageNum: 1
      }
    })
    expect(storeActions[2]).toEqual({
      type: UPDATE_SELECTED_CMR_FACET,
      payload: {
        data_center_h: undefined,
        instrument_h: ['1 Test facet', 'Test facet 2'],
        platform_h: undefined,
        processing_level_id_h: undefined,
        project_h: undefined,
        science_keywords_h: undefined
      }
    })
  })
})

describe('copyCMRFacets', () => {
  test('should create an action to update the View All Facets state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: true
        }
      },
      facetsParams: {
        cmr: { instrument_h: ['1 Test facet', 'Test facet 2'] },
        viewAll: {}
      },
      query: {
        collection: {}
      },
      searchResults: {
        viewAllFacets: {}
      }
    })

    store.dispatch(copyCMRFacets())
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: COPY_CMR_FACETS_TO_VIEW_ALL,
      payload: { instrument_h: ['1 Test facet', 'Test facet 2'] }
    })
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
            has_children: true,
            title: 'Instrument',
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
        has_children: true,
        title: 'Instrument',
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
      }
    }
  }

  test('calls the API to get the View All Facets', async () => {
    nock(/cmr/)
      .post(/collections/)
      .reply(200, stubResponse, { 'cmr-hits': 1 })

    // mockStore with initialState
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
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    // call the dispatch
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

    // mockStore with initialState
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
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    // call the dispatch
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

    // mockStore with initialState
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
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    // call the dispatch
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

describe('triggerViewAllFacets', () => {
  test('calls copyCMRFacets and getViewAllFacets', async () => {
    jest.spyOn(tinyCookie, 'set').mockImplementation(() => jest.fn())

    nock(/cmr/)
      .post(/collections/)
      .reply(200, {
        feed: {
          entry: [],
          facets: {}
        }
      }, { 'cmr-hits': 0 })

    // mockStore with initialState
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
      },
      facetsParams: {
        cmr: {
          instrument_h: ['1 Test facet', 'Test facet 2']
        }
      }
    })

    // call the dispatch
    store.dispatch(triggerViewAllFacets('Instruments'))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: COPY_CMR_FACETS_TO_VIEW_ALL,
      payload: {
        instrument_h: ['1 Test facet', 'Test facet 2']
      }
    })
    expect(storeActions[1]).toEqual({
      type: LOADING_VIEW_ALL_FACETS,
      payload: {
        selectedCategory: 'Instruments'
      }
    })
  })
})

describe('changeViewAllFacet', () => {
  test('calls updateViewAllFacet and getViewAllFacets', () => {
    jest.spyOn(tinyCookie, 'set').mockImplementation(() => jest.fn())

    nock(/cmr/)
      .post(/collections/)
      .reply(200, {
        feed: {
          entry: [],
          facets: {}
        }
      }, { 'cmr-hits': 0 })

    // mockStore with initialState
    const store = mockStore({
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
      },
      facetsParams: {
        viewAll: {
          instrument_h: ['1 Test facet', 'Test facet 2']
        }
      }
    })

    // call the dispatch
    const newFacets = { instrument_h: ['1 Test facet', 'Test facet 2', 'And another'] }
    store.dispatch(changeViewAllFacet({
      params: newFacets,
      selectedCategory: 'Instruments'
    }))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_SELECTED_VIEW_ALL_FACET,
      payload: {
        data_center_h: undefined,
        instrument_h: ['1 Test facet', 'Test facet 2', 'And another'],
        platform_h: undefined,
        processing_level_id_h: undefined,
        project_h: undefined,
        science_keywords_h: undefined
      }
    })
    expect(storeActions[1]).toEqual({
      type: LOADING_VIEW_ALL_FACETS,
      payload: {
        selectedCategory: 'Instruments'
      }
    })
  })
})
