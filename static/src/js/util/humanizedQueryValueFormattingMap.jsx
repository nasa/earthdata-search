import {
  formatBoolean,
  formatCircle,
  formatFacetHierarchy,
  formatPoints,
  formatTemporal
} from './humanizedQueryValueFormatters'

export const scienceKeywordHierarchy = [
  'topic',
  'term',
  'variable_level_1',
  'variable_level_2',
  'variable_level_3',
  'detailed_variable'
]

export const platformsHierarchy = [
  'basis',
  'category',
  'sub_category',
  'short_name'
]

/**
 * Creates a mapping from a query ket to a formatting function that will prepare
 * the values to be displayed in UI
 */
export const humanizedQueryValueFormattingMap = {
  boundingBox: (value) => formatPoints(value),
  browseOnly: (value) => formatBoolean(value),
  circle: (value) => formatCircle(value),
  cloudHosted: (value) => formatBoolean(value),
  dataCenterH: (value) => formatFacetHierarchy(value),
  granuleDataFormatH: (value) => formatFacetHierarchy(value),
  horizontalDataResolutionRange: (value) => formatFacetHierarchy(value),
  instrumentH: (value) => formatFacetHierarchy(value),
  latency: (value) => formatFacetHierarchy(value),
  line: (value) => formatPoints(value),
  onlineOnly: (value) => formatBoolean(value),
  onlyEosdisCollections: (value) => formatBoolean(value),
  platformsH: (value) => formatFacetHierarchy(value, platformsHierarchy),
  point: (value) => formatPoints(value),
  polygon: (value) => formatPoints(value),
  processingLevelIdH: (value) => formatFacetHierarchy(value),
  projectH: (value) => formatFacetHierarchy(value),
  scienceKeywordsH: (value) => formatFacetHierarchy(value, scienceKeywordHierarchy),
  temporal: (value) => formatTemporal(value),
  temporalString: (value) => formatTemporal(value),
  tilingSystem: (value) => formatFacetHierarchy(value),
  twoDCoordinateSystemName: (value) => formatFacetHierarchy(value)
}
