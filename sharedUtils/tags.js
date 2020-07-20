import { getApplicationConfig } from './config'

/**
 * Construct a tag name given a key with an optional namespace override
 * @param {String} key The tag key without a namespace
 * @param {String} namespaceOverride A namespace value to use instead of the default
 */
export const tagName = (key, namespaceOverride) => {
  let namespace
  if (namespaceOverride == null) {
    const { cmrTagNamespace } = getApplicationConfig()

    namespace = cmrTagNamespace
  } else {
    namespace = namespaceOverride
  }

  return [namespace, key].filter(Boolean).join('.')
}

/**
 * Retrieve tag data for given CMR tag metadata and a key to look for
 * @param {String} key The key to return from the provided tag object
 * @param {Object} tags An object representing tags from CMR metadata
 */
export const getValueForTag = (key, tags, namespaceOverride = null) => {
  if (!tags) return undefined

  // All EDSC tags are prefixed for ease of wildcard searching
  const tag = tagName(key, namespaceOverride)

  const { [tag]: tagObject = {} } = tags
  const { data } = tagObject

  return data
}

/**
 * Searches collection metadata for the existance of a tag
 * @param {Object} collection Collection metadata
 * @param {String} key Tag key
 */
export const hasTag = (collection, key, namespaceOverride = null) => {
  const { tags } = collection

  // GraphQL will return null if no tags are present
  if (tags == null) return false

  const tag = tagName(key, namespaceOverride)

  return Object.keys(tags).indexOf(tag) !== -1
}
