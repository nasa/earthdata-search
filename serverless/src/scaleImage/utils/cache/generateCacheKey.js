/**
 * @typedef {Object} ImageDimension
 * @property {Integer} height The height of the image
 * @property {Integer} width - THe width
 */

/**
  * Generates a key to be used for a particular records cache key
  * @param {String} imageSrc Image Source URL
  * @param {ImageDimension} dimensions The dimensions of the image to generate the key for
  * @returns {String} Key to be used to store an item in cache.
  */
export const generateCacheKey = (imageSrc, dimensions = {}) => {
  const {
    height = 'h',
    width = 'w'
  } = dimensions

  const providedKeys = [
    imageSrc,
    height,
    width
  ].filter(Boolean)

  return providedKeys.join('-')
}
