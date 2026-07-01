import { getCacheConnection } from './getCacheConnection'

/**
 * Fetches item from cache.
 * @param {String} key The cache key of the item to retrieve
 * @returns {Buffer<Item>} The item associated with given cache key or null if none is found
 */
export const getItemFromCache = async (key) => {
  const client = getCacheConnection()

  return client.getBuffer(key)
    .then((item) => {
      if (item) {
        console.log(`Cache HIT '${key}'`)

        return item
      }

      console.log(`Cache MISS '${key}'`)

      return null
    })
}
