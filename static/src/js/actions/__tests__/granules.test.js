import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  excludeGranule,
  fetchLinks,
  fetchBrowseLinks,
  fetchOpendapLinks,
  fetchOpenSearchLinks,
  getProjectGranules,
  getSearchGranules,
  undoExcludeGranule,
  updateGranuleLinks,
  updateGranuleResults
} from '../granules'

import {
  ADD_GRANULE_METADATA,
  EXCLUDE_GRANULE_ID,
  FINISHED_GRANULES_TIMER,
  FINISHED_PROJECT_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  PROJECT_GRANULES_LOADED,
  PROJECT_GRANULES_LOADING,
  REMOVE_SUBSCRIPTION_DISABLED_FIELDS,
  STARTED_GRANULES_TIMER,
  STARTED_PROJECT_GRANULES_TIMER,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_GRANULE_FILTERS,
  UPDATE_GRANULE_LINKS,
  UPDATE_GRANULE_RESULTS,
  UPDATE_PROJECT_GRANULE_RESULTS
} from '../../constants/actionTypes'

import OpenSearchGranuleRequest from '../../util/request/openSearchGranuleRequest'
import * as EventEmitter from '../../events/events'
import * as applicationConfig from '../../../../../sharedUtils/config'

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

describe('getSearchGranules', () => {
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
      }, {
        'cmr-hits': 1
      })

    const store = mockStore({
      authToken: '',
      earthdataEnvironment: 'prod',
      metadata: {
        collectionId: {
          mock: 'data'
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getSearchGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: []
        }
      })
      expect(storeActions[2]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[4]).toEqual({
        type: FINISHED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[5]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          collectionId: 'collectionId',
          loaded: true
        }
      })
      expect(storeActions[6]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [
          {
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }
        ]
      })
      expect(storeActions[7]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }],
          isOpenSearch: false,
          hits: 1,
          singleGranuleSize: 0,
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
      }, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    const store = mockStore({
      authToken: 'token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getSearchGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: []
        }
      })
      expect(storeActions[2]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[4]).toEqual({
        type: FINISHED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[5]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          collectionId: 'collectionId',
          loaded: true
        }
      })
      expect(storeActions[6]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [
          {
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }
        ]
      })
      expect(storeActions[7]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }],
          isOpenSearch: false,
          hits: 1,
          singleGranuleSize: 0,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })
    })
  })

  test('substitutes MBR for polygon in opensearch granule searches', async () => {
    const cwicRequestMock = jest.spyOn(OpenSearchGranuleRequest.prototype, 'search')

    nock(/localhost/)
      .post(/opensearch\/granules/)
      .reply(200, '<feed><opensearch:totalResults>1</opensearch:totalResults><entry><title>CWIC Granule</title></entry></feed>')

    const store = mockStore({
      authToken: 'token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            links: [{
              length: '0.0KB',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
              hreflang: 'en-US',
              href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
            }]
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {
            polygon: ['-77,38,-77,38,-76,38,-77,38']
          }
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getSearchGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: []
        }
      })
      expect(storeActions[2]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[4]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: true
      })
      expect(storeActions[5]).toEqual({
        type: FINISHED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[6]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          collectionId: 'collectionId',
          loaded: true
        }
      })
      expect(storeActions[7]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [{
          title: 'CWIC Granule',
          isOpenSearch: true,
          browse_flag: false
        }]
      })
      expect(storeActions[8]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            title: 'CWIC Granule',
            isOpenSearch: true,
            browse_flag: false
          }],
          isOpenSearch: true,
          hits: 1,
          singleGranuleSize: 0,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })

      expect(cwicRequestMock).toHaveBeenCalledTimes(1)
      expect(cwicRequestMock.mock.calls[0][0].boundingBox).toEqual('-77,37.99999999999998,-76,38.00105844675541')
    })
  })

  test('correctly parses opensearch results', async () => {
    const cwicRequestMock = jest.spyOn(OpenSearchGranuleRequest.prototype, 'search')

    nock(/localhost/)
      .post(/opensearch\/granules/)
      .reply(200, '<feed><opensearch:totalResults>1</opensearch:totalResults><entry><title type="text">CWIC Granule</title><id>12345</id><updated>2020-06-09T23:59:59Z</updated></entry></feed>')

    const store = mockStore({
      authToken: 'token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            links: [{
              length: '0.0KB',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
              hreflang: 'en-US',
              href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
            }]
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {
            polygon: ['-77,38,-77,38,-76,38,-77,38']
          }
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getSearchGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: []
        }
      })
      expect(storeActions[2]).toEqual({
        type: LOADING_GRANULES,
        payload: 'collectionId'
      })
      expect(storeActions[3]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[4]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: true
      })
      expect(storeActions[5]).toEqual({
        type: FINISHED_GRANULES_TIMER,
        payload: 'collectionId'
      })
      expect(storeActions[6]).toEqual({
        type: LOADED_GRANULES,
        payload: {
          collectionId: 'collectionId',
          loaded: true
        }
      })
      expect(storeActions[7]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [{
          browse_flag: false,
          formatted_temporal: [
            '2020-06-09 23:59:59',
            null
          ],
          id: '12345',
          isOpenSearch: true,
          time_start: '2020-06-09T23:59:59Z',
          title: 'CWIC Granule',
          updated: '2020-06-09T23:59:59Z'
        }]
      })
      expect(storeActions[8]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            browse_flag: false,
            formatted_temporal: [
              '2020-06-09 23:59:59',
              null
            ],
            id: '12345',
            isOpenSearch: true,
            time_start: '2020-06-09T23:59:59Z',
            title: 'CWIC Granule',
            updated: '2020-06-09T23:59:59Z'
          }],
          isOpenSearch: true,
          hits: 1,
          singleGranuleSize: 0,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })

      expect(cwicRequestMock).toHaveBeenCalledTimes(1)
      expect(cwicRequestMock.mock.calls[0][0].boundingBox).toEqual('-77,37.99999999999998,-76,38.00105844675541')
    })
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
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getSearchGranules()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('getProjectGranules', () => {
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
      }, {
        'cmr-hits': 1
      })

    const store = mockStore({
      authToken: '',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            mock: 'data'
          }
        }
      },
      project: {
        collections: {
          allIds: ['C10000000000-EDSC'],
          byId: {
            'C10000000000-EDSC': {
              granules: {
                addedGranuleIds: [],
                removedGranuleIds: []
              }
            }
          }
        }
      },
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getProjectGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[1]).toEqual({
        type: PROJECT_GRANULES_LOADING,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[2]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[3]).toEqual({
        type: FINISHED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[4]).toEqual({
        type: PROJECT_GRANULES_LOADED,
        payload: {
          collectionId: 'C10000000000-EDSC',
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [
          {
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }
        ]
      })
      expect(storeActions[6]).toEqual({
        type: UPDATE_PROJECT_GRANULE_RESULTS,
        payload: {
          collectionId: 'C10000000000-EDSC',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }],
          isOpenSearch: false,
          hits: 1,
          singleGranuleSize: 0,
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
      }, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    const store = mockStore({
      authToken: 'token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            mock: 'data'
          }
        }
      },
      project: {
        collections: {
          allIds: ['C10000000000-EDSC'],
          byId: {
            'C10000000000-EDSC': {
              granules: {
                addedGranuleIds: [],
                removedGranuleIds: []
              }
            }
          }
        }
      },
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getProjectGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[1]).toEqual({
        type: PROJECT_GRANULES_LOADING,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[2]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[3]).toEqual({
        type: FINISHED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[4]).toEqual({
        type: PROJECT_GRANULES_LOADED,
        payload: {
          collectionId: 'C10000000000-EDSC',
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [
          {
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }
        ]
      })
      expect(storeActions[6]).toEqual({
        type: UPDATE_PROJECT_GRANULE_RESULTS,
        payload: {
          collectionId: 'C10000000000-EDSC',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }],
          isOpenSearch: false,
          hits: 1,
          singleGranuleSize: 0,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })
    })
  })

  test('substitutes MBR for polygon in opensearch granule searches', async () => {
    const cwicRequestMock = jest.spyOn(OpenSearchGranuleRequest.prototype, 'search')

    nock(/localhost/)
      .post(/opensearch\/granules/)
      .reply(200, '<feed><opensearch:totalResults>1</opensearch:totalResults><entry><title>CWIC Granule</title></entry></feed>')

    const store = mockStore({
      authToken: 'token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            links: [{
              length: '0.0KB',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
              hreflang: 'en-US',
              href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
            }]
          }
        }
      },
      project: {
        collections: {
          allIds: ['C10000000000-EDSC'],
          byId: {
            'C10000000000-EDSC': {
              granules: {
                addedGranuleIds: [],
                removedGranuleIds: []
              }
            }
          }
        }
      },
      query: {
        collection: {
          temporal: {},
          spatial: {
            polygon: '-77,38,-77,38,-76,38,-77,38'
          }
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getProjectGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[1]).toEqual({
        type: PROJECT_GRANULES_LOADING,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[2]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[3]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: true
      })
      expect(storeActions[4]).toEqual({
        type: FINISHED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[5]).toEqual({
        type: PROJECT_GRANULES_LOADED,
        payload: {
          collectionId: 'C10000000000-EDSC',
          loaded: true
        }
      })
      expect(storeActions[6]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [{
          title: 'CWIC Granule',
          isOpenSearch: true,
          browse_flag: false
        }]
      })
      expect(storeActions[7]).toEqual({
        type: UPDATE_PROJECT_GRANULE_RESULTS,
        payload: {
          collectionId: 'C10000000000-EDSC',
          results: [{
            title: 'CWIC Granule',
            isOpenSearch: true,
            browse_flag: false
          }],
          isOpenSearch: true,
          hits: 1,
          singleGranuleSize: 0,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })

      expect(cwicRequestMock).toHaveBeenCalledTimes(1)
      expect(cwicRequestMock.mock.calls[0][0].boundingBox).toEqual('-77,37.99999999999998,-76,38.00105844675541')
    })
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
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C10000000000-EDSC': {}
        }
      },
      project: {
        collections: {
          allIds: ['C10000000000-EDSC'],
          byId: {
            'C10000000000-EDSC': {
              granules: {
                addedGranuleIds: [],
                removedGranuleIds: []
              }
            }
          }
        }
      },
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getProjectGranules()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })

  test('logs alert if the user adds more granules than the maxCmrPageSize', async () => {
    jest.spyOn(applicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      maxCmrPageSize: '1',
      thumbnailSize: {
        height: 85,
        width: 85
      }
    }))

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
      }, {
        'cmr-hits': 1,
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/alert_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token',
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C10000000000-EDSC': {
            mock: 'data'
          }
        },
        granules: {
          'G100000-EDSC': {},
          'G100002-EDSC': {}
        }
      },
      project: {
        collections: {
          allIds: ['C10000000000-EDSC'],
          byId: {
            'C10000000000-EDSC': {
              granules: {
                addedGranuleIds: ['G100000-EDSC', 'G100002-EDSC'],
                removedGranuleIds: []
              }
            }
          }
        }
      },
      query: {
        collection: {
          temporal: {},
          spatial: {}
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(getProjectGranules()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: STARTED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[1]).toEqual({
        type: PROJECT_GRANULES_LOADING,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[2]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[3]).toEqual({
        type: FINISHED_PROJECT_GRANULES_TIMER,
        payload: 'C10000000000-EDSC'
      })
      expect(storeActions[4]).toEqual({
        type: PROJECT_GRANULES_LOADED,
        payload: {
          collectionId: 'C10000000000-EDSC',
          loaded: true
        }
      })
      expect(storeActions[5]).toEqual({
        type: ADD_GRANULE_METADATA,
        payload: [
          {
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }
        ]
      })
      expect(storeActions[6]).toEqual({
        type: UPDATE_PROJECT_GRANULE_RESULTS,
        payload: {
          collectionId: 'C10000000000-EDSC',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false
          }],
          isOpenSearch: false,
          hits: 1,
          singleGranuleSize: 0,
          totalSize: {
            size: '0.0',
            unit: 'MB'
          }
        }
      })
    })
  })
})

describe('excludeGranule', () => {
  test('should create an action to update the collection', () => {
    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementationOnce(() => jest.fn())
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
    eventEmitterEmitMock.mockImplementation(() => jest.fn())

    const payload = {
      collectionId: 'collectionId',
      granuleId: 'granuleId'
    }

    const expectedAction = {
      type: EXCLUDE_GRANULE_ID,
      payload
    }

    const store = mockStore({
      query: {
        collection: {
          byId: {}
        }
      }
    })

    store.dispatch(excludeGranule(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)

    expect(getSearchGranulesMock).toBeCalledTimes(1)
    expect(eventEmitterEmitMock).toBeCalledTimes(1)
  })
})

describe('undoExcludeGranule', () => {
  test('should create an action to update the collection', () => {
    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

    const payload = 'collectionId'
    const expectedAction = {
      type: UNDO_EXCLUDE_GRANULE_ID,
      payload
    }

    const store = mockStore()
    store.dispatch(undoExcludeGranule(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual(expectedAction)

    expect(getSearchGranulesMock).toBeCalledTimes(1)
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
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: [
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
        }
      })

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: [
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
        }
      })

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: []
          }
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
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 588
    }

    await store.dispatch(fetchLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        percentDone: '50',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
          ],
          s3: []
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
    expect(storeActions[1]).toEqual({
      payload: {
        id: 3,
        percentDone: '100',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
          ],
          s3: []
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('does not update granule links if no links exist', async () => {
    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: []
          }
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
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 1
    }

    await store.dispatch(fetchLinks(params))
    const storeActions = store.getActions()
    expect(storeActions.length).toEqual(0)
  })

  describe('when S3 links exist', () => {
    test('populates the S3 links', async () => {
      nock(/localhost/)
        .post(/graphql/)
        .reply(200, {
          data: {
            granules: {
              cursor: 'mock-cursor',
              items: [
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
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
                      type: 'application/x-hdfeos',
                      title: 'This file may be downloaded directly from this link',
                      hreflang: 'en-US',
                      href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
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
          }
        })

      nock(/localhost/)
        .post(/graphql/)
        .reply(200, {
          data: {
            granules: {
              cursor: 'mock-cursor',
              items: [
                {
                  links: [
                    {
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                      type: 'application/x-hdfeos',
                      title: 'This file may be downloaded directly from this link',
                      hreflang: 'en-US',
                      href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
                    },
                    {
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
                      type: 'application/x-hdfeos',
                      title: 'This file may be downloaded directly from this link',
                      hreflang: 'en-US',
                      href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
                    }
                  ]
                }
              ]
            }
          }
        })

      nock(/localhost/)
        .post(/graphql/)
        .reply(200, {
          data: {
            granules: {
              cursor: 'mock-cursor',
              items: []
            }
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
          bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
        },
        granule_count: 588
      }

      await store.dispatch(fetchLinks(params))
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          id: 3,
          percentDone: '50',
          links: {
            download: [
              'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
            ],
            s3: [
              's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
            ]
          }
        },
        type: UPDATE_GRANULE_LINKS
      })
      expect(storeActions[1]).toEqual({
        payload: {
          id: 3,
          percentDone: '100',
          links: {
            download: [
              'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
            ],
            s3: [
              's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
            ]
          }
        },
        type: UPDATE_GRANULE_LINKS
      })
    })
  })
})

describe('fetchBrowseLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get the granules from cmr', async () => {
    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: [
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
        }
      })

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: [
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
        }
      })

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: []
          }
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
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 588
    }

    await store.dispatch(fetchBrowseLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        percentDone: '50',
        links: {
          browse: [
            'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
    expect(storeActions[1]).toEqual({
      payload: {
        id: 3,
        percentDone: '100',
        links: {
          browse: []
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('does not update granule links if no links exist', async () => {
    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: []
          }
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
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 1
    }

    await store.dispatch(fetchBrowseLinks(params))
    const storeActions = store.getActions()
    expect(storeActions.length).toEqual(0)
  })
})

describe('fetchOpendapLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get links from opendap', async () => {
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
          echo_collection_id: 'C10000005-EDSC',
          format: 'nc4',
          page_num: '1',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })

    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
          echo_collection_id: 'C10000005-EDSC',
          format: 'nc4',
          page_num: '2',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: []
      })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 3
    }

    await store.dispatch(fetchOpendapLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        links: {
          download: [
            'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
            'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
            'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('calls lambda to get links from opendap with excluded granules', async () => {
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
          echo_collection_id: 'C10000005-EDSC',
          exclude_granules: true,
          granules: ['G10000404-EDSC'],
          format: 'nc4',
          page_num: '1',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
          echo_collection_id: 'C10000005-EDSC',
          exclude_granules: true,
          granules: ['G10000404-EDSC'],
          format: 'nc4',
          page_num: '2',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: []
      })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'],
        exclude: {
          concept_id: ['G10000404-EDSC']
        }
      },
      granule_count: 3
    }

    await store.dispatch(fetchOpendapLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        links: {
          download: [
            'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
            'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
            'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('calls lambda to get links from opendap when using additive model', async () => {
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
          echo_collection_id: 'C10000005-EDSC',
          granules: ['G10000003-EDSC'],
          format: 'nc4',
          page_num: '1',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: [
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
          echo_collection_id: 'C10000005-EDSC',
          granules: ['G10000003-EDSC'],
          format: 'nc4',
          page_num: '2',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: []
      })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        concept_id: ['G10000003-EDSC'],
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 1
    }

    await store.dispatch(fetchOpendapLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        links: {
          download: [
            'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('calls lambda to get links from opendap without spatial params added', async () => {
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          echo_collection_id: 'C10000005-EDSC',
          format: 'nc4',
          page_num: '1',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })
    nock(/localhost/)
      .post(/ous/, (body) => {
        const { params } = body

        delete params.requestId

        // Ensure that the payload we're sending OUS is correct
        return JSON.stringify(params) === JSON.stringify({
          echo_collection_id: 'C10000005-EDSC',
          format: 'nc4',
          page_num: '2',
          page_size: '500',
          variables: ['V1000004-EDSC']
        })
      })
      .reply(200, {
        items: []
      })

    const store = mockStore({
      authToken: 'token'
    })

    const params = {
      id: 3,
      environment: 'prod',
      access_method: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collection_id: 'C10000005-EDSC',
      collection_metadata: {},
      granule_params: {
        echo_collection_id: 'C10000005-EDSC'
      },
      granule_count: 3
    }

    await store.dispatch(fetchOpendapLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        links: {
          download: [
            'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
            'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
            'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })
})

describe('fetchOpenSearchLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches all pages of opensearch links', async () => {
    jest.spyOn(applicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      openSearchGranuleLinksPageSize: '3'
    }))

    nock(/localhost/)
      .post(/opensearch/)
      .reply(200, `
        <feed>
          <opensearch:totalResults>5</opensearch:totalResults>
          <entry>
            <link href="https://example.com/granule1.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse1.png" rel="browse" />
          </entry>
          <entry>
            <link href="https://example.com/granule2.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse2.png" rel="browse" />
          </entry>
          <entry>
            <link href="https://example.com/granule3.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse3.png" rel="browse" />
          </entry>
        </feed>
      `)
    nock(/localhost/)
      .post(/opensearch/)
      .reply(200, `
        <feed>
          <opensearch:totalResults>5</opensearch:totalResults>
          <entry>
            <link href="https://example.com/granule4.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse4.png" rel="browse" />
            </entry>
          <entry>
            <link href="https://example.com/granule5.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse5.png" rel="browse" />
          </entry>
        </feed>
      `)

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
      collection_metadata: {
        links: [
          {
            href: 'http://exmple.com/mock-osdd',
            rel: 'http://exmple.com/search#'
          }
        ]
      },
      granule_params: {
        echo_collection_id: 'C10000005-EDSC'
      },
      granule_count: 5
    }

    await store.dispatch(fetchOpenSearchLinks(params))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        percentDone: '50',
        links: {
          browse: [
            'https://example.com/browse1.png',
            'https://example.com/browse2.png',
            'https://example.com/browse3.png'
          ],
          download: [
            'https://example.com/granule1.zip',
            'https://example.com/granule2.zip',
            'https://example.com/granule3.zip'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
    expect(storeActions[1]).toEqual({
      payload: {
        id: 3,
        percentDone: '100',
        links: {
          browse: [
            'https://example.com/browse4.png',
            'https://example.com/browse5.png'
          ],
          download: [
            'https://example.com/granule4.zip',
            'https://example.com/granule5.zip'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('does not update granule links on error', async () => {
    nock(/localhost/)
      .post(/opensearch/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

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
      collection_metadata: {
        links: [
          {
            href: 'http://exmple.com/mock-osdd',
            rel: 'http://exmple.com/search#'
          }
        ]
      },
      granule_params: {
        echo_collection_id: 'C10000005-EDSC'
      },
      granule_count: 5
    }

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(fetchOpenSearchLinks(params)).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('applyGranuleFilters', () => {
  describe('when the focused collection is not in the project', () => {
    test('it does not request project granules', () => {
      const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
      getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

      const getProjectGranulesMock = jest.spyOn(actions, 'getProjectGranules')
      getProjectGranulesMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({
        authToken: 'token',
        focusedCollection: 'C100000-EDSC',
        query: {
          collection: {
            byId: {
              'C100000-EDSC': {
                granules: {
                  pageNum: 1
                }
              }
            }
          }
        }
      })

      store.dispatch(actions.applyGranuleFilters({ pageNum: 2 }))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_GRANULE_FILTERS,
        payload: { collectionId: 'C100000-EDSC', pageNum: 2 }
      })
      expect(storeActions[1]).toEqual({
        type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
      })

      expect(getSearchGranulesMock).toBeCalledTimes(1)
      expect(getProjectGranulesMock).toBeCalledTimes(0)
    })
  })

  describe('when the focused collection is in the project', () => {
    test('it also requests project granules', () => {
      const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
      getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

      const getProjectGranulesMock = jest.spyOn(actions, 'getProjectGranules')
      getProjectGranulesMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({
        authToken: 'token',
        focusedCollection: 'C100000-EDSC',
        metadata: {
          collections: {
            'C100000-EDSC': {
              hasGranules: true
            }
          }
        },
        project: {
          collections: {
            allIds: ['C100000-EDSC'],
            byId: {
              'C100000-EDSC': {
                granules: {
                  addedGranuleIds: [],
                  removedGranuleIds: []
                }
              }
            }
          }
        },
        query: {
          collection: {
            byId: {
              'C100000-EDSC': {
                granules: {
                  pageNum: 1
                }
              }
            }
          }
        }
      })

      store.dispatch(actions.applyGranuleFilters({ pageNum: 2 }))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_GRANULE_FILTERS,
        payload: { collectionId: 'C100000-EDSC', pageNum: 2 }
      })
      expect(storeActions[1]).toEqual({
        type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
      })

      expect(getSearchGranulesMock).toBeCalledTimes(1)
      expect(getProjectGranulesMock).toBeCalledTimes(1)
    })
  })
})
