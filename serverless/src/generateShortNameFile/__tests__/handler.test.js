import nock from 'nock'
import { mockClient } from 'aws-sdk-client-mock'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import generateShortNameFile from '../handler'

const s3ClientMock = mockClient(S3Client)

const OLD_ENV = process.env

beforeEach(() => {
  s3ClientMock.reset()

  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  process.env.GRAPHQL_HOST = 'https://graphql.example.com'
  process.env.SHORT_NAME_FILE_BUCKET_NAME = 'test-bucket'
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('generateShortNameFile', () => {
  test('pages through all collections and writes the results to S3', async () => {
    nock(/graphql\.example\.com/)
      .post('/api', (body) => body.variables.params.cursor === null
        && body.variables.params.includeNonOperational === true)
      .reply(200, {
        data: {
          collections: {
            count: 3,
            cursor: 'cursor-1',
            items: [
              {
                shortName: 'SHORT_1',
                version: '1'
              },
              {
                shortName: 'SHORT_2',
                version: '2'
              }
            ]
          }
        }
      })

    nock(/graphql\.example\.com/)
      .post('/api', (body) => body.variables.params.cursor === 'cursor-1')
      .reply(200, {
        data: {
          collections: {
            count: 3,
            cursor: 'cursor-2',
            items: [
              {
                shortName: 'SHORT_3',
                version: '3'
              }
            ]
          }
        }
      })

    nock(/graphql\.example\.com/)
      .post('/api', (body) => body.variables.params.cursor === 'cursor-2')
      .reply(200, {
        data: {
          collections: {
            count: 3,
            cursor: 'cursor-3',
            items: []
          }
        }
      })

    s3ClientMock.on(PutObjectCommand).resolves({})

    const result = await generateShortNameFile({}, {})

    expect(result.statusCode).toEqual(200)
    expect(JSON.parse(result.body)).toEqual({
      bucket: 'test-bucket',
      key: 'shortNames.json',
      count: 3
    })

    const putCalls = s3ClientMock.commandCalls(PutObjectCommand)
    expect(putCalls).toHaveLength(1)
    expect(putCalls[0].args[0].input).toEqual({
      Bucket: 'test-bucket',
      Key: 'shortNames.json',
      ContentType: 'application/json',
      Body: JSON.stringify([
        {
          shortName: 'SHORT_1',
          version: '1'
        },
        {
          shortName: 'SHORT_2',
          version: '2'
        },
        {
          shortName: 'SHORT_3',
          version: '3'
        }
      ])
    })
  })

  test('stops after maxRequests requests when provided', async () => {
    const scope = nock(/graphql\.example\.com/)
      .post('/api', (body) => body.variables.params.cursor === null)
      .reply(200, {
        data: {
          collections: {
            count: 3,
            cursor: 'cursor-1',
            items: [
              {
                shortName: 'SHORT_1',
                version: '1'
              }
            ]
          }
        }
      })

    s3ClientMock.on(PutObjectCommand).resolves({})

    const result = await generateShortNameFile({ maxRequests: 1 }, {})

    expect(scope.isDone()).toBe(true)
    expect(nock.pendingMocks()).toHaveLength(0)

    expect(result.statusCode).toEqual(200)
    expect(JSON.parse(result.body).count).toEqual(1)

    const putCalls = s3ClientMock.commandCalls(PutObjectCommand)
    expect(putCalls).toHaveLength(1)
    expect(putCalls[0].args[0].input.Body).toEqual(JSON.stringify([
      {
        shortName: 'SHORT_1',
        version: '1'
      }
    ]))
  })

  test('returns an error when graphql returns errors', async () => {
    nock(/graphql\.example\.com/)
      .post('/api')
      .reply(200, {
        errors: [{ message: 'Something went wrong' }]
      })

    const result = await generateShortNameFile({}, {})

    expect(result.statusCode).toEqual(500)
    expect(s3ClientMock.commandCalls(PutObjectCommand)).toHaveLength(0)
  })
})
