import AWS from 'aws-sdk'

import doesBucketExist from '../doesBucketExist'

const MOCK_BUCKET_NAME = 'mock-bucket'

let s3

jest.mock('aws-sdk', () => {
  const instance = {
    listBuckets: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({ Buckets: [{ Name: MOCK_BUCKET_NAME }] })
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

describe('doesBucketExist', () => {
  test('returns true when a bucket exists', async () => {
    const exists = await doesBucketExist(s3, MOCK_BUCKET_NAME)
    expect(exists).toEqual(true)
  })
  test('returns false when a bucket does not exist', async () => {
    const exists = await doesBucketExist(s3, 'missing-bucket')
    expect(exists).toEqual(false)
  })
})
