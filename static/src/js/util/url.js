import cleanDeep from 'clean-deep'
import { stringify, parse } from 'qs'


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
  p: 'focusedCollection',
  q: 'keywordSearch',
  sp: 'pointSearch',
  sb: 'boundingBoxSearch',
  polygon: 'polygonSearch',
  m: 'mapParam',
  qt: 'temporalSearch'
}


/**
 * Lookup a URL Shortened key in urlDefs given a long key name
 * @param {string} value Long version of a URL parameter key
 * @return {string} A shortened URL parameter key
 */
const getUrlShortKey = value => Object.keys(urlDefs).find(key => urlDefs[key] === value)


/**
 * Given a URL param string, returns an object that matches the redux store
 * @param {string} paramString a URL encoded parameter string
 * @return {object} An object of values that match the redux store
 */
export const decodeUrlParams = (paramString) => {
  // decode the paramString
  const params = parse(paramString, { ignoreQueryPrefix: true })

  // build the param object based on the structure in the redux store
  // e.g. map is store separately from query
  const focusedCollection = params[getUrlShortKey('focusedCollection')]
  const mapParam = params[getUrlShortKey('mapParam')]

  const query = {}
  query.keyword = params[getUrlShortKey('keywordSearch')]
  query.temporal = params[getUrlShortKey('temporalSearch')]

  const spatial = {}
  spatial.point = params[getUrlShortKey('pointSearch')]
  spatial.boundingBox = params[getUrlShortKey('boundingBoxSearch')]
  spatial.polygon = params[getUrlShortKey('polygonSearch')]
  query.spatial = spatial

  return {
    mapParam,
    query,
    focusedCollection
  }
}


/**
 * Given a set of React Component Props, returns a URL path with URL encoded parameter string
 * @param {object} props React Props
 * @return {string} URL encoded parameter string
 */
export const encodeUrlQuery = (props) => {
  const query = {}
  // Loop through each of the props, and if a short key exists for the prop
  // then add it to be encoded
  Object.keys(props).forEach((key) => {
    const shortKey = getUrlShortKey(key)
    if (shortKey) {
      query[shortKey] = props[key]
    }
  })

  // endcode query as a URL string
  const paramString = stringify(cleanDeep(query), { addQueryPrefix: true })

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

  return [stringify(indexedAttrs), stringify(nonIndexedAttrs, { indices: false })].join('&')
}
