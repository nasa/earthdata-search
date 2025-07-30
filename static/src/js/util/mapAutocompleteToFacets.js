import { autocompleteFacetsMap } from './autocompleteFacetsMap'
import { parseScienceKeywordHierarchy } from './parseScienceKeywordHierarchy'
import { parsePlatformHierarchy } from './parsePlatformHierarchy'

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
    facets.science_keywords_h = parseScienceKeywordHierarchy(fields)
  }

  if (mappedType === 'platforms_h') {
    facets.platforms_h = parsePlatformHierarchy(fields)
  }

  return facets
}
