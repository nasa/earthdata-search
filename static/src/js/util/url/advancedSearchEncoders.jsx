/**
 * Encodes the Advanced Search params into an object
 * @param {Object} advancedSearch advancedSearch object from the store
 */
export const encodeAdvancedSearch = (advancedSearch) => {
  if (!advancedSearch) return ''

  const { regionSearch } = advancedSearch

  if (!regionSearch) return ''

  const { selectedRegion } = regionSearch

  if (!selectedRegion) return ''

  return {
    sr: {
      ...selectedRegion
    }
  }
}

/**
 * Decodes a parameter object into an advancedSearch object
 * @param {Object} params URL parameter object from parsing the URL parameter string
 */
export const decodeAdvancedSearch = (params) => {
  if (Object.keys(params).length === 0) return undefined

  const { sr } = params
  if (!sr) return undefined

  const advancedSearch = {
    regionSearch: {
      selectedRegion: {
        ...sr
      }
    }
  }

  return advancedSearch
}
