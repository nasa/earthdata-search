/**
 * Encodes a Feature Facet object into a string
 * @param {object} features Feature Facet object
 * @return {string} A `!` delimited string of the Feature Facet values
 */
export const encodeFeatures = (features) => {
  if (!features) return ''

  const {
    availableInEarthdataCloud,
    customizable,
    mapImagery,
    nearRealTime
  } = features

  const encoded = []

  if (availableInEarthdataCloud) encoded.push('Available in Earthdata Cloud')
  if (customizable) encoded.push('Customizable')
  if (mapImagery) encoded.push('Map Imagery')
  if (nearRealTime) encoded.push('Near Real Time')

  const encodedString = encoded.join('!')

  if (encodedString === '') return ''

  return encodedString
}

/**
 * Decodes a Feature Facet parameter string into an object
 * @param {string} string A `!` delimited string of the Feature Facet values
 * @return {object} Feature Facet object
 */
export const decodeFeatures = (string) => {
  const defaultFeatures = {
    availableInEarthdataCloud: false,
    customizable: false,
    mapImagery: false,
    nearRealTime: false
  }

  if (!string) {
    return defaultFeatures
  }

  const decodedValues = string.split('!')

  const decodedFeatures = {
    availableInEarthdataCloud: decodedValues.indexOf('Available in Earthdata Cloud') !== -1,
    customizable: decodedValues.indexOf('Customizable') !== -1,
    mapImagery: decodedValues.indexOf('Map Imagery') !== -1,
    nearRealTime: decodedValues.indexOf('Near Real Time') !== -1
  }

  return {
    ...decodedFeatures
  }
}
