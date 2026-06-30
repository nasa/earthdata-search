import scaleImage from '../handler'

import * as buildResponse from '../utils/buildResponse'
import * as downloadImageFromSource from '../utils/downloadImageFromSource'

import * as cacheItem from '../../util/cache/cacheItem'
import * as generateCacheKey from '../../util/cache/generateCacheKey'
import * as getItemFromCache from '../../util/cache/getItemFromCache'

import * as getApplicationConfig from '../../../../sharedUtils/config'

import * as buildUnavailableImageBuffer from '../utils/sharp/buildUnavailableImageBuffer'
import * as resizeImage from '../utils/sharp/resizeImage'

beforeEach(() => {
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    thumbnailSize: {
      height: 85,
      width: 85
    }
  }))
})

describe('scaleImage', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
    process.env.USE_CACHE = 'true'
    process.env.IMAGE_CACHE_EXPIRE_SECONDS = '84000'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when the requested image is in the cache', () => {
    test('returns the cached image', async () => {
      const generateCacheKeyMock = vi.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementationOnce(() => 'http://test.com/test.jpg-h-w')

      const cachedResponseBuffer = Buffer.from('test-image-contents')

      const getItemFromCacheMock = vi.spyOn(getItemFromCache, 'getItemFromCache')
        .mockImplementationOnce(() => cachedResponseBuffer)

      const buildResponseMock = vi.spyOn(buildResponse, 'buildResponse')

      const event = {
        queryStringParameters: {
          imageSrc: 'http://test.com/test.jpg'
        }
      }

      await scaleImage(event, {})

      expect(generateCacheKeyMock).toHaveBeenCalledWith('http://test.com/test.jpg', {
        height: 85,
        width: 85
      })

      expect(getItemFromCacheMock).toHaveBeenCalledWith('http://test.com/test.jpg-h-w')
      expect(buildResponseMock).toHaveBeenCalledWith(cachedResponseBuffer)
    })
  })

  describe('when the original image is in the cache but the requested size is not', () => {
    test('returns the resized image without downloading the original', async () => {
      const resizedCacheKey = 'http://test.com/test.jpg-100-100'
      const originalCacheKey = 'http://test.com/test.jpg-h-w'
      const generateCacheKeyMock = vi.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementationOnce(() => resizedCacheKey)
        .mockImplementationOnce(() => originalCacheKey)

      const cachedResponseBuffer = Buffer.from('test-image-contents')

      const getItemFromCacheMock = vi.spyOn(getItemFromCache, 'getItemFromCache')
        .mockImplementationOnce(() => null)
        .mockImplementationOnce(() => cachedResponseBuffer)

      const buildResponseMock = vi.spyOn(buildResponse, 'buildResponse')

      const resizedBuffer = Buffer.from('resized-image-contents')

      const resizeImageMock = vi.spyOn(resizeImage, 'resizeImage')
        .mockImplementationOnce(() => resizedBuffer)

      const cacheItemMock = vi.spyOn(cacheItem, 'cacheItem')
        .mockImplementationOnce(() => resizedBuffer)

      const event = {
        queryStringParameters: {
          imageSrc: 'http://test.com/test.jpg',
          h: '100',
          w: '100'
        }
      }

      await scaleImage(event, {})
      expect(generateCacheKeyMock).toHaveBeenCalledTimes(2)
      expect(generateCacheKeyMock.mock.calls[0]).toEqual(['http://test.com/test.jpg', {
        height: 100,
        width: 100
      }])

      expect(generateCacheKeyMock.mock.calls[1]).toEqual(['http://test.com/test.jpg'])

      expect(getItemFromCacheMock).toHaveBeenCalledTimes(2)
      expect(getItemFromCacheMock.mock.calls[0]).toEqual([resizedCacheKey])
      expect(getItemFromCacheMock.mock.calls[1]).toEqual([originalCacheKey])

      expect(resizeImageMock).toHaveBeenCalledWith(cachedResponseBuffer, 100, 100)
      expect(cacheItemMock).toHaveBeenCalledWith('http://test.com/test.jpg-100-100', resizedBuffer, '84000')
      expect(buildResponseMock).toHaveBeenCalledWith(resizedBuffer)
    })
  })

  describe('when the requested image is not in the cache', () => {
    test('returns the resized image and downloads the original', async () => {
      const resizedCacheKey = 'http://test.com/test.jpg-100-100'
      const originalCacheKey = 'http://test.com/test.jpg-h-w'
      const generateCacheKeyMock = vi.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementationOnce(() => resizedCacheKey)
        .mockImplementationOnce(() => originalCacheKey)

      const getItemFromCacheMock = vi.spyOn(getItemFromCache, 'getItemFromCache')
        .mockImplementationOnce(() => null)
        .mockImplementationOnce(() => null)

      const responseBuffer = Buffer.from('test-image-contents')

      const downloadImageFromSourceMock = vi.spyOn(downloadImageFromSource, 'downloadImageFromSource')
        .mockImplementationOnce(() => responseBuffer)

      const buildResponseMock = vi.spyOn(buildResponse, 'buildResponse')

      const resizedBuffer = Buffer.from('resized-image-contents')

      const resizeImageMock = vi.spyOn(resizeImage, 'resizeImage')
        .mockImplementationOnce(() => resizedBuffer)

      const cacheItemMock = vi.spyOn(cacheItem, 'cacheItem')
        .mockImplementationOnce(() => responseBuffer)
        .mockImplementationOnce(() => resizedBuffer)

      const event = {
        queryStringParameters: {
          imageSrc: 'http://test.com/test.jpg',
          h: '100',
          w: '100'
        }
      }

      await scaleImage(event, {})
      expect(generateCacheKeyMock).toHaveBeenCalledTimes(2)
      expect(generateCacheKeyMock.mock.calls[0]).toEqual(['http://test.com/test.jpg', {
        height: 100,
        width: 100
      }])

      expect(generateCacheKeyMock.mock.calls[1]).toEqual(['http://test.com/test.jpg'])

      expect(getItemFromCacheMock).toHaveBeenCalledTimes(2)
      expect(getItemFromCacheMock.mock.calls[0]).toEqual([resizedCacheKey])
      expect(getItemFromCacheMock.mock.calls[1]).toEqual([originalCacheKey])

      expect(downloadImageFromSourceMock).toHaveBeenCalledTimes(1)
      expect(downloadImageFromSourceMock.mock.calls[0]).toEqual(['http://test.com/test.jpg'])

      expect(resizeImageMock).toHaveBeenCalledWith(responseBuffer, 100, 100)
      expect(cacheItemMock.mock.calls[0]).toEqual(['http://test.com/test.jpg-h-w', responseBuffer, '84000'])
      expect(cacheItemMock.mock.calls[1]).toEqual(['http://test.com/test.jpg-100-100', resizedBuffer, '84000'])
      expect(buildResponseMock).toHaveBeenCalledWith(resizedBuffer)
    })
  })

  describe('when an error occurs', () => {
    test('when imageSrc is null', async () => {
      const responseBuffer = Buffer.from('test-image-contents')

      const buildUnavailableImageBufferMock = vi.spyOn(buildUnavailableImageBuffer, 'buildUnavailableImageBuffer')
        .mockImplementationOnce(() => responseBuffer)

      const buildResponseMock = vi.spyOn(buildResponse, 'buildResponse')

      const event = {}

      await scaleImage(event, {})

      expect(buildUnavailableImageBufferMock).toHaveBeenCalledWith(85, 85)
      expect(buildResponseMock).toHaveBeenCalledWith(responseBuffer, 200)
    })
  })
})
