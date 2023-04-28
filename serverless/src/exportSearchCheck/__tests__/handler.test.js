import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'

import exportSearchCheck from '../handler'

const OLD_ENV = process.env

const MOCK_EXPORT_REQUEST_KEY = 'MOCK_EXPORT_REQUEST_KEY'
const MOCK_USER_ID = 1234
const MOCK_SIGNED_URL = 'MOCK_SIGNED_URL'

let dbTracker

jest.mock('aws-sdk', () => {
  const instance = {
    headObject: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue(true)
    })),
    // jest.fn().mockResolvedValue(MOCK_SIGNED_URL) returns Promise { undefined }
    getSignedUrlPromise: jest.fn(() => Promise.resolve(MOCK_SIGNED_URL))
  }
  return {
    S3: jest.fn(() => instance)
  }
})

const MOCK_BUCKET_NAME = 'test-export-search-check-bucket'
const MOCK_FILENAME_CSV = 'search_results_export_123456789.csv'
const MOCK_FILENAME_JSON = 'search_results_export_123456789.json'
const MOCK_REQUEST_ID = 'd1b9b99c-c001-4502-bf82-5efaccf8c542'

beforeEach(() => {
  jest.clearAllMocks()

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
  jest.clearAllMocks()

  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  // reset hacks on built-ins
  MockDate.reset()

  dbTracker.uninstall()
})

afterAll(() => {
  jest.clearAllMocks()
})

describe('exportSearchCheck', () => {
  test('returns requested response correctly', async () => {
    const MOCK_USER_ID = 1234
    const MOCK_EXPORT_REQUEST_KEY = '123k476f76f5ewr32'

    dbTracker.on('query', (query) => {
      query.response([{
        created_at: new Date('1988-09-03T10:00:00.000Z'),
        filename: MOCK_FILENAME_CSV,
        key: MOCK_EXPORT_REQUEST_KEY,
        state: 'REQUESTED',
        updated_at: new Date('1988-09-03T10:00:00.000Z'),
        user_id: MOCK_USER_ID
      }])
    })

    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

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
    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    dbTracker.on('query', (query) => {
      query.response([{
        created_at: new Date('1988-09-03T10:00:00.000Z'),
        filename: MOCK_FILENAME_CSV,
        key: MOCK_EXPORT_REQUEST_KEY,
        state: 'PROCESSING',
        updated_at: new Date('1988-09-03T10:00:00.000Z'),
        user_id: MOCK_USER_ID
      }])
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
    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    dbTracker.on('query', (query) => {
      query.response([{
        created_at: new Date('1988-09-03T10:00:00.000Z'),
        filename: MOCK_FILENAME_JSON,
        key: MOCK_EXPORT_REQUEST_KEY,
        state: 'DONE',
        updated_at: new Date('1988-09-03T10:00:00.000Z'),
        user_id: MOCK_USER_ID
      }])
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

    const { state, url } = JSON.parse(result.body)
    expect(state).toEqual('DONE')
    expect(url).toEqual(MOCK_SIGNED_URL)
  })

  test('returns finished csv response correctly', async () => {
    jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ id: MOCK_USER_ID }))

    dbTracker.on('query', (query) => {
      query.response([{
        created_at: new Date('1988-09-03T10:00:00.000Z'),
        filename: MOCK_FILENAME_CSV,
        key: MOCK_EXPORT_REQUEST_KEY,
        state: 'DONE',
        updated_at: new Date('1988-09-03T10:00:00.000Z'),
        user_id: MOCK_USER_ID
      }])
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

    const { state, url } = JSON.parse(result.body)
    expect(state).toEqual('DONE')
    expect(url).toEqual(MOCK_SIGNED_URL)
  })
})
