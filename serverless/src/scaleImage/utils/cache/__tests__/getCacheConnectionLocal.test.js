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
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when cache client is already set', () => {
    describe('when running locally', () => {
      test('uses locally defined values', async () => {
        process.env.NODE_ENV = 'development'

        const connection = getCacheConnection()

        expect(connection).toEqual('mocked-redis-client')

        expect(createClientMock).toHaveBeenCalledTimes(1)
        expect(createClientMock).toHaveBeenCalledWith({
          host: 'localhost',
          port: '6379',
          return_buffers: true
        })
      })
    })
  })
})
