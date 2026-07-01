import Redis from 'ioredis'

let cacheClient

/**
 * Retrieve the cache client. Start new client if client is null.
 * @returns {RedisClient} RedisClient object containing the connection to Redis
*/
export const getCacheConnection = () => {
  if (cacheClient) {
    return cacheClient
  }

  let host = process.env.CACHE_HOST
  let port = process.env.CACHE_PORT

  if (process.env.NODE_ENV === 'development') {
    host = 'localhost'
    port = '6379'
  }

  cacheClient = new Redis({
    host,
    port
  })

  return cacheClient
}
