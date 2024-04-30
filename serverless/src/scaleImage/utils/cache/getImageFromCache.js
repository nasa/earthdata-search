import { getCacheConnection } from './getCacheConnection'

/**
 * Fetches image from cache.
 * @param {String} key The cache key of the item to retrieve
 * @returns {Buffer<Image>} The image associated with given cache key or null if none is found
 */
export const getImageFromCache = async (key) => {
  console.log('🚀 ~ file: getImageFromCache.js:9 ~ getImageFromCache ~ key:', key)
  const client = await getCacheConnection()

  return client.get(key)
    .then((image) => {
      if (image) {
        console.log(`Cache HIT '${key}'`)

        return image
      }

      console.log(`Cache MISS '${key}'`)

      return null
    })
}
