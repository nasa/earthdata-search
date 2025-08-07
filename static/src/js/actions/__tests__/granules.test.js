import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  fetchGranuleLinks,
  getSearchGranules,
  updateGranuleLinks,
  updateGranuleResults
} from '../granules'

import {
  ADD_GRANULE_METADATA,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  UPDATE_GRANULE_LINKS,
  UPDATE_GRANULE_RESULTS
} from '../../constants/actionTypes'

import OpenSearchGranuleRequest from '../../util/request/openSearchGranuleRequest'
import useEdscStore from '../../zustand/useEdscStore'

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
      metadata: {
        collectionId: {
          mock: 'data'
        }
      },
      focusedCollection: 'collectionId'
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
            isOpenSearch: false,
            spatial: null
          }
        ]
      })

      expect(storeActions[7]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false,
            spatial: null
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
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      focusedCollection: 'collectionId'
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
            isOpenSearch: false,
            spatial: null
          }
        ]
      })

      expect(storeActions[7]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            mockGranuleData: 'goes here',
            isOpenSearch: false,
            spatial: null
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
      focusedCollection: 'collectionId'
    })

    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.query.collection.spatial = {
        polygon: ['-77,38,-77,38,-76,38,-77,38']
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
          collectionConceptId: 'collectionId',
          isOpenSearch: true,
          spatial: null,
          title: 'CWIC Granule'
        }]
      })

      expect(storeActions[8]).toEqual({
        type: UPDATE_GRANULE_RESULTS,
        payload: {
          collectionId: 'collectionId',
          results: [{
            browse_flag: false,
            collectionConceptId: 'collectionId',
            isOpenSearch: true,
            spatial: null,
            title: 'CWIC Granule'
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
      focusedCollection: 'collectionId'
    })

    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.query.collection.spatial = {
        polygon: ['-77,38,-77,38,-76,38,-77,38']
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
          collectionConceptId: 'collectionId',
          formatted_temporal: [
            '2020-06-09 23:59:59',
            null
          ],
          id: '12345',
          isOpenSearch: true,
          spatial: null,
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
            collectionConceptId: 'collectionId',
            formatted_temporal: [
              '2020-06-09 23:59:59',
              null
            ],
            id: '12345',
            isOpenSearch: true,
            spatial: null,
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
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      focusedCollection: 'collectionId'
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getSearchGranules()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
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
  test('calls lambda to get the granules links from cmr', async () => {
    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: 'mock-cursor',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf',
            'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
          ]
        }
      })

    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: 'mock-cursor',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
          ]
        }
      })

    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: null,
        links: {
          download: []
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

    await store.dispatch(fetchGranuleLinks(params, ['data', 's3']))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        percentDone: '50',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf',
            'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
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
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('calls lambda to get the granules s3 links from cmr', async () => {
    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: 'mock-cursor',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
          ],
          s3: [
            's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
          ]
        }
      })

    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: 'mock-cursor',
        links: {
          download: [
            'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
          ],
          s3: [
            's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
          ]
        }
      })

    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: null,
        links: {
          download: [],
          s3: []
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

    await store.dispatch(fetchGranuleLinks(params, ['data', 's3']))
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

  test('calls lambda to get the browse links', async () => {
    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: 'mock-cursor',
        links: {
          browse: [
            'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
          ]
        }
      })

    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: null,
        links: {
          browse: []
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
      collection_metadata: {
        granules: {
          items: [{
            browseFlag: true
          }]
        }
      },
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 588
    }

    await store.dispatch(fetchGranuleLinks(params, ['browse']))
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
  })

  test('calls lambda to get the opensearch links', async () => {
    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: 'mock-cursor',
        links: {
          browse: [
            'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
          ]
        }
      })

    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: null,
        links: {
          browse: []
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
      collection_metadata: {
        isOpenSearch: true
      },
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      granule_count: 588
    }

    await store.dispatch(fetchGranuleLinks(params, ['browse']))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        id: 3,
        percentDone: '8',
        links: {
          browse: [
            'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
          ]
        }
      },
      type: UPDATE_GRANULE_LINKS
    })
  })

  test('does not update granule links if no links exist', async () => {
    nock(/localhost/)
      .get(/granule_links/)
      .reply(200, {
        cursor: null,
        links: {
          download: []
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

    await store.dispatch(fetchGranuleLinks(params, ['data', 's3']))
    const storeActions = store.getActions()
    expect(storeActions.length).toEqual(0)
  })

  test('handles an error when fetching links', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

    nock(/localhost/)
      .get(/granule_links/)
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

    await store.dispatch(fetchGranuleLinks(params, ['data', 's3'])).then(() => {
      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
        action: 'fetchGranuleLinks',
        resource: 'granule links'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
