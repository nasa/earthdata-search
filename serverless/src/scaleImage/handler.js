import { getApplicationConfig } from '../../../sharedUtils/config'

import { buildResponse } from './utils/buildResponse'
import { downloadImageFromSource } from './utils/downloadImageFromSource'

import { cacheItem } from '../util/cache/cacheItem'
import { generateCacheKey } from '../util/cache/generateCacheKey'
import { getItemFromCache } from '../util/cache/getItemFromCache'

import { buildUnavailableImageBuffer } from './utils/sharp/buildUnavailableImageBuffer'

import { resizeImage } from './utils/sharp/resizeImage'

/**
 * Resizes an image and returns it as a string buffer
 * @param {Object} event AWS Lambda Event
 */
const scaleImage = async (event) => {
  // Pull the path and query parameters from the http event
  const {
    queryStringParameters
  } = event

  // Default the queryStringParameters because when none are provided the key is missing
  const { height: defaultHeight, width: defaultWidth } = getApplicationConfig().thumbnailSize
  const {
    h = defaultHeight,
    w = defaultWidth,
    imageSrc
  } = queryStringParameters || {}

  const width = parseInt(w, 10)
  const height = parseInt(h, 10)
  // Initialize the thumbnail to an empty array buffer to support `return_default` being set to false
  let thumbnail = Buffer.from('')

  try {
    const dimensions = {
      height,
      width
    }

    if (!imageSrc) {
    // If there is no imageSrc throw an error
      throw new Error('imageSrc is required')
    }

    const useCache = process.env.USE_CACHE === 'true'
    const cacheKey = generateCacheKey(imageSrc, dimensions)

    let originalImageFromCache = null
    const originalCacheKey = generateCacheKey(imageSrc)
    if (useCache) {
      const imageFromCache = await getItemFromCache(cacheKey)
      if (imageFromCache) {
        // If the image is in the cache, return it
        return buildResponse(imageFromCache)
      }

      // Check for the original size image in the cache if a specific granule image is not being requested
      originalImageFromCache = await getItemFromCache(originalCacheKey)
    }

    let imageBuffer
    if (originalImageFromCache) {
      // If the original image is cached, don't download it from the imageUrl, instead we just resize it
      imageBuffer = originalImageFromCache
    } else {
      imageBuffer = await downloadImageFromSource(imageSrc)

      // Cache the original image, if the requested image was resized
      if (originalCacheKey !== cacheKey && useCache) {
        cacheItem(originalCacheKey, imageBuffer, process.env.IMAGE_CACHE_EXPIRE_SECONDS)
      }
    }

    // Resize will check to see if a height or width was provided and if not avoid calling resize
    thumbnail = await resizeImage(imageBuffer, height, width)

    // Cache the image
    if (useCache) {
      cacheItem(cacheKey, thumbnail, process.env.IMAGE_CACHE_EXPIRE_SECONDS)
    }
  } catch (error) {
    console.log(`Error occurred running the scale image handler ${error.toString()}`)

    thumbnail = await buildUnavailableImageBuffer(height, width)

    // TODO if the axios call is set to 500 here even though its an error the front end will fail
    return buildResponse(thumbnail, 200)
  }

  // Return the resized image
  return buildResponse(thumbnail)
}

export default scaleImage
