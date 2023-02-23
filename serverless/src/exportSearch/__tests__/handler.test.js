import AWS from 'aws-sdk'
import nock from 'nock'
import { newDb } from "pg-mem"

import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getDbConnection from '../../util/database/getDbConnection'
import deleteBucket from '../../util/aws/deleteBucket'

import exportSearch from '../handler'

const OLD_ENV = process.env

const MOCK_REGION = 'moon'
const S3_TEST_PORT = 5000
const S3_TEST_HOST = `0.0.0.0:${S3_TEST_PORT}`
const S3_TEST_LOCALHOST = `localhost:${S3_TEST_PORT}`
const S3_TEST_BUCKET_NAME = 'S3_TEST_BUCKET_NAME'
const S3_TEST_ENDPOINT = `http://${S3_TEST_HOST}`
const MOCK_REQUEST_ID = 'MOCK_REQUEST_ID'
const MOCK_USER_ID = 1234

// need to configure here because the aws-sdk expects it
// without it, the handler will throw an error
AWS.config.update({
  accessKeyId: Math.random().toString(), // this will be ignored
  secretAccessKey: Math.random().toString(), // this will be ignored
  region: MOCK_REGION
})

const s3 = new AWS.S3({ endpoint: S3_TEST_ENDPOINT })

let mockDb, mockDbConnection

beforeAll(async () => {
  // explicitly allow network connections to local mock S3 server
  nock.enableNetConnect(host => host === S3_TEST_HOST || host === S3_TEST_LOCALHOST)

  await s3.createBucket({
    Bucket: S3_TEST_BUCKET_NAME,
    CreateBucketConfiguration: {
      LocationConstraint: MOCK_REGION
    }
  }).promise();

  // create test database
  mockDb = newDb()

  // create exports table
  mockDb.public.none(`create table exports (
    user_id integer,
    key varchar(1000),
    state varchar(1000),
    filename varchar(1000),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_at timestamp NOT NULL DEFAULT NOW()
  )`)

  // create mock database connection
  // it's asynchronous and getConnection is synchronous,
  // so we have to intialize it outside the mock implementation call
  mockDbConnection = await mockDb.adapters.createKnex()
})

afterAll(async () => {
  await deleteBucket(s3, S3_TEST_BUCKET_NAME)

  // re-disable all network connections, including those to localhost and 0.0.0.0
  nock.disableNetConnect()
})

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => mockDbConnection)

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  // just in case, for safety
  jest.clearAllMocks()

  // clear in-memory database table
  mockDb.public.none('DELETE FROM exports')
})

describe('exportSearch', () => {
  test('returns csv response correctly', async () => {
    process.env.searchExportS3Endpoint = S3_TEST_ENDPOINT
    process.env.searchExportBucket = S3_TEST_BUCKET_NAME

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
            cursorpath: 'collections.cursor',
            format: 'csv',
            itempath: 'collections.items',
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

    // seed database
    await mockDbConnection('exports').insert({
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename: 'search_results_export_66241fe6c7.csv',
      key,
      state: 'REQUESTED',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    })

    await exportSearch(event, {})

    const obj = await s3.getObject({ Bucket: S3_TEST_BUCKET_NAME, Key: key }).promise()
    expect(obj.ContentType).toEqual('text/csv');
    expect(obj.Body.toString()).toEqual('Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n,,,Test collection,,platform,,\r\n,,,Test collection 1,,platform,,\r\n')

    // check if the correct information was saved to the database
    const databaseTableRows = await mockDbConnection('exports')
    expect(databaseTableRows).toEqual([{
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename: 'search_results_export_66241fe6c7.csv',
      key,
      state: 'DONE',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    }])
  })

  test('returns json response correctly', async () => {
    process.env.searchExportS3Endpoint = S3_TEST_ENDPOINT
    process.env.searchExportBucket = S3_TEST_BUCKET_NAME

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
            cursorpath: 'collections.cursor',
            format: 'json',
            itempath: 'collections.items',
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

    // seed database
    await mockDbConnection('exports').insert({
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename,
      key,
      state: 'REQUESTED',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    })

    await exportSearch(event, {})

    const obj = await s3.getObject({ Bucket: S3_TEST_BUCKET_NAME, Key: key }).promise()
    expect(obj.ContentType).toEqual('application/json');
    expect(JSON.parse(obj.Body.toString())).toEqual([{ "conceptId": "C100000-EDSC", "title": "Test collection", "platforms": [{ "shortName": "platform" }] }, { "conceptId": "C100001-EDSC", "title": "Test collection 1", "platforms": [{ "shortName": "platform" }] }])

    const databaseTableRows = await mockDbConnection('exports')
    expect(databaseTableRows).toEqual([{
      filename,
      key,
      state: 'DONE',
      user_id: MOCK_USER_ID,
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      created_at: new Date('1988-09-03T10:00:00.000Z')
    }])
  })
})
