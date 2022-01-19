import { convertSize } from './project'
import { encodeGridCoords } from './url/gridEncoders'
import { encodeTemporal } from './url/temporalEncoders'
import { getEarthdataConfig, getApplicationConfig } from '../../../../sharedUtils/config'
import { withAdvancedSearch } from './withAdvancedSearch'
import { getOpenSearchOsddLink } from './getOpenSearchLink'

/**
 * Populate granule payload used to update the store
 * @param {String} collectionId
 * @param {Boolean} isOpenSearch
 * @param {Object} response
 * @returns {Object} Granule payload
 */
export const populateGranuleResults = ({
  collectionId,
  isOpenSearch,
  response
}) => {
  const payload = {}

  payload.collectionId = collectionId
  payload.results = response.data.feed.entry
  payload.isOpenSearch = isOpenSearch

  if (isOpenSearch) {
    payload.hits = response.data.feed.hits
  } else {
    payload.hits = parseInt(response.headers['cmr-hits'], 10)
  }

  let size = 0
  payload.results.forEach((granule) => {
    size += parseFloat(granule.granule_size || 0)
  })

  let singleGranuleSize = 0

  if (payload.hits > 0) {
    singleGranuleSize = size / payload.results.length

    const totalSize = singleGranuleSize * payload.hits
    payload.totalSize = convertSize(totalSize)
    payload.singleGranuleSize = singleGranuleSize
  } else {
    payload.totalSize = convertSize(0)
    payload.singleGranuleSize = 0
  }

  return payload
}

/**
 * Extract granule parameters specific to the users search session
 * @param {Object} state Current Redux State
 * @param {String} collectionId The collection id the user has requested to view granules for
 */
export const extractGranuleSearchParams = (state, collectionId) => {
  const {
    advancedSearch = {},
    query = {}
  } = state

  const {
    collection: collectionsQuery
  } = query

  const {
    byId: collectionQueryById = {},
    spatial = {},
    overrideTemporal = {},
    temporal = {}
  } = collectionsQuery

  const {
    boundingBox,
    circle,
    point,
    polygon,
    line
  } = spatial

  const { [collectionId]: collectionQuery = {} } = collectionQueryById
  const { granules: collectionGranuleQuery = {} } = collectionQuery

  const {
    browseOnly,
    cloudCover,
    dayNightFlag,
    equatorCrossingDate = {},
    equatorCrossingLongitude,
    excludedGranuleIds = [],
    gridCoords,
    onlineOnly,
    orbitNumber,
    pageNum = 1,
    readableGranuleName,
    sortKey,
    temporal: granuleTemporal = {},
    tilingSystem
  } = collectionGranuleQuery

  const granuleParams = {
    boundingBox,
    browseOnly,
    circle,
    cloudCover,
    collectionId,
    dayNightFlag,
    equatorCrossingDate,
    equatorCrossingLongitude,
    excludedGranuleIds,
    granuleTemporal,
    gridCoords,
    line,
    onlineOnly,
    orbitNumber,
    overrideTemporal,
    pageNum,
    point,
    polygon,
    readableGranuleName,
    sortKey,
    temporal,
    tilingSystem
  }

  // Apply any overrides for advanced search
  const paramsWithAdvancedSearch = withAdvancedSearch(granuleParams, advancedSearch)

  return paramsWithAdvancedSearch
}

/**
 * Extract granule parameters specific to the users current project
 * @param {Object} state Current Redux State
 * @param {String} collectionId The collection id the user has requested to view granules for
 */
export const extractProjectCollectionGranuleParams = (state, collectionId) => {
  const {
    project
  } = state

  const { collections } = project
  const { byId } = collections
  const { [collectionId]: projectCollection } = byId
  const { granules } = projectCollection
  const { addedGranuleIds, params = {}, removedGranuleIds } = granules
  const { pageNum } = params

  return {
    // Ensure that the `generic` search params are also included
    ...extractGranuleSearchParams(state, collectionId),
    addedGranuleIds,
    pageNum,
    removedGranuleIds
  }
}

/**
 * Prepare parameters used in retrieving granules based on current Redux State,
 * or provided project collection
 * @param {Object} state Current Redux State
 * @param {String} projectCollectionId Optional: CollectionId of a Project collection
 * @returns {Object} Parameters used in Granules request
 */
export const prepareGranuleParams = (collectionMetadata, granuleParams) => {
  // Default added and removed granuld ids because they will only be provided for project granule requests
  const {
    addedGranuleIds = [],
    boundingBox,
    browseOnly,
    circle,
    cloudCover,
    collectionId,
    dayNightFlag,
    equatorCrossingDate,
    equatorCrossingLongitude,
    excludedGranuleIds = [],
    granuleTemporal,
    gridCoords,
    line,
    onlineOnly,
    orbitNumber,
    overrideTemporal,
    pageNum = 1,
    point,
    polygon,
    readableGranuleName,
    removedGranuleIds = [],
    sortKey,
    temporal,
    tilingSystem
  } = granuleParams

  const exclude = {}
  if (excludedGranuleIds.length > 0 || removedGranuleIds.length > 0) {
    // Concatenate both lists of concept ids that designate granlues to be excluded
    const granulesToExclude = [
      ...excludedGranuleIds,
      ...removedGranuleIds
    ]
    exclude.concept_id = []
    exclude.concept_id.push(...granulesToExclude)
  }

  const conceptId = []
  if (addedGranuleIds.length > 0) {
    conceptId.push(...addedGranuleIds)
  }

  // If we have an overrideTemporal use it, if not use temporal
  let temporalString
  const {
    endDate: filterEnd,
    startDate: filterStart
  } = granuleTemporal

  const {
    endDate: overrideEnd,
    startDate: overrideStart
  } = overrideTemporal

  const encodeCloudCover = (val = {}) => {
    if (val.min || val.max) {
      return `${val.min || ''},${val.max || ''}`
    }

    return undefined
  }

  const cloudCoverString = encodeCloudCover(cloudCover)

  if (filterStart || filterEnd) {
    temporalString = encodeTemporal(granuleTemporal)
  } else if (overrideEnd || overrideStart) {
    temporalString = encodeTemporal(overrideTemporal)
  } else {
    temporalString = encodeTemporal(temporal)
  }

  const isOpenSearch = !!getOpenSearchOsddLink(collectionMetadata)

  const options = {}
  if (readableGranuleName) {
    options.readableGranuleName = { pattern: true }
  }

  options.spatial = { or: true }

  return {
    boundingBox,
    conceptId,
    circle,
    browseOnly,
    cloudCover: cloudCoverString,
    collectionId,
    dayNightFlag,
    equatorCrossingDate: encodeTemporal(equatorCrossingDate),
    equatorCrossingLongitude,
    exclude,
    gridCoords: encodeGridCoords(gridCoords),
    isOpenSearch,
    line,
    onlineOnly,
    openSearchOsdd: getOpenSearchOsddLink(collectionMetadata),
    options,
    orbitNumber,
    pageNum,
    point,
    polygon,
    readableGranuleName,
    sortKey,
    temporalString,
    tilingSystem
  }
}

/**
 * Translates the values returned from prepareGranuleParams to the camelCased keys that are expected in
 * the granules.search() function
 * @param {Object} params - Params to be passed to the granules.search() function.
 * @param {Object} opts - An optional options object.
 * @returns {Object} Parameters to be provided to the Granules request with camel cased keys
 */
export const buildGranuleSearchParams = (params) => {
  const { defaultCmrPageSize } = getApplicationConfig()

  const {
    boundingBox,
    browseOnly,
    circle,
    cloudCover,
    collectionId,
    conceptId,
    dayNightFlag,
    equatorCrossingDate,
    equatorCrossingLongitude,
    exclude,
    gridCoords,
    line,
    onlineOnly,
    openSearchOsdd,
    options,
    orbitNumber,
    pageNum,
    point,
    polygon,
    readableGranuleName,
    sortKey,
    temporalString,
    tilingSystem
  } = params

  let twoDCoordinateSystem = {}

  if (tilingSystem) {
    twoDCoordinateSystem = {}
    twoDCoordinateSystem.name = tilingSystem

    if (gridCoords) twoDCoordinateSystem.coordinates = gridCoords
  }

  const granuleParams = {
    boundingBox,
    circle,
    conceptId,
    browseOnly,
    cloudCover,
    dayNightFlag,
    echoCollectionId: collectionId,
    equatorCrossingDate,
    equatorCrossingLongitude,
    exclude,
    line,
    onlineOnly,
    openSearchOsdd,
    options,
    orbitNumber,
    pageNum,
    pageSize: defaultCmrPageSize,
    point,
    polygon,
    readableGranuleName,
    sortKey,
    temporal: temporalString,
    twoDCoordinateSystem
  }

  return granuleParams
}

/**
 * Create the ECHO10 Metadata URLs using the granule concept ID
 * @param {String} granuleId The granule ID
 * @returns {Object} An object containing the various URLs
 */
export const createEcho10MetadataUrls = (granuleId, earthdataEnvironment) => {
  // TODO: This should eventually support authentication by appending the token information @high
  const metadataUrlTypes = [
    { ext: 'atom', title: 'ATOM' },
    { ext: 'echo10', title: 'ECHO 10' },
    { ext: 'iso19115', title: 'ISO 19115' },
    { ext: 'native', title: 'Native' },
    { ext: 'umm_json', title: 'UMM-G' }
  ]

  const metadataUrls = {}

  const { cmrHost } = getEarthdataConfig(earthdataEnvironment)

  // Set a key for each URL type and append the display title and href. 'native' does not
  // use an extension on the href so we omit it.
  metadataUrlTypes.forEach((type) => {
    metadataUrls[type.ext] = {
      title: type.title,
      href: `${cmrHost}/search/concepts/${granuleId}${type.ext !== 'native' ? `.${type.ext}` : ''}`
    }
  })

  return metadataUrls
}

/**
 * Determines if a given link is a data link.
 * A link is a data link if it has data in the rel property and it is not inherited.
 * @param {Object} link An individual link object from granule metadata
 * @param {String} type 'http' or 'ftp'
 * @returns {Boolean}
 */
export const isDataLink = (link, type) => {
  const {
    href,
    inherited = false,
    rel
  } = link

  return href.indexOf(type) !== -1
    && rel.indexOf('/data#') !== -1
    && inherited !== true
}

/**
 * Determines if a given link is a data link.
 * A link is a data link if it has data in the rel property and it is not inherited.
 * @param {Object} link An individual link object from granule metadata
 * @param {String} type 'http' or 'ftp'
 * @returns {Boolean}
 */
export const isS3Link = (link) => {
  const { rel } = link

  return rel.indexOf('/s3#') !== -1
}

/**
 * Given a list of granule metadata links, filters out those links that are not data links
 * prefering http over ftp for duplicate filenames
 * @param {Array} links List of links from granule metadata
 * @returns {Array} List of data links filtered from input links
 */
export const createDataLinks = (links = []) => {
  // All 'http' data links
  const httpDataLinks = links.filter((link) => isDataLink(link, 'http'))

  // Strip filenames from httpDataLinks
  const filenames = httpDataLinks.map((link) => link.href.substr(link.href.lastIndexOf('/') + 1).replace('.html', ''))

  // Find any 'ftp' data links that have filenames not already included with 'http' links
  const ftpLinks = links.filter((link) => {
    const { href } = link

    const filename = href.substr(href.lastIndexOf('/') + 1)

    return isDataLink(link, 'ftp') && filenames.indexOf(filename) === -1
  })

  // Return http and ftp data links with a unique list of filenames, prefering http
  return [
    ...httpDataLinks,
    ...ftpLinks
  ]
}

/**
 * Given a list of granule metadata links, filters out those links that are not s3 links
 * @param {Array} links List of links from granule metadata
 * @returns {Array} List of s3 links filtered from input links
 */
export const createS3Links = (links = []) => links.filter((link) => isS3Link(link))

/**
* Pull out download links from within the granule metadata
* @param {Array} granules search result for granules that a user has asked to download
* @returns {Array} All relevant urls for downloadable granules
*/
export const getDownloadUrls = (granules) => {
  // Iterate through each granule search result to pull out relevant links
  const urlArrays = granules.map((granuleMetadata) => {
    const { links: linkMetadata = [] } = granuleMetadata

    // Find the correct link from the list within the metadata
    return linkMetadata.filter((link) => {
      const { inherited, rel } = link
      return rel.includes('/data#') && !inherited
    })
  }).filter(Boolean)

  // `filter` returns an array so we'll end up with an array of arrays so we
  // need to flatten the result before we return it
  return [].concat(...urlArrays)
}

/**
* Pull out S3 links from within the granule metadata
* @param {Array} granules search result for granules that a user has asked to download
* @returns {Array} All relevant s3 paths for downloadable granules
*/
export const getS3Urls = (granules) => {
  // Iterate through each granule search result to pull out relevant links
  const urlArrays = granules.map((granuleMetadata) => {
    const { links: linkMetadata = [] } = granuleMetadata

    // Find the correct link from the list within the metadata
    return createS3Links(linkMetadata)
  }).filter(Boolean)

  // `filter` returns an array so we'll end up with an array of arrays so we
  // need to flatten the result before we return it
  return [].concat(...urlArrays)
}
