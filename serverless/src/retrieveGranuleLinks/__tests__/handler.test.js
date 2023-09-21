import knex from 'knex'
import mockKnex from 'mock-knex'
import { v4 as uuidv4 } from 'uuid'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as fetchCmrLinks from '../fetchCmrLinks'
import * as fetchOpenSearchLinks from '../fetchOpenSearchLinks'
import * as fetchOpendapLinks from '../fetchOpendapLinks'

import retrieveGranuleLinks from '../handler'

let dbTracker

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: 1 }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    const dbCon = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    return dbCon
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('retrieveGranuleLinks', () => {
  test('calls fetchCmrLinks for cmr granules', async () => {
    const expectedResponse = {
      cursor: 'mock-cursor',
      links: {
        download: [
          'http://example.com'
        ]
      }
    }
    const fetchCmrLinksMock = jest.spyOn(fetchCmrLinks, 'fetchCmrLinks').mockImplementation(() => expectedResponse)

    dbTracker.on('query', (query) => {
      query.response([{
        access_method: {
          type: 'download',
          isValid: true
        },
        collection_id: 'C1214470488-ASF',
        granule_params: {
          exclude: {},
          options: {},
          page_num: 1,
          temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
          page_size: 20,
          concept_id: [],
          echo_collection_id: 'C1214470488-ASF',
          two_d_coordinate_system: {}
        },
        collection_metadata: {
          mock: 'metadata'
        },
        access_token: 'mock-access-token'
      }])
    })

    const event = {
      queryStringParameters: {
        id: '1234567',
        linkTypes: 'data,s3'
      }
    }

    const response = await retrieveGranuleLinks(event, {})

    expect(response).toEqual(expect.objectContaining({
      body: JSON.stringify(expectedResponse),
      statusCode: 200
    }))

    expect(fetchCmrLinksMock).toHaveBeenCalledTimes(1)
    expect(fetchCmrLinksMock).toHaveBeenCalledWith({
      collectionId: 'C1214470488-ASF',
      cursor: undefined,
      earthdataEnvironment: 'prod',
      granuleParams: {
        concept_id: [],
        echo_collection_id: 'C1214470488-ASF',
        exclude: {},
        options: {},
        page_num: 1,
        page_size: 20,
        temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
        two_d_coordinate_system: {}
      },
      linkTypes: 'data,s3',
      requestId: 'mock-request-id',
      token: 'mock-access-token'
    })
  })

  test('calls fetchOpenSearchLinks for opensearch granules', async () => {
    const expectedResponse = {
      links: {
        download: [
          'http://example.com'
        ]
      }
    }
    const fetchOpenSearchLinksMock = jest.spyOn(fetchOpenSearchLinks, 'fetchOpenSearchLinks').mockImplementation(() => expectedResponse)

    dbTracker.on('query', (query) => {
      query.response([{
        access_method: {
          type: 'download',
          isValid: true
        },
        collection_id: 'C1214470488-ASF',
        granule_params: {
          exclude: {},
          options: {},
          page_num: 1,
          temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
          page_size: 20,
          concept_id: [],
          echo_collection_id: 'C1214470488-ASF',
          two_d_coordinate_system: {}
        },
        collection_metadata: {
          isOpenSearch: true,
          mock: 'metadata'
        },
        access_token: 'mock-access-token'
      }])
    })

    const event = {
      queryStringParameters: {
        id: '1234567',
        linkTypes: 'data,s3'
      }
    }

    const response = await retrieveGranuleLinks(event, {})

    expect(response).toEqual(expect.objectContaining({
      body: JSON.stringify(expectedResponse),
      statusCode: 200
    }))

    expect(fetchOpenSearchLinksMock).toHaveBeenCalledTimes(1)
    expect(fetchOpenSearchLinksMock).toHaveBeenCalledWith({
      collectionId: 'C1214470488-ASF',
      collectionMetadata: {
        isOpenSearch: true,
        mock: 'metadata'
      },
      granuleParams: {
        concept_id: [],
        echo_collection_id: 'C1214470488-ASF',
        exclude: {},
        options: {},
        page_num: 1,
        page_size: 20,
        temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
        two_d_coordinate_system: {}
      },
      pageNum: 1
    })
  })

  test('calls fetchOpendapLinks for opendap granules', async () => {
    const expectedResponse = {
      links: {
        download: [
          'http://example.com'
        ]
      }
    }
    const fetchOpendapLinksMock = jest.spyOn(fetchOpendapLinks, 'fetchOpendapLinks').mockImplementation(() => expectedResponse.links)

    dbTracker.on('query', (query) => {
      query.response([{
        access_method: {
          type: 'OPeNDAP',
          isValid: true
        },
        collection_id: 'C1214470488-ASF',
        granule_params: {
          exclude: {},
          options: {},
          page_num: 1,
          temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
          page_size: 20,
          concept_id: [],
          echo_collection_id: 'C1214470488-ASF',
          two_d_coordinate_system: {}
        },
        collection_metadata: {
          mock: 'metadata'
        },
        access_token: 'mock-access-token'
      }])
    })

    const event = {
      queryStringParameters: {
        id: '1234567',
        linkTypes: 'data,s3'
      }
    }

    const response = await retrieveGranuleLinks(event, {})

    expect(response).toEqual(expect.objectContaining({
      body: JSON.stringify(expectedResponse),
      statusCode: 200
    }))

    expect(fetchOpendapLinksMock).toHaveBeenCalledTimes(1)
    expect(fetchOpendapLinksMock).toHaveBeenCalledWith({
      accessMethod: {
        isValid: true,
        type: 'OPeNDAP'
      },
      collectionId: 'C1214470488-ASF',
      earthdataEnvironment: 'prod',
      event: {
        queryStringParameters: {
          id: '1234567',
          linkTypes: 'data,s3'
        }
      },
      granuleParams: {
        concept_id: [],
        echo_collection_id: 'C1214470488-ASF',
        exclude: {},
        options: {},
        page_num: 1,
        page_size: 20,
        temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
        two_d_coordinate_system: {}
      },
      requestId: 'mock-request-id',
      pageNum: 1
    })
  })

  test('returns links from order_information for harmony orders', async () => {
    const expectedResponse = {
      done: true,
      links: [
        'http://example.com/file1',
        'http://example.com/file2'
      ]
    }

    dbTracker.on('query', (query) => {
      query.response([{
        access_method: {
          type: 'Harmony',
          isValid: true
        },
        collection_id: 'C1214470488-ASF',
        granule_params: {
          exclude: {},
          options: {},
          page_num: 1,
          temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
          page_size: 20,
          concept_id: [],
          echo_collection_id: 'C1214470488-ASF',
          two_d_coordinate_system: {}
        },
        collection_metadata: {
          mock: 'metadata'
        },
        access_token: 'mock-access-token',
        order_information: {
          links: [
            {
              rel: 'data',
              bbox: [-179.2, -55, 170.7, 81],
              href: 'http://example.com/file1',
              type: 'application/x-netcdf4',
              title: 'acos_LtCO2_200608_v210210_B9213A_201026001634s_subsetted.nc4',
              temporal: {
                end: '2020-06-09T00:00:00.000Z',
                start: '2020-06-08T00:00:00.000Z'
              }
            },
            {
              rel: 'data',
              bbox: [-179.2, -55, 170.7, 81],
              href: 'http://example.com/file2',
              type: 'application/x-netcdf4',
              title: 'acos_LtCO2_200608_v210210_B9213A_201026001634s_subsetted.nc4',
              temporal: {
                end: '2020-06-09T00:00:00.000Z',
                start: '2020-06-08T00:00:00.000Z'
              }
            },
            {
              rel: 'self',
              href: 'https://harmony.earthdata.nasa.gov/jobs/f2bf037d-25d3-473d-b2cd-7d6b4c62298f?page=1&limit=2000',
              type: 'application/json',
              title: 'The current page'
            }
          ]
        }
      }])
    })

    const event = {
      queryStringParameters: {
        id: '1234567',
        flattenLinks: true,
        linkTypes: 'data,s3'
      }
    }

    const response = await retrieveGranuleLinks(event, {})

    expect(response).toEqual(expect.objectContaining({
      body: JSON.stringify(expectedResponse),
      statusCode: 200
    }))
  })

  test('returns an error', async () => {
    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      queryStringParameters: {
        id: '1234567',
        flattenLinks: true,
        linkTypes: 'data,s3'
      }
    }

    const response = await retrieveGranuleLinks(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('select')

    expect(response.statusCode).toEqual(500)
  })
})
