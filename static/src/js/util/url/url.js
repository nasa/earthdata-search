import qs from 'qs'
import cleanDeep from 'clean-deep'

import { decodeCollections, encodeCollections } from './collectionsEncoders'
import { decodeFacets, encodeFacets } from './facetEncoders'
import { decodeFeatures, encodeFeatures } from './featureFacetEncoders'
import { decodeHasGranulesOrCwic, encodeHasGranulesOrCwic } from './hasGranulesOrCwicEncoders'
import { decodeMap, encodeMap } from './mapEncoders'
import { decodePlatforms, encodePlatforms } from './platformEncoders'
import { decodeScienceKeywords, encodeScienceKeywords } from './scienceKeywordEncoders'
import { decodeString, encodeString } from './stringEncoders'
import { decodeTemporal, encodeTemporal } from './temporalEncoders'
import { decodeTimeline, encodeTimeline } from './timelineEncoders'
import { decodeselectedRegion, encodeselectedRegion } from './selectedRegionEncoders'
import { encodeArray, decodeArray } from './arrayEncoders'
import { encodeEarthdataEnvironment, decodeEarthdataEnvironment } from './environmentEncoders'
import { decodeBoolean, encodeBoolean } from './booleanEncoders'

import { isPath } from '../isPath'
import { deprecatedURLParameters } from '../../constants/deprecatedURLParameters'
import { decodePortal, encodePortal } from './portalEncoders'
import { decodeCollectionSortKey, encodeCollectionSortKey } from './collectionSortKeyEncoders'
import { routes } from '../../constants/routes'

/**
 * Takes a URL containing a path and query string and returns only the query string
 * @param {String} url - A string containing both a path and query string
 * @return {String} A string containing only query parameter values
 */
export const queryParamsFromUrlString = (url) => url.split(/[?#]/)[1]

/**
 * Stringify a URL parameter object
 * @param {Object} params Object with encoded URL parameters
 */
export const stringify = (params) => qs.stringify(
  cleanDeep(params, {
    emptyObjects: false,
    undefinedValues: false
  }),
  {
    addQueryPrefix: true,
    encoder: (str) => str.toString().replace(/ /g, '%20').replace(/,/g, '%2C').replace(/:/g, '%3A')
  }
)

/**
 * Mapping of URL Shortened Keys to their redux store keys
 */
const urlDefs = {
  earthdataEnvironment: {
    shortKey: 'ee',
    encode: encodeEarthdataEnvironment,
    decode: decodeEarthdataEnvironment
  },
  focusedGranule: {
    shortKey: 'g',
    encode: encodeString,
    decode: decodeString
  },
  keywordSearch: {
    shortKey: 'q',
    encode: encodeString,
    decode: decodeString
  },
  nlpSearch: {
    shortKey: 'nlp',
    encode: encodeString,
    decode: decodeString
  },
  pointSearch: {
    shortKey: 'sp',
    encode: encodeArray,
    decode: decodeArray
  },
  boundingBoxSearch: {
    shortKey: 'sb',
    encode: encodeArray,
    decode: decodeArray
  },
  polygonSearch: {
    shortKey: 'polygon',
    encode: encodeArray,
    decode: decodeArray
  },
  lineSearch: {
    shortKey: 'line',
    encode: encodeArray,
    decode: decodeArray
  },
  circleSearch: {
    shortKey: 'circle',
    encode: encodeArray,
    decode: decodeArray
  },
  temporalSearch: {
    shortKey: 'qt',
    encode: encodeTemporal,
    decode: decodeTemporal
  },
  overrideTemporalSearch: {
    shortKey: 'ot',
    encode: encodeTemporal,
    decode: decodeTemporal
  },
  featureFacets: {
    shortKey: 'ff',
    encode: encodeFeatures,
    decode: decodeFeatures
  },
  twoDCoordinateSystemNameFacets: {
    shortKey: 's2n',
    encode: encodeFacets,
    decode: decodeFacets
  },
  horizontalDataResolutionRangeFacets: {
    shortKey: 'hdr',
    encode: encodeFacets,
    decode: decodeFacets
  },
  instrumentFacets: {
    shortKey: 'fi',
    encode: encodeFacets,
    decode: decodeFacets
  },
  organizationFacets: {
    shortKey: 'fdc',
    encode: encodeFacets,
    decode: decodeFacets
  },
  projectFacets: {
    shortKey: 'fpj',
    encode: encodeFacets,
    decode: decodeFacets
  },
  processingLevelFacets: {
    shortKey: 'fl',
    encode: encodeFacets,
    decode: decodeFacets
  },
  latency: {
    shortKey: 'lf',
    encode: encodeFacets,
    decode: decodeFacets
  },
  granuleDataFormatFacets: {
    shortKey: 'gdf',
    encode: encodeFacets,
    decode: decodeFacets
  },
  shapefileId: {
    shortKey: 'sf',
    encode: encodeString,
    decode: encodeString
  },
  selectedFeatures: {
    shortKey: 'sfs',
    encode: encodeArray,
    decode: decodeArray
  },
  tagKey: {
    shortKey: 'tag_key',
    encode: encodeString,
    decode: decodeString
  },
  hasGranulesOrCwic: {
    shortKey: 'ac',
    encode: encodeHasGranulesOrCwic,
    decode: decodeHasGranulesOrCwic
  },
  onlyEosdisCollections: {
    shortKey: 'oe',
    encode: encodeBoolean,
    decode: decodeBoolean
  }
}

/**
 * Helper method to decode a given paramName from URL parameters base on urlDefs keys
 * @param {Object} params Object of encoded URL parameters
 * @param {String} paramName Param to decode
 */
const decodeHelp = (params, paramName) => {
  const value = params[urlDefs[paramName].shortKey]

  return urlDefs[paramName].decode(value)
}

/**
 * Given a URL param string, returns an object that matches the redux store
 * @param {String} paramString a URL encoded parameter string
 * @return {Object} An object of values that match the redux store
 */
export const decodeUrlParams = (paramString) => {
  // Decode the paramString
  const params = qs.parse(paramString, {
    ignoreQueryPrefix: true,
    parseArrays: false
  })

  // Create an array of any deprecated parameters that appear in the params
  const deprecatedUrlParams = Object.entries(params)
    .filter(([key]) => deprecatedURLParameters.includes(key))
    .map(([key]) => key)

  const {
    metadata,
    focusedCollection,
    project = {},
    query = {}
  } = decodeCollections(params)

  // Build the param object based on the structure in the redux store
  // e.g. map is store separately from query
  const focusedGranule = decodeHelp(params, 'focusedGranule')

  const mapView = decodeMap(params)

  const spatial = {}

  // If the decode values don't exist, don't add `undefined` to the spatial object.
  const decodedBoundingBox = decodeHelp(params, 'boundingBoxSearch')
  if (decodedBoundingBox) spatial.boundingBox = decodedBoundingBox
  const decodedCircle = decodeHelp(params, 'circleSearch')
  if (decodedCircle) spatial.circle = decodedCircle
  const decodedLine = decodeHelp(params, 'lineSearch')
  if (decodedLine) spatial.line = decodedLine
  const decodedPoint = decodeHelp(params, 'pointSearch')
  if (decodedPoint) spatial.point = decodedPoint
  const decodedPolygon = decodeHelp(params, 'polygonSearch')
  if (decodedPolygon) spatial.polygon = decodedPolygon

  // Initialize the collection query
  const { collection = {} } = query
  const collectionQuery = {
    byId: {},
    ...collection,
    pageNum: 1
  }
  collectionQuery.hasGranulesOrCwic = decodeHelp(params, 'hasGranulesOrCwic')
  collectionQuery.keyword = decodeHelp(params, 'keywordSearch')
  collectionQuery.onlyEosdisCollections = decodeHelp(params, 'onlyEosdisCollections')
  collectionQuery.overrideTemporal = decodeHelp(params, 'overrideTemporalSearch')
  collectionQuery.spatial = spatial
  collectionQuery.sortKey = decodeCollectionSortKey(params)
  collectionQuery.tagKey = decodeHelp(params, 'tagKey')
  collectionQuery.temporal = decodeHelp(params, 'temporalSearch')

  // Initialize the collection granule query
  const granuleQuery = {
    pageNum: 1
  }

  if (focusedCollection) {
    const { byId = {} } = collectionQuery
    const { [focusedCollection]: focusedCollectionQuery = {} } = byId
    const { granules: focusedCollectionGranuleQuery = {} } = focusedCollectionQuery

    collectionQuery.byId = {
      ...collectionQuery.byId,
      [focusedCollection]: {
        ...focusedCollectionQuery,
        granules: {
          ...focusedCollectionGranuleQuery,
          ...granuleQuery
        }
      }
    }
  }

  const timeline = decodeTimeline(params)

  const featureFacets = decodeHelp(params, 'featureFacets')
  const granuleDataFormats = decodeHelp(params, 'granuleDataFormatFacets')
  const instruments = decodeHelp(params, 'instrumentFacets')
  const organizations = decodeHelp(params, 'organizationFacets')
  const processingLevels = decodeHelp(params, 'processingLevelFacets')
  const projects = decodeHelp(params, 'projectFacets')
  const twoDCoordinateSystemName = decodeHelp(params, 'twoDCoordinateSystemNameFacets')
  const horizontalDataResolutionRange = decodeHelp(params, 'horizontalDataResolutionRangeFacets')
  const scienceKeywords = decodeScienceKeywords(params)
  const platforms = decodePlatforms(params)
  const latency = decodeHelp(params, 'latency')

  const cmrFacets = {
    data_center_h: organizations,
    instrument_h: instruments,
    granule_data_format_h: granuleDataFormats,
    platforms_h: platforms,
    processing_level_id_h: processingLevels,
    project_h: projects,
    science_keywords_h: scienceKeywords,
    two_d_coordinate_system_name: twoDCoordinateSystemName,
    horizontal_data_resolution_range: horizontalDataResolutionRange,
    latency
  }

  const shapefile = {
    shapefileId: decodeHelp(params, 'shapefileId'),
    selectedFeatures: decodeHelp(params, 'selectedFeatures')
  }

  const selectedRegion = decodeselectedRegion(params)

  const earthdataEnvironment = decodeHelp(params, 'earthdataEnvironment')
  const portalId = decodePortal(params)
  const nlpQuery = decodeHelp(params, 'nlpSearch')

  return {
    earthdataEnvironment,
    cmrFacets,
    metadata,
    featureFacets,
    focusedCollection,
    focusedGranule,
    deprecatedUrlParams,
    mapView,
    portalId,
    project,
    query: {
      ...query,
      collection: collectionQuery,
      nlpCollection: nlpQuery ? { query: nlpQuery } : null
    },
    selectedRegion,
    shapefile,
    timeline
  }
}

/**
 * Given a set of React Component Props, returns a URL path with URL encoded parameter string
 * @param {Object} props React Props
 * @return {String} URL encoded parameter string
 */
export const encodeUrlQuery = (props) => {
  // All of the collections query props are contained within collectionsQuery, but the logic for encoding
  // the URL params is based on the individual props. So, pull those out and build the 'allProps' object
  // to encode the URL
  const { collectionsQuery: collectionsQueryProps = {} } = props
  const {
    spatial = {},
    hasGranulesOrCwic,
    keyword: keywordSearch,
    onlyEosdisCollections,
    overrideTemporal: overrideTemporalSearch,
    sortKey,
    tagKey,
    temporal: temporalSearch
  } = collectionsQueryProps
  const {
    boundingBox: boundingBoxSearch,
    circle: circleSearch,
    line: lineSearch,
    point: pointSearch,
    polygon: polygonSearch
  } = spatial

  const allProps = {
    ...props,
    boundingBoxSearch,
    circleSearch,
    collectionSortKey: sortKey,
    hasGranulesOrCwic,
    keywordSearch,
    lineSearch,
    onlyEosdisCollections,
    overrideTemporalSearch,
    pointSearch,
    polygonSearch,
    tagKey,
    temporalSearch
  }

  const query = {}

  Object.keys(urlDefs).forEach((longKey) => {
    const { shortKey } = urlDefs[longKey]
    const value = urlDefs[longKey].encode(allProps[longKey])

    query[shortKey] = value
  })

  const mapParams = encodeMap(allProps.mapView, allProps.mapPreferences)
  const scienceKeywordQuery = encodeScienceKeywords(allProps.scienceKeywordFacets)
  const platformQuery = encodePlatforms(allProps.platformFacets)
  const collectionsQuery = encodeCollections(allProps)
  const timelineQuery = encodeTimeline(allProps.timelineQuery, allProps.pathname)
  const selectedRegion = encodeselectedRegion(allProps.selectedRegion)
  const portalQuery = encodePortal(allProps.portalId)
  const collectionSortKey = encodeCollectionSortKey(
    allProps.collectionSortKey,
    allProps.collectionSortPreference
  )

  const encodedQuery = {
    ...portalQuery,
    ...collectionsQuery,
    ...query,
    ...timelineQuery,
    ...scienceKeywordQuery,
    ...platformQuery,
    ...selectedRegion,
    ...mapParams,
    ...collectionSortKey
  }

  const paramString = stringify(encodedQuery)

  // Return the full pathname + paramString
  const { pathname } = allProps
  const fullPath = pathname + paramString

  return fullPath
}

/**
 * URLs that don't use URL params
 * The saved projects page needs to be handled a little differently
 * because it shares the base url with the projects page.
 *
 * `/projects` is not here because it is possible to have parameters on that path
 * that trigger the redirect to `/project`
 */
export const urlPathsWithoutUrlParams = [
  new RegExp(`^${routes.ADMIN}`),
  new RegExp(`^${routes.AUTH_CALLBACK}`),
  new RegExp(`^${routes.CONTACT_INFO}`),
  new RegExp(`^${routes.DOWNLOADS}`),
  new RegExp(`^${routes.PREFERENCES}`),
  new RegExp(`^${routes.SUBSCRIPTIONS}`),
  new RegExp(`^${routes.PROJECTS}`)
]

/**
 * Is the given location the Saved Projects page
 * @param {Object} location Page location
 */
export const isSavedProjectsPage = (location) => {
  const { pathname, search } = location

  return isPath(pathname, [routes.PROJECTS]) && search === ''
}
