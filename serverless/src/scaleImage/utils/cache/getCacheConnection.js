import asyncRedis from 'async-redis'

let cacheClient

/**
 * Retrieve the cache client. Start new client if client is null.
 * @returns {RedisClient} RedisClient object containing the connection to Redis
*/
export const getCacheConnection = () => {
  if (cacheClient) {
    return cacheClient
  }

  let host = process.env.cacheHost
  let port = process.env.cachePort

  if (process.env.IS_OFFLINE === 'true') {
    host = 'localhost'
    port = '6379'
  }

  cacheClient = asyncRedis.createClient({
    return_buffers: true,
    host,
    port
  })

  return cacheClient
}
