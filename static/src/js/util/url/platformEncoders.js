import getObjectKeyByValue from '../object'

/**
 * Mapping of Platform keys to encoded values
 */
const platformMapping = {
  basis: 'fpb',
  category: 'fpc',
  sub_category: 'fpsc',
  short_name: 'fps'
}

/**
 * Encodes a Platform Facet object into a flat object with encoded keys
 * @param {object} platforms Platform Facet object
 * @return {object} A flat object with encoded Platform keys
 */
export const encodePlatforms = (platforms) => {
  if (!platforms) return ''
  if (Object.keys(platforms).length === 0) return ''

  const encoded = {}
  platforms.forEach((keyword, index) => {
    Object.keys(keyword).forEach((key) => {
      encoded[`${platformMapping[key]}${index}`] = keyword[key]
    })
  })

  return encoded
}


/**
 * Decodes a parameter object into a Platform object
 * @param {object} params URL parameter object from parsing the URL parameter string
 * @return {object} Platform Facet object
 */
export const decodePlatforms = (params) => {
  if (Object.keys(params).length === 0) return undefined

  const decoded = []
  Object.keys(params).forEach((encodedKey) => {
    // All of the platform facets have an index as the last character of the key
    // Strip off the last character and check the mapping if it exists
    const key = encodedKey.slice(0, -1)
    const index = encodedKey.slice(-1)

    const decodedKey = getObjectKeyByValue(platformMapping, key)
    if (decodedKey) {
      // Update the decoded index with value
      if (decoded[index] === undefined) decoded[index] = {}
      decoded[index][decodedKey] = params[encodedKey]
    }
  })

  if (decoded.length > 0) return decoded

  return undefined
}
