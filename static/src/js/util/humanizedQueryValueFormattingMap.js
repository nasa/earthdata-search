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
  temporal: (value) => formatTemporal(value),
  temporalString: (value) => formatTemporal(value),
  scienceKeywordsH: (value) => formatFacetHierarchy(value, scienceKeywordHierarchy),
  platformsH: (value) => formatFacetHierarchy(value, platformsHierarchy),
  instrumentH: (value) => formatFacetHierarchy(value),
  projectH: (value) => formatFacetHierarchy(value),
  processingLevelIdH: (value) => formatFacetHierarchy(value),
  dataCenterH: (value) => formatFacetHierarchy(value),
  granuleDataFormatH: (value) => formatFacetHierarchy(value),
  tilingSystem: (value) => formatFacetHierarchy(value),
  twoDCoordinateSystemName: (value) => formatFacetHierarchy(value),
  horizontalDataResolutionRange: (value) => formatFacetHierarchy(value),
  latency: (value) => formatFacetHierarchy(value),
  cloudHosted: (value) => formatBoolean(value),
  boundingBox: (value) => formatPoints(value),
  circle: (value) => formatCircle(value),
  line: (value) => formatPoints(value),
  point: (value) => formatPoints(value),
  polygon: (value) => formatPoints(value),
  onlineOnly: (value) => formatBoolean(value),
  browseOnly: (value) => formatBoolean(value)
}
