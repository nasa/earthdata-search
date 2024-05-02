import { getCacheConnection } from './getCacheConnection'

/**
 * Puts the given image in cache
 * @param {String} key This is used to retrieve the cache value later
 * @param {Buffer<Image>} image the value in the cache as a buffer
 */
export const cacheImage = async (key, image) => {
  const { cacheKeyExpireSeconds } = process.env

  // Ignore empty cache attempts
  if (image) {
    const cacheConnection = await getCacheConnection()
    /**
     * Caching methods
     * EX      -- Set the specified expire time, in seconds.
     * PX      -- Set the specified expire time, in milliseconds.
     * NX      -- Only set the key if it does not already exist.
     * XX      -- Only set the key if it already exist.
     * KEEPTTL -- Retain the time to live associated with the key.
     */
    try {
      await cacheConnection.set(key, image, 'EX', cacheKeyExpireSeconds)

      console.log(`Successfully cached ${key}`)
    } catch (error) {
      console.log(`Failed to cache ${key}: ${error.toString()}`)

      throw error
    }
  } else {
    // Log the attempt to cache empty values for debugging
    console.log(`Valued provided for ${key} is empty, skipping cache.`)
  }
}
