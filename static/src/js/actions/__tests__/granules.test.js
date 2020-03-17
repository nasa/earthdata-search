import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  // applyGranuleFilters,
  updateGranuleResults,
  getGranules,
  excludeGranule,
  undoExcludeGranule,
  updateGranuleLinks,
  fetchLinks,
  fetchOpendapLinks
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
  UPDATE_GRANULE_LINKS,
  RESET_GRANULE_RESULTS,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS
} from '../../constants/actionTypes'
import CwicGranuleRequest from '../../util/request/cwicGranuleRequest'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})


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

// TODO: FIX
// describe('updateCollectionGranuleFilters', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   const store = mockStore({
//     authToken: 'token',
//     metadata: {
//       collections: {
//         allIds: ['collectionId'],
//         byId: {
//           collectionId: {
//             mock: 'data'
//           }
//         }
//       }
//     },
//     focusedCollection: 'collectionId',
//     query: {
//       collection: {
//         temporal: {},
//         spatial: {}
//       },
//       granule: { pageNum: 1 }
//     },
//     timeline: {
//       query: {}
//     }
//   })

//   store.dispatch(applyGranuleFilters('collectionId', { cloudCover: true }))
//   const storeActions = store.getActions()

//   const updateGranuleQueryMock = jest.spyOn(actions, 'updateGranuleQuery').mockImplementation(() => jest.fn())
//   const updateCollectionGranuleFiltersMock = jest.spyOn(actions, 'updateCollectionGranuleFilters').mockImplementation(() => jest.fn())
//   const getGranulesMock = jest.spyOn(actions, 'getGranules').mockImplementation(() => jest.fn())
//   const toggleSecondaryOverlayPanelMock = jest.spyOn(actions, 'toggleSecondaryOverlayPanel').mockImplementation(() => jest.fn())

//   test('should set the granule query to the first page', () => {
//     expect(updateGranuleQueryMock).toHaveBeenCalledTimes(1)
//   })
// })

describe('getGranules', () => {
  test('calls the API to get granules', async () => {
    nock(/cmr/)
      .post(/granules/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            mockGranuleData: 'goes here'
          }]
        }
      },
      {
        'cmr-hits': 1
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
      expect(storeActions[0].type).toEqual(UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS)
      expect(storeActions[1]).toEqual({
        type: RESET_GRANULE_RESULTS,
        payload: 'collectionId'
      })
      expect(storeActions[2]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[4]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[5]).toEqual({
        type: FINISHED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[6]).toEqual({
        type: UPDATE_AUTH,
        payload: ''
      })
      expect(storeActions[7]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          collectionId: 'collectionId',
          loaded: true
        }
      })
      expect(storeActions[8]).toEqual({
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
          }],
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })
    })
  })

  test('calls lambda to get authenticated granules', async () => {
    nock(/localhost/)
      .post(/granules/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            mockGranuleData: 'goes here'
          }]
        }
      },
      {
        'cmr-hits': 1,
        'jwt-token': 'token'
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
      expect(storeActions[0].type).toEqual(UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS)
      expect(storeActions[1]).toEqual({
        type: RESET_GRANULE_RESULTS,
        payload: 'collectionId'
      })
      expect(storeActions[2]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[4]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[5]).toEqual({
        type: FINISHED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[6]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      expect(storeActions[7]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          collectionId: 'collectionId',
          loaded: true
        }
      })
      expect(storeActions[8]).toEqual({
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
          }],
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })
    })
  })

  test('substitutes MBR for polygon in cwic granule searches', async () => {
    const cwicRequestMock = jest.spyOn(CwicGranuleRequest.prototype, 'search')

    nock(/localhost/)
      .post(/cwic\/granules/)
      .reply(200, '<feed></feed>')

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              isCwic: true,
              mock: 'data',
              metadata: {
                tags: {
                  'org.ceos.wgiss.cwic.granules.prod': {}
                }
              }
            }
          }
        }
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {
            polygon: '-77,38,-77,38,-76,38,-77,38'
          }
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
      expect(storeActions[0].type).toEqual(UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS)
      expect(storeActions[1]).toEqual({
        type: RESET_GRANULE_RESULTS,
        payload: 'collectionId'
      })
      expect(storeActions[2]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[4]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[5]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: true
      })

      expect(cwicRequestMock).toHaveBeenCalledTimes(1)
      expect(cwicRequestMock.mock.calls[0][0].boundingBox).toEqual('-77,37.99999999999998,-76,38.00105844675541')
    })
  })

  test('returns no results if there is no focused collection', () => {
    // mockStore with initialState
    const store = mockStore({
      metadata: {},
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
    expect(storeActions.length).toEqual(0)
  })

  test('does not call updateGranuleResults on error', async () => {
    nock(/cmr/)
      .post(/granules/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

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

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

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

describe('fetchLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get the granules from cmr', async () => {
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

    await store.dispatch(fetchLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        links: [
          'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
        ]
      },
      type: UPDATE_GRANULE_LINKS
    })
    expect(storeActions[1]).toEqual({
      payload: {
        id: 3,
        links: [
          'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
        ]
      },
      type: UPDATE_GRANULE_LINKS
    })
  })
})

describe('fetchOpendapLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get links from opendap', async () => {
    nock(/localhost/)
      .post(/ous/)
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'OPeNDAP'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
      },
      granule_count: 3
    }

    await store.dispatch(fetchOpendapLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        links: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      },
      type: UPDATE_GRANULE_LINKS
    })
  })
})
