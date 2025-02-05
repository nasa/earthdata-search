import redis from 'redis-mock'

import { getCacheConnection } from '../getCacheConnection'

describe('getCacheConnection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.CACHE_HOST = 'example.com'
    process.env.CACHE_PORT = '1234'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when cache client is already set', () => {
    describe('when running locally', () => {
      test('uses locally defined values', async () => {
        process.env.NODE_ENV = 'development'

        const client = redis.createClient()

        const createClientMock = jest.spyOn(redis, 'createClient').mockImplementation(() => client)

        getCacheConnection()

        expect(createClientMock).toBeCalledTimes(1)
        expect(createClientMock).toBeCalledWith({
          host: 'localhost',
          port: '6379',
          return_buffers: true
        })

        createClientMock.mockReset()
      })
    })
  })
})
