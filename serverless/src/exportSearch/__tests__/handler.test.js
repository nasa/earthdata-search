import AWS from 'aws-sdk'
import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'
import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'

import exportSearch from '../handler'

const OLD_ENV = process.env

const MOCK_USER_ID = 1234

const MOCK_BUCKET_NAME = 'test-export-search-check-bucket'
const MOCK_REQUEST_ID = 'MOCK_REQUEST_ID'

let dbTracker
let s3

jest.mock('aws-sdk', () => {
  const instance = {
    listBuckets: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({ Buckets: [{ Name: MOCK_BUCKET_NAME }] })
    })),
    upload: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue(undefined)
    }))
  }
  return {
    S3: jest.fn(() => instance)
  }
})

beforeEach(async () => {
  jest.clearAllMocks()

  s3 = new AWS.S3()

  process.env.searchExportBucket = MOCK_BUCKET_NAME

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementation(() => {
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

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('1988-09-03T10:00:00.000Z')
})

afterEach(async () => {
  // just in case, for safety
  jest.clearAllMocks()

  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  // reset hacks on built-ins
  MockDate.reset()

  dbTracker.uninstall()
})

describe('exportSearch', () => {
  test('returns csv response correctly', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/graphql/)
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: [{
              conceptId: 'C100000-EDSC',
              title: 'Test collection',
              platforms: [{ shortName: 'platform' }]
            }, {
              conceptId: 'C100001-EDSC',
              title: 'Test collection 1',
              platforms: [{ shortName: 'platform' }]
            }]
          }
        }
      })
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: []
          }
        }
      })

    const key = 'mock-csv-hash-key-123456789'

    const event = {
      Records: [{
        body: JSON.stringify({
          params: {
            columns: [
              { name: 'Data Provider', path: 'provider' },
              { name: 'Short Name', path: 'shortName' },
              { name: 'Version', path: 'versionId' },
              { name: 'Entry Title', path: 'title' },
              { name: 'Processing Level', path: 'processingLevelId' },
              { name: 'Platform', path: 'platforms.shortName' },
              { name: 'Start Time', path: 'timeStart' },
              { name: 'End Time', path: 'timeEnd' }
            ],
            cursorPath: 'collections.cursor',
            format: 'csv',
            itemPath: 'collections.items',
            query: {},
            variables: {}
          },
          extra: {
            earthdataEnvironment: 'dev',
            filename: 'test-export-search-results-12345',
            key,
            requestId: MOCK_REQUEST_ID,
            userId: MOCK_USER_ID
          }
        })
      }]
    }

    dbTracker.on('query', (query) => {
      if (query.method === 'update') {
        query.response([])
      } else if (query.method === 'select') {
        query.response([{
          created_at: new Date('1988-09-03T10:00:00.000Z'),
          filename: 'search_results_export_66241fe6c7.csv',
          key,
          state: 'DONE',
          updated_at: new Date('1988-09-03T10:00:00.000Z'),
          user_id: MOCK_USER_ID
        }])
      }
    })

    await exportSearch(event, {})

    const { queries } = dbTracker.queries

    expect(queries.length).toEqual(3)
    expect(queries[0].sql).toEqual('select * from "exports" where "key" = $1')
    expect(queries[1].sql).toEqual('update "exports" set "state" = $1 where "key" = $2')
    expect(queries[2].sql).toEqual('update "exports" set "state" = $1 where "key" = $2')

    expect(s3.upload).toBeCalledTimes(1)
    expect(s3.upload.mock.calls[0][0]).toEqual({
      Bucket: 'test-export-search-check-bucket',
      Key: 'mock-csv-hash-key-123456789',
      Body: 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n'
        + ',,,Test collection,,platform,,\r\n'
        + ',,,Test collection 1,,platform,,\r\n',
      ACL: 'authenticated-read',
      ContentDisposition: 'attachment; filename="test-export-search-results-12345"',
      ContentType: 'text/csv',
      ContentMD5: 'tizuYZ3PKt/WbaHxgHywwQ=='
    })
  })

  test('returns json response correctly', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/graphql/)
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: [{
              conceptId: 'C100000-EDSC',
              title: 'Test collection',
              platforms: [{ shortName: 'platform' }]
            }, {
              conceptId: 'C100001-EDSC',
              title: 'Test collection 1',
              platforms: [{ shortName: 'platform' }]
            }]
          }
        }
      })
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: []
          }
        }
      })

    const key = 'mock-json-hash-key-123456789'
    const filename = 'search_results_export_66241fe6c7.json'

    const event = {
      Records: [{
        body: JSON.stringify({
          params: {
            columns: [
              { name: 'Data Provider', path: 'provider' },
              { name: 'Short Name', path: 'shortName' },
              { name: 'Version', path: 'versionId' },
              { name: 'Entry Title', path: 'title' },
              { name: 'Processing Level', path: 'processingLevelId' },
              { name: 'Platform', path: 'platforms.shortName' },
              { name: 'Start Time', path: 'timeStart' },
              { name: 'End Time', path: 'timeEnd' }
            ],
            cursorPath: 'collections.cursor',
            format: 'json',
            itemPath: 'collections.items',
            query: {},
            variables: {}
          },
          extra: {
            earthdataEnvironment: 'dev',
            filename,
            key,
            requestId: MOCK_REQUEST_ID,
            userId: MOCK_USER_ID
          }
        })
      }]
    }

    dbTracker.on('query', (query) => {
      if (query.method === 'update') {
        query.response([])
      } else if (query.method === 'select') {
        query.response([{
          created_at: new Date('1988-09-03T10:00:00.000Z'),
          filename,
          key,
          state: 'REQUESTED',
          updated_at: new Date('1988-09-03T10:00:00.000Z'),
          user_id: MOCK_USER_ID
        }])
      }
    })

    await exportSearch(event, {})

    const { queries } = dbTracker.queries

    expect(queries.length).toEqual(3)
    expect(queries[0].sql).toEqual('select * from "exports" where "key" = $1')
    expect(queries[1].sql).toEqual('update "exports" set "state" = $1 where "key" = $2')
    expect(queries[2].sql).toEqual('update "exports" set "state" = $1 where "key" = $2')

    expect(s3.upload).toBeCalledTimes(1)
    expect(s3.upload.mock.calls[0][0]).toEqual({
      Bucket: 'test-export-search-check-bucket',
      Key: 'mock-json-hash-key-123456789',
      Body: '[{"conceptId":"C100000-EDSC","title":"Test collection","platforms":[{"shortName":"platform"}]},{"conceptId":"C100001-EDSC","title":"Test collection 1","platforms":[{"shortName":"platform"}]}]',
      ACL: 'authenticated-read',
      ContentDisposition: 'attachment; filename="search_results_export_66241fe6c7.json"',
      ContentType: 'application/json',
      ContentMD5: '3mevw3sanbTQXexrTh6Y7g=='
    })
  })
})
