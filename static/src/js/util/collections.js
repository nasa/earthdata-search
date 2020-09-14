import { isEmpty } from 'lodash'
import { categoryNameToCMRParam } from './facets'
import { encodeTemporal } from './url/temporalEncoders'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { tagName } from '../../../../sharedUtils/tags'
import { autocompleteFacetsMap } from './autocompleteFacetsMap'

/**
 * Takes the current CMR collection params and applies any changes needed to account
 * for the current advanced search state.
 * @param {Object} collectionParams The current collection search params.
 * @param {Object} advancedSearch The current advanced search state params.
 * @returns {Object} Parameters used in prepareCollectionParams.
 */
export const withAdvancedSearch = (collectionParams, advancedSearch) => {
  const mergedParams = {
    ...collectionParams
  }

  const {
    regionSearch = {}
  } = advancedSearch

  const {
    selectedRegion = {}
  } = regionSearch

  // If we have a spatial value for the selectedRegion, use that for the spatial
  if (!isEmpty(selectedRegion) && selectedRegion.spatial) {
    mergedParams.polygon = selectedRegion.spatial
  }

  return mergedParams
}

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
    // gridName = '',
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
  if (featureFacets.customizable) {
    tagKey.push(tagName('subset_service.esi'))
    tagKey.push(tagName('subset_service.opendap'))
  }
  if (featureFacets.mapImagery) tagKey.push(tagName('gibs'))

  const { query: portalQuery = {} } = portal

  const collectionParams = {
    authToken,
    boundingBox,
    circle,
    cmrFacets,
    featureFacets,
    // gridName,
    hasGranulesOrCwic,
    keyword,
    line,
    pageNum,
    point,
    polygon,
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
    sortKey: selectedSortKey,
    spatialKeyword,
    tagKey,
    temporalString,
    viewAllFacets,
    viewAllFacetsCategory
  } = params

  console.log(params)

  let facetsToSend = { ...cmrFacets }

  // If viewAllFacets has any keys, we know that the view all facets modal is active and we want to
  // detirmine the next results based on those facets.
  if (Object.keys(viewAllFacets).length) {
    facetsToSend = { ...viewAllFacets }
  }

  // If there is a keyword, add the wildcard character between words and following the final character
  const keywordWithWildcard = !keyword ? undefined : `${keyword.replace(/\s+/g, '* ')}*`

  // Set up params that are not driven by the URL
  const defaultParams = {
    includeFacets: 'v2',
    includeGranuleCounts: true,
    includeHasGranules: true,
    includeTags: `${tagName('*', 'edsc.extra')},org.ceos.wgiss.cwic.granules.prod`,
    options: {
      science_keywords_h: {
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
    collectionDataType: featureFacets.nearRealTime ? ['NEAR_REAL_TIME'] : undefined,
    concept_id: conceptId,
    dataCenterH: facetsToSend.data_center_h,
    dataCenter,
    echoCollectionId,
    granuleDataFormat,
    granuleDataFormatH: facetsToSend.granule_data_format_h,
    hasGranulesOrCwic,
    instrument,
    instrumentH: facetsToSend.instrument_h,
    keyword: keywordWithWildcard,
    line,
    pageNum,
    platform,
    platformH: facetsToSend.platform_h,
    point,
    polygon,
    processingLevelIdH: facetsToSend.processing_level_id_h,
    projectH: facetsToSend.project_h,
    project,
    provider,
    scienceKeywordsH: facetsToSend.science_keywords_h,
    spatialKeyword,
    tagKey,
    temporal: temporalString,
    twoDCoordinateSystemName: facetsToSend.two_d_coordinate_system_name,
    facetsSize: viewAllFacetsCategory
      ? { [categoryNameToCMRParam(viewAllFacetsCategory)]: 10000 }
      : undefined
  }
}
