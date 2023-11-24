import redis from 'redis-mock'

import { getCacheConnection } from '../getCacheConnection'

describe('getCacheConnection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cacheHost = 'example.com'
    process.env.cachePort = '1234'
    // Todo this env var needs someWork
    process.env.IS_OFFLINE = false
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when cache client is already set', () => {
    describe('when running in a live environment', () => {
      test('returns the existing connection', async () => {
        const client = redis.createClient()

        const createClientMock = jest.spyOn(redis, 'createClient').mockImplementation(() => client)

        getCacheConnection()

        expect(createClientMock).toBeCalledTimes(1)
        expect(createClientMock).toBeCalledWith({
          host: 'example.com',
          port: '1234',
          return_buffers: true
        })

        // Reset the mock so that we can determine whether or not the mock was called
        createClientMock.mockReset()

        getCacheConnection()

        expect(createClientMock).toBeCalledTimes(0)
      })
    })
  })
})
