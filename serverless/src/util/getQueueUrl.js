export const QUEUE_NAMES = {
  CatalogRestOrderQueue: 'CatalogRestOrderQueue',
  ColorMapQueue: 'ColorMapQueue',
  CmrOrderingOrderQueue: 'CmrOrderingOrderQueue',
  HarmonyOrderQueue: 'HarmonyOrderQueue',
  SwodlrOrderQueue: 'SwodlrOrderQueue',
  TagProcessingQueue: 'TagProcessingQueue',
  UserDataQueue: 'UserDataQueue'
}

/**
 * Return the URL for the given queue name, using the elasticmq host if necessary
 */
export const getQueueUrl = (queueName) => {
  const isOffline = process.env.NODE_ENV === 'development'

  const localPrefix = 'http://localhost:9324/queue/earthdata-search-dev-'

  switch (queueName) {
    case QUEUE_NAMES.CatalogRestOrderQueue:
      return isOffline ? `${localPrefix}CatalogRestOrderQueue` : process.env.CATALOG_REST_QUEUE_URL
    case QUEUE_NAMES.ColorMapQueue:
      return isOffline ? `${localPrefix}ColorMapsProcessingQueue` : process.env.COLOR_MAP_QUEUE_URL
    case QUEUE_NAMES.CmrOrderingOrderQueue:
      return isOffline ? `${localPrefix}CmrOrderingOrderQueue` : process.env.CMR_ORDERING_ORDER_QUEUE_URL
    case QUEUE_NAMES.HarmonyOrderQueue:
      return isOffline ? `${localPrefix}HarmonyOrderQueue` : process.env.HARMONY_QUEUE_URL
    case QUEUE_NAMES.SwodlrOrderQueue:
      return isOffline ? `${localPrefix}SwodlrOrderQueue` : process.env.SWODLR_QUEUE_URL
    case QUEUE_NAMES.TagProcessingQueue:
      return isOffline ? `${localPrefix}TagProcessingQueue` : process.env.TAG_QUEUE_URL
    case QUEUE_NAMES.UserDataQueue:
      return isOffline ? `${localPrefix}UserDataQueue` : process.env.USER_DATA_QUEUE_URL
    default:
      return null
  }
}
