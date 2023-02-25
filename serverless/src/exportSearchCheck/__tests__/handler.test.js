import axios from 'axios'
import AWS from 'aws-sdk'
import nock from 'nock'
import { newDb } from "pg-mem"

import * as getDbConnection from '../../util/database/getDbConnection'
import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import clearBucket from '../../util/aws/clearBucket'
import deleteBucket from '../../util/aws/deleteBucket'


import exportSearchCheck from '../handler'

const OLD_ENV = process.env

const MOCK_REGION = 'moon'
const S3_TEST_PORT = 5000
const S3_TEST_HOST = `0.0.0.0:${S3_TEST_PORT}`
const S3_TEST_BUCKET_NAME = 'test-export-search-check-bucket'
const S3_TEST_ENDPOINT = `http://${S3_TEST_HOST}`

const MOCK_EXPORT_REQUEST_KEY = '123456789abcdefg'
const MOCK_FILENAME_CSV = 'search_results_export_123456789.csv'
const MOCK_FILENAME_JSON = 'search_results_export_123456789.json'
const MOCK_REQUEST_ID = 'd1b9b99c-c001-4502-bf82-5efaccf8c542'

const CONTENT_TYPE_CSV = 'text/csv'
const CONTENT_TYPE_JSON = 'application/json'

// need to configure here because the aws-sdk expects it
// without it, the handler will throw an error
AWS.config.update({
  accessKeyId: Math.random().toString(), // this will be ignored
  secretAccessKey: Math.random().toString(), // this will be ignored
  region: MOCK_REGION
})

const s3 = new AWS.S3({
  endpoint: S3_TEST_ENDPOINT,
  s3ForcePathStyle: true
})

let mockDb, mockDbConnection

beforeAll(async () => {
  await s3.createBucket({
    Bucket: S3_TEST_BUCKET_NAME,
    CreateBucketConfiguration: {
      LocationConstraint: MOCK_REGION
    }
  }).promise()

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
})

beforeEach(() => {
  nock.cleanAll() // remove any interceptors created by other files

  process.env.searchExportBucket = S3_TEST_BUCKET_NAME
  process.env.searchExportS3Endpoint = S3_TEST_ENDPOINT

  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => mockDbConnection)
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(async () => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  jest.clearAllMocks()

  await clearBucket(s3, S3_TEST_BUCKET_NAME)

  // clear in-memory database table
  mockDb.public.none('DELETE FROM exports')
})

describe('exportSearchCheck', () => {
  test('returns requested response correctly', async () => {
    const MOCK_USER_ID = 1234
    const MOCK_EXPORT_REQUEST_KEY = '123k476f76f5ewr32'

    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    // add info to database
    await mockDbConnection('exports').insert({
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename: MOCK_FILENAME_CSV,
      key: MOCK_EXPORT_REQUEST_KEY,
      state: 'REQUESTED',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    })

    const event = {
      body: JSON.stringify({
        requestId: MOCK_REQUEST_ID,
        data: {
          key: MOCK_EXPORT_REQUEST_KEY
        }
      })
    }

    const result = await exportSearchCheck(event, {})

    expect(JSON.parse(result.body)).toEqual({ state: 'REQUESTED' })
  })

  test('returns processing response correctly', async () => {
    const MOCK_USER_ID = 5678

    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    // add info to database
    await mockDbConnection('exports').insert({
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename: MOCK_FILENAME_CSV,
      key: MOCK_EXPORT_REQUEST_KEY,
      state: 'PROCESSING',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    })

    const event = {
      body: JSON.stringify({
        requestId: MOCK_REQUEST_ID,
        data: {
          key: MOCK_EXPORT_REQUEST_KEY
        }
      })
    }

    const result = await exportSearchCheck(event, {})

    expect(JSON.parse(result.body)).toEqual({ state: 'PROCESSING' })
  })

  test('returns finished json response correctly', async () => {
    const MOCK_USER_ID = 23146795
    const MOCK_EXPORT_REQUEST_KEY = 'i76DFTVY71b26t'

    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    // add info to database
    await mockDbConnection('exports').insert({
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename: MOCK_FILENAME_JSON,
      key: MOCK_EXPORT_REQUEST_KEY,
      state: 'DONE',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    })

    const MOCK_JSON = [{ "conceptId": "C100000-EDSC", "title": "Test collection", "platforms": [{ "shortName": "platform" }] }, { "conceptId": "C100001-EDSC", "title": "Test collection 1", "platforms": [{ "shortName": "platform" }] }]

    const contentDisposition = `attachment; filename="${MOCK_FILENAME_JSON}"`

    // add file to mock bucket
    await s3.upload({
      Bucket: S3_TEST_BUCKET_NAME,
      Key: MOCK_EXPORT_REQUEST_KEY,
      Body: JSON.stringify(MOCK_JSON),
      ACL: 'authenticated-read',
      ContentDisposition: contentDisposition,
      ContentType: CONTENT_TYPE_JSON,
    }).promise()

    const event = {
      body: JSON.stringify({
        requestId: MOCK_REQUEST_ID,
        data: {
          key: MOCK_EXPORT_REQUEST_KEY
        }
      })
    }

    const result = await exportSearchCheck(event, {})

    const { state, url } = JSON.parse(result.body)
    expect(state).toEqual('DONE')

    const response = await axios.get(url)
    expect(response.data).toEqual(MOCK_JSON)
    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toEqual(CONTENT_TYPE_JSON)
    expect(response.headers['content-disposition']).toEqual(contentDisposition)
  })

  test('returns finished csv response correctly', async () => {
    const MOCK_USER_ID = 91011

    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    // add info to database
    await mockDbConnection('exports').insert({
      created_at: new Date('1988-09-03T10:00:00.000Z'),
      filename: MOCK_FILENAME_CSV,
      key: MOCK_EXPORT_REQUEST_KEY,
      state: 'DONE',
      updated_at: new Date('1988-09-03T10:00:00.000Z'),
      user_id: MOCK_USER_ID
    })

    const MOCK_CSV = 'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n,,,Test collection,,platform,,\r\n,,,Test collection 1,,platform,,\r\n'

    const contentDisposition = `attachment; filename="${MOCK_FILENAME_CSV}"`

    // add file to mock bucket
    await s3.upload({
      Bucket: S3_TEST_BUCKET_NAME,
      Key: MOCK_EXPORT_REQUEST_KEY,
      Body: MOCK_CSV,
      ACL: 'authenticated-read',
      ContentDisposition: contentDisposition,
      ContentType: CONTENT_TYPE_CSV,
    }).promise()

    const event = {
      body: JSON.stringify({
        requestId: MOCK_REQUEST_ID,
        data: {
          key: MOCK_EXPORT_REQUEST_KEY
        }
      })
    }

    const result = await exportSearchCheck(event, {})

    const { state, url } = JSON.parse(result.body)
    expect(state).toEqual('DONE')

    const response = await axios.get(url, {
      transformResponse: data => data, // ensure treated as plain text
    })
    expect(response.data).toEqual(MOCK_CSV)
    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toEqual(CONTENT_TYPE_CSV)
    expect(response.headers['content-disposition']).toEqual(contentDisposition)
  })
})
