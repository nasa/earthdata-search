/**
 * Encodes the Advanced Search params into an object
 * @param {Object} selectedRegion selectedRegion object from the store
 */
export const encodeselectedRegion = (selectedRegion) => {
  if (!selectedRegion) return ''

  return {
    sr: {
      ...selectedRegion
    }
  }
}

/**
 * Decodes a parameter object into an selectedRegion object
 * @param {Object} params URL parameter object from parsing the URL parameter string
 */
export const decodeselectedRegion = (params) => {
  if (Object.keys(params).length === 0) return undefined

  const { sr: selectedRegion } = params
  if (!selectedRegion) return undefined

  return selectedRegion
}
