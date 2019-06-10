import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Retrieve tag data for given CMR tag metadata and a key to look for
 * @param {String} key The key to return from the provided tag object
 * @param {Object} tags An object representing tags from CMR metadata
 */
export const getValueForTag = (key, tags) => {
  if (!tags) return undefined

  // All EDSC tags are prefixed for ease of wildcard searching
  const tag = `${getApplicationConfig().cmrTagNamespace}.${key}`

  const { [tag]: tagObject = {} } = tags
  const { data } = tagObject

  return data
}

export default getValueForTag
