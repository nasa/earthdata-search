import { encodeTemporal } from './url/temporalEncoders'
import { categoryNameToCMRParam } from './facets'
import { tagName } from '../../../../sharedUtils/tags'

/**
 * Prepare parameters used in getCollections() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in buildCollectionSearchParams
 */
export const prepareCollectionParams = (state) => {
  const {
    authToken,
    facetsParams = {},
    portal = {},
    query,
    searchResults = {}
  } = state

  const { collection: collectionQuery } = query

  const {
    gridName = '',
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
  if (featureFacets.customizable) tagKey.push(tagName('subset_service.*'))
  if (featureFacets.mapImagery) tagKey.push(tagName('gibs'))

  const { query: portalQuery = {} } = portal

  return {
    authToken,
    boundingBox,
    cmrFacets,
    featureFacets,
    gridName,
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
}

/**
 * Translates the values returned from prepareCollectionParams to the camelCased keys that are expected in
 * the collections.search() function
 * @param {object} params - Params to be passed to the collections.search() function.
 * @returns Parameters to be provided to the Collections request with camel cased keys
 */
export const buildCollectionSearchParams = (params) => {
  const {
    boundingBox,
    conceptId,
    cmrFacets,
    dataCenter,
    echoCollectionId,
    featureFacets,
    gridName,
    hasGranulesOrCwic,
    keyword,
    line,
    pageNum,
    point,
    polygon,
    project,
    sortKey: selectedSortKey,
    tagKey,
    temporalString,
    viewAllFacetsCategory,
    viewAllFacets
  } = params

  let facetsToSend = { ...cmrFacets }

  // If viewAllFacets has any keys, we know that the view all facets modal is active and we want to
  // detirmine the next results based on those facets.
  if (Object.keys(viewAllFacets).length) {
    facetsToSend = { ...viewAllFacets }
  }

  let twoDCoordinateSystem

  if (gridName) {
    twoDCoordinateSystem = {
      name: gridName
    }
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
    pageSize: 20,
    sortKey: ['has_granules_or_cwic', ...selectedSortKey]
  }

  return {
    ...defaultParams,
    boundingBox,
    collectionDataType: featureFacets.nearRealTime ? ['NEAR_REAL_TIME'] : undefined,
    concept_id: conceptId,
    dataCenterH: facetsToSend.data_center_h,
    dataCenter,
    echoCollectionId,
    hasGranulesOrCwic,
    instrumentH: facetsToSend.instrument_h,
    keyword: keywordWithWildcard,
    line,
    pageNum,
    platformH: facetsToSend.platform_h,
    point,
    polygon,
    processingLevelIdH: facetsToSend.processing_level_id_h,
    projectH: facetsToSend.project_h,
    project,
    scienceKeywordsH: facetsToSend.science_keywords_h,
    tagKey,
    temporal: temporalString,
    twoDCoordinateSystem,
    facetsSize: viewAllFacetsCategory
      ? { [categoryNameToCMRParam(viewAllFacetsCategory)]: 10000 }
      : undefined
  }
}
