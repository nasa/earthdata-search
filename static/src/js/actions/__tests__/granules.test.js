import moxios from 'moxios'
import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  updateGranuleResults,
  getGranules,
  excludeGranule,
  undoExcludeGranule,
  updateGranuleDownloadParams,
  updateGranuleLinks,
  fetchGranuleLinks,
  fetchLinks
} from '../granules'
import {
  UPDATE_GRANULE_RESULTS,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  UPDATE_AUTH,
  EXCLUDE_GRANULE_ID,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_GRANULE_DOWNLOAD_PARAMS,
  UPDATE_GRANULE_LINKS
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateGranuleResults', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_GRANULE_RESULTS,
      payload
    }
    expect(updateGranuleResults(payload)).toEqual(expectedAction)
  })
})

describe('getGranules', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls the API to get granules', async () => {
    moxios.stubRequest(/gov\/search\/granules.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            mockGranuleData: 'goes here'
          }]
        }
      },
      headers: {
        'cmr-hits': 1
      }
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      },
      timeline: {
        query: {}
      }
    })

    // call the dispatch
    await store.dispatch(getGranules()).then(() => {
      // Is updateGranuleResults called with the right payload
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_GRANULES })
      expect(storeActions[1]).toEqual({ type: STARTED_GRANULES_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_GRANULES_TIMER })
      expect(storeActions[3]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      expect(storeActions[4]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          hits: 1,
          isCwic: false,
          results: [{
            mockGranuleData: 'goes here',
            formatted_temporal: [
              null,
              null
            ],
            is_cwic: false
          }]
        }
      })
    })
  })

  test('calls lambda to get authenticated granules', async () => {
    moxios.stubRequest(/3001\/granules.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            mockGranuleData: 'goes here'
          }]
        }
      },
      headers: {
        'cmr-hits': 1,
        'jwt-token': 'token'
      }
    })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      },
      timeline: {
        query: {}
      }
    })

    // call the dispatch
    await store.dispatch(getGranules()).then(() => {
      // Is updateGranules called with the right payload
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_GRANULES })
      expect(storeActions[1]).toEqual({ type: STARTED_GRANULES_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_GRANULES_TIMER })
      expect(storeActions[3]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[4]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          hits: 1,
          isCwic: false,
          results: [{
            mockGranuleData: 'goes here',
            formatted_temporal: [
              null,
              null
            ],
            is_cwic: false
          }]
        }
      })
    })
  })

  test('returns no results if there is no focused collection', () => {
    // mockStore with initialState
    const store = mockStore({
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      }
    })

    store.dispatch(getGranules())
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_GRANULE_RESULTS,
      payload: {
        results: []
      }
    })
  })

  test('does not call updateGranuleResults on error', async () => {
    moxios.stubRequest(/granules.*/, {
      status: 500,
      response: {}
    })

    const store = mockStore({
      authToken: '',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              mock: 'data'
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      },
      timeline: {
        query: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await store.dispatch(getGranules()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('excludeGranule', () => {
  test('should create an action to update the collection', () => {
    const payload = {
      collectionId: 'collectionId',
      granuleId: 'granuleId'
    }
    const expectedAction = {
      type: EXCLUDE_GRANULE_ID,
      payload
    }
    const store = mockStore()
    store.dispatch(excludeGranule(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
  })
})

describe('undoExcludeGranule', () => {
  test('should create an action to update the collection', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: UNDO_EXCLUDE_GRANULE_ID,
      payload
    }
    const store = mockStore()
    store.dispatch(undoExcludeGranule(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
  })
})

describe('updateGranuleDownloadParams', () => {
  test('should create an action to update the granule download parameters', () => {
    const payload = {
      retrievalId: 'id',
      collectionId: 'collection_id'
    }
    const expectedAction = {
      type: UPDATE_GRANULE_DOWNLOAD_PARAMS,
      payload
    }
    const store = mockStore()
    store.dispatch(updateGranuleDownloadParams(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
  })
})

describe('updateGranuleLinks', () => {
  test('should create an action to update the granule download parameters', () => {
    const payload = {
      granuleDownloadLinks: []
    }
    const expectedAction = {
      type: UPDATE_GRANULE_LINKS,
      payload
    }
    const store = mockStore()
    store.dispatch(updateGranuleLinks(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)
  })
})

describe('fetchGranuleLinks', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('calls lambda to get the retreival collection details', async () => {
    const endpointResponse = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'download'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
      },
      granule_count: 888
    }

    moxios.stubRequest(/3001\/retrievals\/\d\/collections\/C\d+-[A-Z]+/, {
      status: 200,
      response: endpointResponse
    })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      collection_id: 'C10000005-EDSC'
    }

    await store.dispatch(fetchGranuleLinks(params, 'token'))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        ...endpointResponse
      },
      type: UPDATE_GRANULE_DOWNLOAD_PARAMS
    })
  })

  test('takes no actions if parameters are missing', () => {
    const store = mockStore({
      query: {
        collection: {
          temporal: {},
          spatial: {}
        },
        granule: { pageNum: 1 }
      }
    })

    const params = {
      id: 3
    }

    store.dispatch(fetchGranuleLinks(params, 'token'))
    const storeActions = store.getActions()
    expect(storeActions.length).toEqual(0)
  })

  test('takes no action when the request fails', async () => {
    moxios.stubRequest(/3001\/retrievals\/\d\/collections\/C\d+-[A-Z]+/, {
      status: 404,
      response: {
        errors: [
          'Retrieval Collection \'C10000005-EDSC\' (for Retrieval \'3\') not found'
        ]
      }
    })

    const store = mockStore({
      authToken: 'token'
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const params = {
      id: 3,
      collection_id: 'C10000005-EDSC'
    }

    await store.dispatch(fetchGranuleLinks(params, 'token'))
    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})

describe('fetchLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get the retreival collection details', async () => {
    nock(/localhost/)
      .post(/granules/)
      .reply(200, {
        feed: {
          entry: [
            {
              links: [
                {
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                  type: 'application/x-hdfeos',
                  title: 'This file may be downloaded directly from this link',
                  hreflang: 'en-US',
                  href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
                },
                {
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
                  type: 'text/html',
                  title: 'This file may be accessed using OPeNDAP directly from this link (OPENDAP DATA)',
                  hreflang: 'en-US',
                  href: 'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
                },
                {
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
                  type: 'image/jpeg',
                  title: 'This Browse file may be downloaded directly from this link (BROWSE)',
                  hreflang: 'en-US',
                  href: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
                }
              ]
            }
          ]
        }
      })

    nock(/localhost/)
      .post(/granules/)
      .reply(200, {
        feed: {
          entry: [
            {
              links: [
                {
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                  type: 'application/x-hdfeos',
                  title: 'This file may be downloaded directly from this link',
                  hreflang: 'en-US',
                  href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
                }
              ]
            }
          ]
        }
      })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'download'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
      },
      granule_count: 888
    }

    await store.dispatch(fetchLinks(params, 'token'))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: [
        'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
      ],
      type: UPDATE_GRANULE_LINKS
    })
    expect(storeActions[1]).toEqual({
      payload: [
        'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
      ],
      type: UPDATE_GRANULE_LINKS
    })
  })
})
