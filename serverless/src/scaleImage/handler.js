import { getApplicationConfig } from '../../../sharedUtils/config'

import { buildResponse } from './utils/buildResponse'
import { downloadImageFromSource } from './utils/downloadImageFromSource'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'

import { cacheImage } from './utils/cache/cacheImage'
import { generateCacheKey } from './utils/cache/generateCacheKey'
import { getImageFromCache } from './utils/cache/getImageFromCache'

import { getImageUrlFromConcept } from './utils/cmr/getImageUrlFromConcept'

import { buildUnavailableImageBuffer } from './utils/sharp/buildUnavailableImageBuffer'

import { resizeImage } from './utils/sharp/resizeImage'

/**
 * Resizes an image and returns it as a string buffer
 * @param {Object} event AWS Lambda Event
 */
const scaleImage = async (event) => {
  // Pull the path and query parameters from the http event
  const {
    pathParameters,
    queryStringParameters
  } = event

  const {
    concept_id: conceptId,
    concept_type: conceptType
  } = pathParameters

  // Default the queryStringParameters because when none are provided the key is missing
  const { height: defaultHeight, width: defaultWidth } = getApplicationConfig().thumbnailSize
  const {
    cascade_concepts: cascadeConcepts = 'true',
    h = defaultHeight,
    w = defaultWidth,
    return_default: returnDefault = 'true',
    imageSrc,
    ee: earthdataEnvironment = determineEarthdataEnvironment()
  } = queryStringParameters || {}
  console.log('🚀 ~ file: handler.js:43  scaleImage ~ earthdataEnvironment:', earthdataEnvironment)

  const width = parseInt(w, 10)
  const height = parseInt(h, 10)
  // Initialize the thumbnail to an empty array buffer to support `return_default` being set to false
  let thumbnail = Buffer.from('')

  try {
    // Optional imageSrc that gets passed when a granule image from one of many is specified
    const dimensions = {
      height,
      width
    }
    const cacheKey = generateCacheKey(conceptId, conceptType, imageSrc, dimensions)
    // Should we use the cache
    const useCache = (process.env.useCache === 'true')
    console.log('🚀 ~ file: handler.js:58 ~ scaleImage ~ useCache:', useCache)

    let originalImageFromCache = null
    const originalCacheKey = generateCacheKey(conceptId, conceptType)
    if (useCache) {
      const imageFromCache = await getImageFromCache(cacheKey)

      if (imageFromCache) {
      // If the image is in the cache, return it
        return buildResponse(imageFromCache)
      }

      // Check for the original size image in the cache
      originalImageFromCache = await getImageFromCache(originalCacheKey)
    }

    let imageBuffer

    if (originalImageFromCache) {
      // If the original image is cached, don't download it from the imageUrl, instead we just resize it
      imageBuffer = originalImageFromCache
    } else {
      // Attempt to retrieve the url of a browse image for the provided concept and type
      const imageUrl = await getImageUrlFromConcept(
        conceptId,
        conceptType,
        cascadeConcepts,
        imageSrc,
        earthdataEnvironment
      )

      if (!imageUrl) {
        // If there is no image url found and returnDefault is false, return a 404
        let statusCode = 404

        if (returnDefault === 'true') {
          // If there is no image url found and returnDefault is true, return a 200 with the unavailable image
          thumbnail = await buildUnavailableImageBuffer(height, width)
          statusCode = 200
        }

        return buildResponse(thumbnail, statusCode)
      }

      imageBuffer = await downloadImageFromSource(imageUrl)

      console.log(`Successfully downloaded ${imageUrl}`)

      // Cache the original image, if the requested image was resized
      if (originalCacheKey !== cacheKey && useCache) {
        console.log('🚀 ~ file: handler.js:107 ~ scaleImage ~ originalCacheKey:', originalCacheKey)
        cacheImage(originalCacheKey, imageBuffer)
      }
    }

    // Resize will check to see if a height or width was provided and if not avoid calling resize
    thumbnail = await resizeImage(imageBuffer, height, width)

    // Cache the image
    if (useCache) {
      cacheImage(cacheKey, thumbnail)
    }
  } catch (error) {
    console.log(`Error occurred running the scale image handler ${error.toString()}`)

    if (returnDefault === 'true') {
      thumbnail = await buildUnavailableImageBuffer(height, width)
    }

    // TODO if the axios call is set to 500 here even though its an error the front end
    // will not work
    return buildResponse(thumbnail, 200)
  }

  // Return the resized image
  return buildResponse(thumbnail)
}

export default scaleImage
