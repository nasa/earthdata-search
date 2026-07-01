import { getCacheConnection } from './getCacheConnection'

/**
 * Puts the given item into the cache
 * @param {String} key This is used to retrieve the cache value later
 * @param {Buffer<item>} item the value in the cache as a buffer
 * @param {String} expireSeconds the number of seconds before the cache expires
 */
export const cacheItem = async (key, item, expireSeconds) => {
  // Ignore empty cache attempts
  if (item) {
    const cacheConnection = getCacheConnection()
    /**
     * Caching methods
     * EX      -- Set the specified expire time, in seconds.
     * PX      -- Set the specified expire time, in milliseconds.
     * NX      -- Only set the key if it does not already exist.
     * XX      -- Only set the key if it already exist.
     * KEEPTTL -- Retain the time to live associated with the key.
     */
    try {
      await cacheConnection.set(key, item, 'EX', expireSeconds)

      console.log(`Successfully cached ${key}`)
    } catch (error) {
      console.error(`Failed to cache ${key}: ${error.toString()}`)

      throw error
    }
  } else {
    // Log the attempt to cache empty values for debugging
    console.log(`Valued provided for ${key} is empty, skipping cache.`)
  }
}
