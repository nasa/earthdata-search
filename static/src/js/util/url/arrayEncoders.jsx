/**
 * Decodes an array (as object) parameter (returns the values of the object)
 * @param {Object} object
 */
export const decodeArray = (object) => {
  if (!object) return undefined

  // If the object is a string, return that
  if (typeof object === 'string') return [object]

  return Object.values(object)
}

/**
 * Encodes an array parameter (returns the same value)
 * @param {Array} array
 */
export const encodeArray = (array) => array || ''
