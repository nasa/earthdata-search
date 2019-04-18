import qs from 'qs'
import cleanDeep from 'clean-deep'

import { decodeMap, encodeMap } from './mapEncoders'
import { decodeString, encodeString } from './stringEncoders'
import { decodeTemporal, encodeTemporal } from './temporalEncoders'
import { decodeTimeline, encodeTimeline } from './timelineEncoders'

/**
 * Takes a URL containing a path and query string and returns only the query string
 * @param {string} url - A string containing both a path and query string
 * @return {string} A string containing only query parameter values
 */
export const queryParamsFromUrlString = url => url.split(/[?#]/)[1]


/**
 * Mapping of URL Shortened Keys to their redux store keys
 */
const urlDefs = {
  focusedCollection: { shortKey: 'p', encode: encodeString, decode: decodeString },
  keywordSearch: { shortKey: 'q', encode: encodeString, decode: decodeString },
  pointSearch: { shortKey: 'sp', encode: encodeString, decode: decodeString },
  boundingBoxSearch: { shortKey: 'sb', encode: encodeString, decode: decodeString },
  polygonSearch: { shortKey: 'polygon', encode: encodeString, decode: decodeString },
  map: { shortKey: 'm', encode: encodeMap, decode: decodeMap },
  temporalSearch: { shortKey: 'qt', encode: encodeTemporal, decode: decodeTemporal },
  timeline: { shortKey: 'tl', encode: encodeTimeline, decode: decodeTimeline }
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
  const params = qs.parse(paramString, { ignoreQueryPrefix: true })

  // build the param object based on the structure in the redux store
  // e.g. map is store separately from query
  const focusedCollection = {}
  focusedCollection.collectionId = decodeHelp(params, 'focusedCollection')

  const map = decodeHelp(params, 'map')

  const query = {}
  query.keyword = decodeHelp(params, 'keywordSearch')
  query.temporal = decodeHelp(params, 'temporalSearch')

  const spatial = {}
  spatial.point = decodeHelp(params, 'pointSearch')
  spatial.boundingBox = decodeHelp(params, 'boundingBoxSearch')
  spatial.polygon = decodeHelp(params, 'polygonSearch')
  query.spatial = spatial

  const timeline = decodeHelp(params, 'timeline')

  return {
    focusedCollection,
    map,
    query,
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

  // endcode query as a URL string
  const paramString = qs.stringify(cleanDeep(query), { addQueryPrefix: true })

  // return the full pathname + paramString
  const { pathname } = props
  const fullPath = pathname + paramString
  return fullPath
}
