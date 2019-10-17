import { getValueForTag } from '../../../../../sharedUtils/tags'

/**
 * Returns the value of the edsc.limited_collections tag if this is a limited collection
 * @param {Object} metadata Collection metadata
 */
export const getGranuleLimit = (metadata = {}) => {
  const { tags = {} } = metadata
  const limitedCollectionTag = getValueForTag('limited_collections', tags, 'edsc')
  const { limit } = limitedCollectionTag || {}
  return limit
}
