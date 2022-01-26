import { categoryNameToCMRParam } from './facets'
import { encodeTemporal } from './url/temporalEncoders'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { tagName } from '../../../../sharedUtils/tags'
import { autocompleteFacetsMap } from './autocompleteFacetsMap'
import { withAdvancedSearch } from './withAdvancedSearch'

/**
 * Prepare parameters used in getCollections() based on current Redux State
 * @param {Object} state Current Redux State
 * @returns {Object} Parameters used in buildCollectionSearchParams
 */
export const prepareCollectionParams = (state) => {
  const {
    autocomplete = {},
    advancedSearch = {},
    authToken,
    facetsParams = {},
    portal = {},
    query = {
      collection: {}
    },
    searchResults = {}
  } = state

  const { collection: collectionQuery } = query

  const {
    hasGranulesOrCwic,
    keyword,
    overrideTemporal = {},
    pageNum,
    sortKey = [],
    spatial = {},
    tagKey: selectedTag,
    temporal = {}
  } = collectionQuery

  const {
    boundingBox,
    circle,
    line,
    point,
    polygon
  } = spatial

  const { viewAllFacets: viewAllFacetsSearchResults = {} } = searchResults
  const { selectedCategory: viewAllFacetsCategory } = viewAllFacetsSearchResults

  // If we have an overrideTemporal use it, if not use temporal
  let temporalString
  const {
    endDate: overrideEnd,
    startDate: overrideStart
  } = overrideTemporal
  if (overrideEnd && overrideStart) {
    temporalString = encodeTemporal(overrideTemporal)
  } else {
    temporalString = encodeTemporal(temporal)
  }

  const {
    cmr: cmrFacets = {},
    feature: featureFacets = {},
    viewAll: viewAllFacets = {}
  } = facetsParams

  const tagKey = []
  if (selectedTag) tagKey.push(selectedTag)

  const serviceType = []
  if (featureFacets.customizable) {
    serviceType.push('esi')
    serviceType.push('opendap')
    serviceType.push('harmony')
  }
  if (featureFacets.mapImagery) tagKey.push(tagName('gibs'))
  let cloudHosted
  if (featureFacets.availableFromAwsCloud) cloudHosted = true

  const { query: portalQuery = {} } = portal

  const collectionParams = {
    authToken,
    boundingBox,
    circle,
    cloudHosted,
    cmrFacets,
    featureFacets,
    hasGranulesOrCwic,
    keyword,
    line,
    pageNum,
    point,
    polygon,
    serviceType,
    sortKey,
    tagKey,
    temporalString,
    viewAllFacetsCategory,
    viewAllFacets,
    ...portalQuery
  }

  // Add the autocomplete selected parameters if the type is not a CMR Facet
  const { selected = [] } = autocomplete
  selected.forEach((param) => {
    const { type, value } = param

    if (!autocompleteFacetsMap[type]) {
      if (collectionParams[type]) {
        collectionParams[type].push(value)
      } else {
        collectionParams[type] = [value]
      }
    }
  })

  // Apply any overrides for advanced search
  const paramsWithAdvancedSearch = withAdvancedSearch(collectionParams, advancedSearch)

  return paramsWithAdvancedSearch
}

/**
 * Translates the values returned from prepareCollectionParams to the camelCased keys that are expected in
 * the collections.search() function
 * @param {Object} params - Params to be passed to the collections.search() function.
 * @returns {Object} Parameters to be provided to the Collections request with camel cased keys
 */
export const buildCollectionSearchParams = (params) => {
  const { defaultCmrPageSize } = getApplicationConfig()

  const {
    boundingBox,
    circle,
    cloudHosted,
    cmrFacets,
    conceptId,
    dataCenter,
    echoCollectionId,
    featureFacets,
    granuleDataFormat,
    hasGranulesOrCwic,
    instrument,
    keyword,
    line,
    pageNum,
    platform,
    point,
    polygon,
    project,
    provider,
    serviceType,
    sortKey: selectedSortKey,
    spatialKeyword,
    tagKey,
    temporalString,
    viewAllFacets,
    viewAllFacetsCategory
  } = params

  let facetsToSend = { ...cmrFacets }

  // If viewAllFacets has any keys, we know that the view all facets modal is active and we want to
  // detirmine the next results based on those facets.
  if (Object.keys(viewAllFacets).length) {
    facetsToSend = { ...viewAllFacets }
  }

  // If there is a keyword, add the wildcard character between words and following the final character
  // If the user types a quoted string, don't add the wildcard character
  let keywordWithWildcard
  if (keyword && keyword.match(/(".*")/)) {
    keywordWithWildcard = keyword
  } else if (keyword) {
    keywordWithWildcard = `${keyword.replace(/\s+/g, '* ')}*`
  }

  // Set up params that are not driven by the URL
  const defaultParams = {
    includeFacets: 'v2',
    includeGranuleCounts: true,
    includeHasGranules: true,
    includeTags: `${tagName('*', 'edsc')},opensearch.granule.osdd`,
    options: {
      science_keywords_h: {
        or: true
      },
      platforms_h: {
        or: true
      },
      spatial: {
        or: true
      },
      temporal: {
        limit_to_granules: true
      }
    },
    pageSize: defaultCmrPageSize,
    sortKey: ['has_granules_or_cwic', ...selectedSortKey]
  }

  return {
    ...defaultParams,
    boundingBox,
    circle,
    cloudHosted,
    collectionDataType: featureFacets.nearRealTime ? ['NEAR_REAL_TIME'] : undefined,
    concept_id: conceptId,
    dataCenterH: facetsToSend.data_center_h,
    dataCenter,
    echoCollectionId,
    granuleDataFormat,
    granuleDataFormatH: facetsToSend.granule_data_format_h,
    hasGranulesOrCwic,
    horizontalDataResolutionRange: facetsToSend.horizontal_data_resolution_range,
    instrument,
    instrumentH: facetsToSend.instrument_h,
    keyword: keywordWithWildcard,
    line,
    pageNum,
    platform,
    platformsH: facetsToSend.platforms_h,
    point,
    polygon,
    processingLevelIdH: facetsToSend.processing_level_id_h,
    projectH: facetsToSend.project_h,
    project,
    provider,
    scienceKeywordsH: facetsToSend.science_keywords_h,
    serviceType,
    spatialKeyword,
    tagKey,
    temporal: temporalString,
    twoDCoordinateSystemName: facetsToSend.two_d_coordinate_system_name,
    facetsSize: viewAllFacetsCategory
      ? { [categoryNameToCMRParam(viewAllFacetsCategory)]: 10000 }
      : undefined
  }
}
