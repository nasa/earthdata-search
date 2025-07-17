import { autocompleteFacetsMap } from './autocompleteFacetsMap'
import { mapScienceKeywords } from './mapScienceKeywords'
import { mapPlatforms } from './mapPlatforms'

/**
 * Map an autocomplete suggestion into a CMR Facet
 * @param {Object} autocomplete autocomplete suggestion
 */
export const mapAutocompleteToFacets = (autocomplete) => {
  const { suggestion } = autocomplete
  const { fields, type } = suggestion

  const mappedType = autocompleteFacetsMap[type]

  if (!mappedType) return null

  const facets = {
    [mappedType]: fields
  }

  if (mappedType === 'science_keywords_h') {
    facets.science_keywords_h = mapScienceKeywords(fields)
  }

  if (mappedType === 'platforms_h') {
    facets.platforms_h = mapPlatforms(fields)
  }

  return facets
}
