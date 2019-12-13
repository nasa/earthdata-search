import qs from 'qs'
import cleanDeep from 'clean-deep'

import { decodeFeatures, encodeFeatures } from './featureFacetEncoders'
import { decodeFacets, encodeFacets } from './facetEncoders'
import { decodeMap, encodeMap } from './mapEncoders'
import { decodeScienceKeywords, encodeScienceKeywords } from './scienceKeywordEncoders'
import { decodeString, encodeString } from './stringEncoders'
import { decodeTemporal, encodeTemporal } from './temporalEncoders'
import { decodeTimeline, encodeTimeline } from './timelineEncoders'
import { decodeCollections, encodeCollections } from './collectionsEncoders'
import { decodeGridCoords, encodeGridCoords } from './gridEncoders'
import { decodeHasGranulesOrCwic, encodeHasGranulesOrCwic } from './hasGranulesOrCwicEncoders'
import { isPath } from '../isPath'
import { encodeAdvancedSearch, decodeAdvancedSearch } from './advancedSearchEncoders'

/**
 * Takes a URL containing a path and query string and returns only the query string
 * @param {string} url - A string containing both a path and query string
 * @return {string} A string containing only query parameter values
 */
export const queryParamsFromUrlString = url => url.split(/[?#]/)[1]

/**
 * Stringify a URL parameter object
 * @param {Object} params Object with encoded URL parameters
 */
export const stringify = params => qs.stringify(
  cleanDeep(params, { emptyObjects: false, undefinedValues: false }),
  {
    addQueryPrefix: true,
    encoder: str => str.toString().replace(/ /g, '%20').replace(/,/g, '%2C').replace(/:/g, '%3A')
  }
)

/**
 * Mapping of URL Shortened Keys to their redux store keys
 */
const urlDefs = {
  focusedGranule: { shortKey: 'g', encode: encodeString, decode: decodeString },
  keywordSearch: { shortKey: 'q', encode: encodeString, decode: decodeString },
  pointSearch: { shortKey: 'sp', encode: encodeString, decode: decodeString },
  boundingBoxSearch: { shortKey: 'sb', encode: encodeString, decode: decodeString },
  polygonSearch: { shortKey: 'polygon', encode: encodeString, decode: decodeString },
  lineSearch: { shortKey: 'line', encode: encodeString, decode: decodeString },
  map: { shortKey: 'm', encode: encodeMap, decode: decodeMap },
  temporalSearch: { shortKey: 'qt', encode: encodeTemporal, decode: decodeTemporal },
  overrideTemporalSearch: { shortKey: 'ot', encode: encodeTemporal, decode: decodeTemporal },
  featureFacets: { shortKey: 'ff', encode: encodeFeatures, decode: decodeFeatures },
  platformFacets: { shortKey: 'fp', encode: encodeFacets, decode: decodeFacets },
  instrumentFacets: { shortKey: 'fi', encode: encodeFacets, decode: decodeFacets },
  organizationFacets: { shortKey: 'fdc', encode: encodeFacets, decode: decodeFacets },
  projectFacets: { shortKey: 'fpj', encode: encodeFacets, decode: decodeFacets },
  processingLevelFacets: { shortKey: 'fl', encode: encodeFacets, decode: decodeFacets },
  gridName: { shortKey: 's2n', encode: encodeString, decode: decodeString },
  gridCoords: { shortKey: 's2c', encode: encodeGridCoords, decode: decodeGridCoords },
  shapefileId: { shortKey: 'sf', encode: encodeString, decode: encodeString },
  tagKey: { shortKey: 'tag_key', encode: encodeString, decode: decodeString },
  hasGranulesOrCwic: { shortKey: 'ac', encode: encodeHasGranulesOrCwic, decode: decodeHasGranulesOrCwic }
}

/**
 * Helper method to decode a given paramName from URL parameters base on urlDefs keys
 * @param {object} params Object of encoded URL parameters
 * @param {string} paramName Param to decode
 */
const decodeHelp = (params, paramName) => {
  const value = params[urlDefs[paramName].shortKey]
  return urlDefs[paramName].decode(value)
}

/**
 * Given a URL param string, returns an object that matches the redux store
 * @param {string} paramString a URL encoded parameter string
 * @return {object} An object of values that match the redux store
 */
export const decodeUrlParams = (paramString) => {
  // decode the paramString
  const params = qs.parse(paramString, { ignoreQueryPrefix: true, parseArrays: false })

  // build the param object based on the structure in the redux store
  // e.g. map is store separately from query
  const focusedGranule = decodeHelp(params, 'focusedGranule')

  const map = decodeHelp(params, 'map')

  const spatial = {}
  spatial.point = decodeHelp(params, 'pointSearch')
  spatial.boundingBox = decodeHelp(params, 'boundingBoxSearch')
  spatial.polygon = decodeHelp(params, 'polygonSearch')
  spatial.line = decodeHelp(params, 'lineSearch')

  const collectionQuery = { pageNum: 1 }
  const granuleQuery = { pageNum: 1 }
  collectionQuery.spatial = spatial
  collectionQuery.keyword = decodeHelp(params, 'keywordSearch')
  collectionQuery.temporal = decodeHelp(params, 'temporalSearch')
  collectionQuery.overrideTemporal = decodeHelp(params, 'overrideTemporalSearch')
  collectionQuery.gridName = decodeHelp(params, 'gridName')
  collectionQuery.tagKey = decodeHelp(params, 'tagKey')
  collectionQuery.hasGranulesOrCwic = decodeHelp(params, 'hasGranulesOrCwic')
  granuleQuery.gridCoords = decodeHelp(params, 'gridCoords')

  const query = {
    collection: collectionQuery,
    granule: granuleQuery
  }

  const timeline = decodeTimeline(params)

  const featureFacets = decodeHelp(params, 'featureFacets')
  const scienceKeywords = decodeScienceKeywords(params)
  const platforms = decodeHelp(params, 'platformFacets')
  const instruments = decodeHelp(params, 'instrumentFacets')
  const organizations = decodeHelp(params, 'organizationFacets')
  const projects = decodeHelp(params, 'projectFacets')
  const processingLevels = decodeHelp(params, 'processingLevelFacets')

  const {
    collections,
    focusedCollection,
    project
  } = decodeCollections(params)

  const cmrFacets = {
    data_center_h: organizations,
    instrument_h: instruments,
    platform_h: platforms,
    processing_level_id_h: processingLevels,
    project_h: projects,
    science_keywords_h: scienceKeywords
  }

  const shapefile = {
    shapefileId: decodeHelp(params, 'shapefileId')
  }

  const advancedSearch = decodeAdvancedSearch(params)

  return {
    advancedSearch,
    cmrFacets,
    collections,
    featureFacets,
    focusedCollection,
    focusedGranule,
    map,
    project,
    query,
    shapefile,
    timeline
  }
}

/**
 * Given a set of React Component Props, returns a URL path with URL encoded parameter string
 * @param {object} props React Props
 * @return {string} URL encoded parameter string
 */
export const encodeUrlQuery = (props) => {
  const query = {}

  Object.keys(urlDefs).forEach((longKey) => {
    const { shortKey } = urlDefs[longKey]
    const value = urlDefs[longKey].encode(props[longKey])

    query[shortKey] = value
  })

  const scienceKeywordQuery = encodeScienceKeywords(props.scienceKeywordFacets)
  const collectionsQuery = encodeCollections(props)
  const timelineQuery = encodeTimeline(props.timelineQuery, props.pathname)
  const advancedQuery = encodeAdvancedSearch(props.advancedSearch)

  const encodedQuery = {
    ...collectionsQuery,
    ...query,
    ...timelineQuery,
    ...scienceKeywordQuery,
    ...advancedQuery
  }

  const paramString = stringify(encodedQuery)

  // return the full pathname + paramString
  const { pathname } = props
  const fullPath = pathname + paramString
  return fullPath
}

/**
 * Create a query string containing both indexed and non-indexed keys.
 * @param {object} queryParams - An object containing all queryParams.
 * @param {array} nonIndexedKeys - An array of strings that represent the keys which should not be indexed.
 * @return {string} A query string containing both indexed and non-indexed keys.
 */
export const prepKeysForCmr = (queryParams, nonIndexedKeys = []) => {
  const nonIndexedAttrs = {}
  const indexedAttrs = { ...queryParams }

  nonIndexedKeys.forEach((key) => {
    nonIndexedAttrs[key] = indexedAttrs[key]
    delete indexedAttrs[key]
  })

  return [
    qs.stringify(indexedAttrs),
    qs.stringify(nonIndexedAttrs, { indices: false, arrayFormat: 'brackets' })
  ].filter(Boolean).join('&')
}

/**
 * URLs that don't use URL params
 * The saved projects page needs to be handled a little differently
 * because it shares the base url with the projects page.
 */
export const urlPathsWithoutUrlParams = [
  /^\/downloads/,
  /^\/contact_info/,
  /^\/auth_callback/
]

/**
 * Is the given location the Saved Projects page
 * @param {Object} location Redux store location
 */
export const isSavedProjectsPage = (location) => {
  const { pathname, search } = location
  return isPath(pathname, '/projects') && search === ''
}
