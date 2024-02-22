import scaleImage from '../handler'

import * as buildResponse from '../utils/buildResponse'
import * as downloadImageFromSource from '../utils/downloadImageFromSource'

import * as cacheImage from '../utils/cache/cacheImage'
import * as generateCacheKey from '../utils/cache/generateCacheKey'
import * as getImageFromCache from '../utils/cache/getImageFromCache'

import * as getApplicationConfig from '../../../../sharedUtils/config'
import * as getImageUrlFromConcept from '../utils/cmr/getImageUrlFromConcept'

import * as buildUnavailableImageBuffer from '../utils/sharp/buildUnavailableImageBuffer'
import * as resizeImage from '../utils/sharp/resizeImage'

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
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
    process.env.useCache = 'true'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when the requested image is in the cache', () => {
    test('returns the cached image', async () => {
      const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementationOnce(() => 'C100000-EDSC-h-w')

      const cachedResponseBuffer = Buffer.from('test-image-contents')

      const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
        .mockImplementationOnce(() => cachedResponseBuffer)

      const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

      const event = {
        pathParameters: {
          concept_id: 'C100000-EDSC',
          concept_type: 'datasets'
        }
      }

      await scaleImage(event, {})

      expect(generateCacheKeyMock).toBeCalledWith('C100000-EDSC', 'datasets', undefined, {
        height: 85,
        width: 85
      })

      expect(getImageFromCacheMock).toBeCalledWith('C100000-EDSC-h-w')
      expect(buildResponseMock).toBeCalledWith(cachedResponseBuffer)
    })
  })

  describe('when the original image is in the cache but the requested size is not', () => {
    test('returns the resized image without downloading the original', async () => {
      const resizedCacheKey = 'C100000-EDSC-100-100'
      const originalCacheKey = 'C100000-EDSC-h-w'
      const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementationOnce(() => resizedCacheKey)
        .mockImplementationOnce(() => originalCacheKey)

      const cachedResponseBuffer = Buffer.from('test-image-contents')

      const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
        .mockImplementationOnce(() => null)
        .mockImplementationOnce(() => cachedResponseBuffer)

      const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

      const resizedBuffer = Buffer.from('resized-image-contents')

      const resizeImageMock = jest.spyOn(resizeImage, 'resizeImage')
        .mockImplementationOnce(() => resizedBuffer)

      const cacheImageMock = jest.spyOn(cacheImage, 'cacheImage')
        .mockImplementationOnce(() => resizedBuffer)

      const event = {
        pathParameters: {
          concept_id: 'C100000-EDSC',
          concept_type: 'datasets'
        },
        queryStringParameters: {
          h: '100',
          w: '100'
        }
      }

      await scaleImage(event, {})
      // Should the cache key be a number is that okay?
      expect(generateCacheKeyMock).toBeCalledTimes(2)
      expect(generateCacheKeyMock.mock.calls[0]).toEqual(['C100000-EDSC', 'datasets', undefined, {
        height: 100,
        width: 100
      }])

      expect(generateCacheKeyMock.mock.calls[1]).toEqual(['C100000-EDSC', 'datasets'])

      expect(getImageFromCacheMock).toBeCalledTimes(2)
      expect(getImageFromCacheMock.mock.calls[0]).toEqual([resizedCacheKey])
      expect(getImageFromCacheMock.mock.calls[1]).toEqual([originalCacheKey])

      expect(resizeImageMock).toBeCalledWith(cachedResponseBuffer, 100, 100)
      expect(cacheImageMock).toBeCalledWith('C100000-EDSC-100-100', resizedBuffer)
      expect(buildResponseMock).toBeCalledWith(resizedBuffer)
    })
  })

  describe('when the requested image is not in the cache', () => {
    describe('when a collection image is requested', () => {
      describe('when cascade_concepts is false', () => {
        describe('when the metadata does not contain a browse image url', () => {
          describe('when return_default is true', () => {
            test('returns the unavailable (default) image', async () => {
              const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
                .mockImplementationOnce(() => 'C100000-EDSC-h-w')
                .mockImplementationOnce(() => 'C100000-EDSC-h-w')

              const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
                .mockImplementationOnce(() => null)
                .mockImplementationOnce(() => null)

              const getImageUrlFromConceptMock = jest.spyOn(getImageUrlFromConcept, 'getImageUrlFromConcept')
                .mockImplementationOnce(() => null)

              const responseBuffer = Buffer.from('test-image-contents')

              const buildUnavailableImageBufferMock = jest.spyOn(buildUnavailableImageBuffer, 'buildUnavailableImageBuffer')
                .mockImplementationOnce(() => responseBuffer)

              const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

              const event = {
                pathParameters: {
                  concept_id: 'C100000-EDSC',
                  concept_type: 'datasets'
                },
                queryStringParameters: {
                  cascade_concepts: 'false'
                }
              }

              await scaleImage(event, {})

              expect(generateCacheKeyMock).toBeCalledWith('C100000-EDSC', 'datasets', undefined, {
                height: 85,
                width: 85
              })

              expect(getImageFromCacheMock).toBeCalledWith('C100000-EDSC-h-w')
              expect(getImageUrlFromConceptMock).toBeCalledWith('C100000-EDSC', 'datasets', 'false', undefined)
              expect(buildUnavailableImageBufferMock).toBeCalledWith(85, 85)
              expect(buildResponseMock).toBeCalledWith(responseBuffer, 200)
            })
          })

          describe('when return_default is false', () => {
            test('does not call buildUnavailableImageBuffer and returns an empty Buffer', async () => {
              const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
                .mockImplementationOnce(() => 'C100000-EDSC-h-w')
                .mockImplementationOnce(() => 'C100000-EDSC-h-w')

              const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
                .mockImplementationOnce(() => null)
                .mockImplementationOnce(() => null)

              const getImageUrlFromConceptMock = jest.spyOn(getImageUrlFromConcept, 'getImageUrlFromConcept')
                .mockImplementationOnce(() => null)

              const buildUnavailableImageBufferMock = jest.spyOn(buildUnavailableImageBuffer, 'buildUnavailableImageBuffer')

              const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

              const event = {
                pathParameters: {
                  concept_id: 'C100000-EDSC',
                  concept_type: 'datasets'
                },
                queryStringParameters: {
                  cascade_concepts: 'false',
                  return_default: 'false'
                }
              }

              await scaleImage(event, {})

              expect(generateCacheKeyMock).toBeCalledWith('C100000-EDSC', 'datasets', undefined, {
                height: 85,
                width: 85
              })

              expect(getImageFromCacheMock).toBeCalledWith('C100000-EDSC-h-w')
              expect(getImageUrlFromConceptMock).toBeCalledWith('C100000-EDSC', 'datasets', 'false', undefined)

              expect(buildUnavailableImageBufferMock).toBeCalledTimes(0)

              expect(buildResponseMock).toBeCalledWith(Buffer.from(''), 404)
            })
          })
        })

        describe('when the metadata does contain a browse image url', () => {
          test('85', async () => {
            const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
              .mockImplementationOnce(() => 'C100000-EDSC-h-w')
              .mockImplementationOnce(() => 'C100000-EDSC-h-w')

            const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
              .mockImplementationOnce(() => null)
              .mockImplementationOnce(() => null)

            const getImageUrlFromConceptMock = jest.spyOn(getImageUrlFromConcept, 'getImageUrlFromConcept')
              .mockImplementationOnce(() => 'https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')

            const responseBuffer = Buffer.from('test-image-contents')

            const downloadImageFromSourceMock = jest.spyOn(downloadImageFromSource, 'downloadImageFromSource')
              .mockImplementationOnce(() => responseBuffer)

            const resizeImageMock = jest.spyOn(resizeImage, 'resizeImage')
              .mockImplementationOnce(() => responseBuffer)

            const cacheImageMock = jest.spyOn(cacheImage, 'cacheImage')
              .mockImplementationOnce(() => responseBuffer)

            const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

            const event = {
              pathParameters: {
                concept_id: 'C100000-EDSC',
                concept_type: 'datasets'
              },
              queryStringParameters: {
                cascade_concepts: 'false'
              }
            }

            await scaleImage(event, {})

            expect(generateCacheKeyMock).toBeCalledWith('C100000-EDSC', 'datasets', undefined, {
              height: 85,
              width: 85
            })

            expect(getImageFromCacheMock).toBeCalledWith('C100000-EDSC-h-w')
            expect(getImageUrlFromConceptMock).toBeCalledWith('C100000-EDSC', 'datasets', 'false', undefined)
            expect(downloadImageFromSourceMock).toBeCalledWith('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
            expect(resizeImageMock).toBeCalledWith(responseBuffer, 85, 85)
            expect(cacheImageMock).toBeCalledWith('C100000-EDSC-h-w', responseBuffer)
            expect(buildResponseMock).toBeCalledWith(responseBuffer)
          })

          test('caches the resized image and the original image', async () => {
            const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
              .mockImplementationOnce(() => 'C100000-EDSC-100-100')
              .mockImplementationOnce(() => 'C100000-EDSC-h-w')

            const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
              .mockImplementationOnce(() => null)
              .mockImplementationOnce(() => null)

            const getImageUrlFromConceptMock = jest.spyOn(getImageUrlFromConcept, 'getImageUrlFromConcept')
              .mockImplementationOnce(() => 'https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')

            const responseBuffer = Buffer.from('test-image-contents')

            const downloadImageFromSourceMock = jest.spyOn(downloadImageFromSource, 'downloadImageFromSource')
              .mockImplementationOnce(() => responseBuffer)

            const resizedBuffer = Buffer.from('resized-image-contents')

            const resizeImageMock = jest.spyOn(resizeImage, 'resizeImage')
              .mockImplementationOnce(() => resizedBuffer)

            const cacheImageMock = jest.spyOn(cacheImage, 'cacheImage')
              .mockImplementationOnce(() => responseBuffer)
              .mockImplementationOnce(() => resizedBuffer)

            const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

            const event = {
              pathParameters: {
                concept_id: 'C100000-EDSC',
                concept_type: 'datasets'
              },
              queryStringParameters: {
                cascade_concepts: 'false',
                h: '100',
                w: '100'
              }
            }

            await scaleImage(event, {})

            expect(generateCacheKeyMock.mock.calls[0]).toEqual(['C100000-EDSC', 'datasets', undefined, {
              height: 100,
              width: 100
            }])

            expect(generateCacheKeyMock.mock.calls[1]).toEqual(['C100000-EDSC', 'datasets'])
            expect(getImageFromCacheMock).toBeCalledWith('C100000-EDSC-h-w')
            expect(getImageUrlFromConceptMock).toBeCalledWith('C100000-EDSC', 'datasets', 'false', undefined)
            expect(downloadImageFromSourceMock).toBeCalledWith('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
            expect(resizeImageMock).toBeCalledWith(responseBuffer, 100, 100)
            expect(cacheImageMock.mock.calls[0]).toEqual(['C100000-EDSC-h-w', responseBuffer])
            expect(cacheImageMock.mock.calls[1]).toEqual(['C100000-EDSC-100-100', resizedBuffer])
            expect(buildResponseMock).toBeCalledWith(resizedBuffer)
          })
        })
      })
    })

    describe('when a granule image is requested', () => {
      describe('when the metadata does not contain a browse image url', () => {
        describe('when return_default is true', () => {
          test('returns the unavailable (default) image', async () => {
            const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
              .mockImplementationOnce(() => 'G100000-EDSC-h-w')
              .mockImplementationOnce(() => 'G100000-EDSC-h-w')

            const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
              .mockImplementationOnce(() => null)
              .mockImplementationOnce(() => null)

            const getImageUrlFromConceptMock = jest.spyOn(getImageUrlFromConcept, 'getImageUrlFromConcept')
              .mockImplementationOnce(() => null)

            const responseBuffer = Buffer.from('test-image-contents')

            const buildUnavailableImageBufferMock = jest.spyOn(buildUnavailableImageBuffer, 'buildUnavailableImageBuffer')
              .mockImplementationOnce(() => responseBuffer)

            const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

            const event = {
              pathParameters: {
                concept_id: 'G100000-EDSC',
                concept_type: 'granules'
              }
            }

            await scaleImage(event, {})

            expect(getImageUrlFromConceptMock).toBeCalledWith('G100000-EDSC', 'granules', 'true', undefined)
            expect(generateCacheKeyMock).toBeCalledWith('G100000-EDSC', 'granules', undefined, {
              height: 85,
              width: 85
            })

            expect(getImageFromCacheMock).toBeCalledWith('G100000-EDSC-h-w')
            expect(getImageUrlFromConceptMock).toBeCalledWith('G100000-EDSC', 'granules', 'true', undefined)
            expect(buildUnavailableImageBufferMock).toBeCalledWith(85, 85)
            expect(buildResponseMock).toBeCalledWith(responseBuffer, 200)
          })
        })

        describe('when return_default is false', () => {
          test('does not call buildUnavailableImageBuffer and returns an empty Buffer', async () => {
            const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
              .mockImplementationOnce(() => 'G100000-EDSC-h-w')
              .mockImplementationOnce(() => 'G100000-EDSC-h-w')

            const getImageFromCacheMock = jest.spyOn(getImageFromCache, 'getImageFromCache')
              .mockImplementationOnce(() => null)
              .mockImplementationOnce(() => null)

            const getImageUrlFromConceptMock = jest.spyOn(getImageUrlFromConcept, 'getImageUrlFromConcept')
              .mockImplementationOnce(() => null)

            const buildUnavailableImageBufferMock = jest.spyOn(buildUnavailableImageBuffer, 'buildUnavailableImageBuffer')

            const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

            const event = {
              pathParameters: {
                concept_id: 'G100000-EDSC',
                concept_type: 'granules'
              },
              queryStringParameters: {
                return_default: 'false'
              }
            }

            await scaleImage(event, {})

            expect(generateCacheKeyMock).toBeCalledWith('G100000-EDSC', 'granules', undefined, {
              height: 85,
              width: 85
            })

            expect(getImageFromCacheMock).toBeCalledWith('G100000-EDSC-h-w')
            expect(getImageUrlFromConceptMock).toBeCalledWith('G100000-EDSC', 'granules', 'true', undefined)

            expect(buildUnavailableImageBufferMock).toBeCalledTimes(0)

            expect(buildResponseMock).toBeCalledWith(Buffer.from(''), 404)
          })
        })
      })
    })
  })

  describe('when an error occurs', () => {
    test('when return_default is true', async () => {
      const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementation(() => { throw new Error() })

      const responseBuffer = Buffer.from('test-image-contents')

      const buildUnavailableImageBufferMock = jest.spyOn(buildUnavailableImageBuffer, 'buildUnavailableImageBuffer')
        .mockImplementationOnce(() => responseBuffer)

      const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

      const event = {
        pathParameters: {
          concept_id: 'C100000-EDSC',
          concept_type: 'datasets'
        }
      }

      await scaleImage(event, {})

      expect(generateCacheKeyMock).toBeCalledWith('C100000-EDSC', 'datasets', undefined, {
        height: 85,
        width: 85
      })

      expect(buildUnavailableImageBufferMock).toBeCalledWith(85, 85)
      expect(buildResponseMock).toBeCalledWith(responseBuffer, 500)
    })

    test('when return_default is false', async () => {
      const generateCacheKeyMock = jest.spyOn(generateCacheKey, 'generateCacheKey')
        .mockImplementation(() => { throw new Error() })

      const buildResponseMock = jest.spyOn(buildResponse, 'buildResponse')

      const event = {
        pathParameters: {
          concept_id: 'C100000-EDSC',
          concept_type: 'datasets'
        },
        queryStringParameters: {
          return_default: 'false'
        }
      }

      await scaleImage(event, {})

      expect(generateCacheKeyMock).toBeCalledWith('C100000-EDSC', 'datasets', undefined, {
        height: 85,
        width: 85
      })

      expect(buildResponseMock).toBeCalledWith(Buffer.from(''), 500)
    })
  })
})
