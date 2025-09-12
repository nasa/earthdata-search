import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import { fetchGranuleLinks, updateGranuleLinks } from '../granules'

import { UPDATE_GRANULE_LINKS } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

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
