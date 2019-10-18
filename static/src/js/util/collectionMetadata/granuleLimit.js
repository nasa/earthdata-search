import { limitedCollectionSize } from '../../../../../sharedUtils/limitedCollectionSize'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

/**
 * Returns the value of the edsc.limited_collections tag or the defaultMaxOrderSize
 * @param {Object} metadata Collection metadata
 */
export const getGranuleLimit = (metadata = {}) => (
  limitedCollectionSize(metadata) || getApplicationConfig().defaultMaxOrderSize
)
