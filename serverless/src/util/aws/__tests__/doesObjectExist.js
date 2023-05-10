import AWS from 'aws-sdk'

import doesObjectExist from '../doesObjectExist'

const MOCK_BUCKET_NAME = 'mock-bucket'
const MOCK_OBJECT_KEY = 'mock-key'

let s3

jest.mock('aws-sdk', () => {
  const instance = {
    headObject: jest.fn((params) => ({
      promise: jest.fn(() => new Promise((resolve, reject) => {
        if (params.Key === MOCK_OBJECT_KEY) {
          resolve({})
        } else {
          const err = Error('NotFound')
          err.code = 'NotFound'
          reject(err)
        }
      }))
    }))
  }
  return {
    S3: jest.fn(() => instance)
  }
})

beforeEach(() => {
  jest.clearAllMocks()

  s3 = new AWS.S3()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.clearAllMocks()
})

describe('doesObjectExist', () => {
  test('returns true when an object exists', async () => {
    const exists = await doesObjectExist(s3, MOCK_BUCKET_NAME, MOCK_OBJECT_KEY)
    expect(exists).toEqual(true)
  })
  test('returns false when an object does not exist', async () => {
    const exists = await doesObjectExist(s3, MOCK_BUCKET_NAME, 'missing-key')
    expect(exists).toEqual(false)
  })
})
