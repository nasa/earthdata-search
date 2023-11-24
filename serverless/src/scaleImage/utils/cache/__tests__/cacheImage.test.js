import redis from 'redis-mock'

import { cacheImage } from '../cacheImage'

import * as getCacheConnection from '../getCacheConnection'

const OLD_ENV = process.env

beforeEach(() => {
  process.env = { ...OLD_ENV }

  delete process.env.NODE_ENV
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('cacheImage', () => {
  beforeEach(() => {
    const client = redis.createClient()

    jest.spyOn(getCacheConnection, 'getCacheConnection').mockImplementation(() => client)
  })

  describe('when an empty value is provided', () => {
    test('does not attempt to cache', () => {
      const setMock = jest.spyOn(redis.RedisClient.prototype, 'set').mockImplementation(() => jest.fn())

      cacheImage('empty-200-200', null)

      expect(setMock).toBeCalledTimes(0)
    })
  })

  describe('when a valid value is provided', () => {
    test('successfully caches the image', async () => {
      process.env.cacheKeyExpireSeconds = 84000

      const setMock = jest.spyOn(redis.RedisClient.prototype, 'set').mockImplementation(() => jest.fn())

      await cacheImage('empty-200-200', 'test-image-contents')

      expect(setMock).toBeCalledTimes(1)
      expect(setMock).toBeCalledWith('empty-200-200', 'test-image-contents', 'EX', 84000)
    })

    test('successfully caches the image', async () => {
      process.env.cacheKeyExpireSeconds = 84000

      jest.spyOn(redis.RedisClient.prototype, 'set').mockImplementation(() => {
        throw new Error('Exception calling `set`')
      })

      const cachedImage = cacheImage('empty-200-200', 'test-image-contents')

      await expect(cachedImage).rejects.toThrow()
    })
  })
})
