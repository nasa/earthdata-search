import asyncRedis from 'async-redis'

import { getCacheConnection } from '../getCacheConnection'

const createClientMock = vi.spyOn(asyncRedis, 'createClient').mockReturnValue('mocked-redis-client')

describe('getCacheConnection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.CACHE_HOST = 'example.com'
    process.env.CACHE_PORT = '1234'
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when cache client is already set', () => {
    describe('when running in a live environment', () => {
      test('returns the existing connection', async () => {
        const connection = getCacheConnection()

        expect(connection).toEqual('mocked-redis-client')

        expect(createClientMock).toHaveBeenCalledTimes(1)
        expect(createClientMock).toHaveBeenCalledWith({
          host: 'example.com',
          port: '1234',
          return_buffers: true
        })

        // Reset the mock so that we can determine whether or not the mock was called
        createClientMock.mockReset()

        const connection2 = getCacheConnection()

        expect(connection2).toEqual('mocked-redis-client')

        expect(createClientMock).toHaveBeenCalledTimes(0)
      })
    })
  })
})
