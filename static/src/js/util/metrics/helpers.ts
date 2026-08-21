import spatialTypes from '../../constants/spatialTypes'
import { pruneSpatial } from '../pruneSpatial'
import { getCollectionId } from '../../zustand/selectors/collection'
import { getProjectCollectionsIds } from '../../zustand/selectors/project'
import {
  getCollectionsQuery,
  getCollectionsQuerySpatial,
  getCollectionsQueryTemporal
} from '../../zustand/selectors/query'
import useEdscStore from '../../zustand/useEdscStore'
import { CMRFacetsParams, PlatformFacet } from '../../zustand/types'
import { ScienceKeyword } from '../../types/sharedTypes'

/**
* Get the current keyword from the state.
* @returns {String} The current keyword.
*/
export const computeKeyword = () => {
  const collectionQuery = getCollectionsQuery(useEdscStore.getState())
  const { keyword } = collectionQuery

  if (keyword) return keyword

  return null
}

/**
* Get the current spatial type from the state.
* @returns {String} The current spatial type.
*/
export const computeSpatialType = () => {
  const spatialQuery = getCollectionsQuerySpatial(useEdscStore.getState())
  const {
    boundingBox,
    circle,
    line,
    polygon,
    point
  } = pruneSpatial(spatialQuery)

  if (boundingBox) return spatialTypes.BOUNDING_BOX
  if (circle) return spatialTypes.CIRCLE
  if (line) return spatialTypes.LINE
  if (polygon) return spatialTypes.POLYGON
  if (point) return spatialTypes.POINT

  return null
}

/**
* Get the current temporal type from the state.
* @returns {String} The current temporal type.
*/
export const computeTemporalType = () => {
  const temporalQuery = getCollectionsQueryTemporal(useEdscStore.getState())

  if (temporalQuery) {
    // TODO: Set up recurring temporal
    if (temporalQuery.recurring) return 'Recurring Temporal'
    if (temporalQuery.startDate || temporalQuery.endDate) return 'Standard Temporal'
  }

  return null
}

/**
* Get the current focused collection from the state.
* @returns {String} The current focused collection id.
*/
export const computeCollectionsViewed = () => {
  const focusedCollection = getCollectionId(useEdscStore.getState())

  if (focusedCollection) return focusedCollection

  return null
}

/**
* Get the last collection added from the state.
* @returns {String} The id of the last collection added.
*/
export const computeCollectionsAdded = () => {
  const projectCollectionsIds = getProjectCollectionsIds(useEdscStore.getState())

  if (projectCollectionsIds.length) return projectCollectionsIds[projectCollectionsIds.length - 1]

  return null
}

/**
* Get the facet information from the state.
* @returns {String} The currently applied facets.
*/
export const computeFacets = () => {
  const { facetParams } = useEdscStore.getState()
  const {
    featureFacets: featureParams,
    cmrFacets: cmrParams
  } = facetParams

  const facets = []

  if (featureParams.availableInEarthdataCloud) facets.push('features/Aavailable In Earthdata Cloud')
  if (featureParams.mapImagery) facets.push('features/Map Imagery')
  if (featureParams.customizable) facets.push('features/Customizable')

  const cmrFacetKeys: (keyof CMRFacetsParams)[] = [
    'science_keywords_h',
    'platforms_h',
    'instrument_h',
    'data_center_h',
    'project_h',
    'processing_level_id_h',
    'granule_data_format_h',
    'two_d_coordinate_system_name',
    'horizontal_data_resolution_range',
    'latency'
  ]

  const keywordLevels: (keyof ScienceKeyword)[] = [
    'topic',
    'term',
    'variable_level_1',
    'variable_level_2',
    'variable_level_3',
    'detailed_variable'
  ]

  const platformLevels: (keyof PlatformFacet)[] = [
    'basis',
    'category',
    'sub_category',
    'short_name'
  ]

  cmrFacetKeys.forEach((cmrFacetName) => {
    const facetNameWithoutH = cmrFacetName.replace(/_h$/, '')
    const facetValue = cmrParams[cmrFacetName]

    if (cmrFacetName === 'science_keywords_h' && Array.isArray(facetValue) && facetValue.length) {
      facetValue.forEach(((keyword: ScienceKeyword) => {
        keywordLevels.forEach((keywordLevel) => {
          if (keyword[keywordLevel]) facets.push(`${keywordLevel}/${keyword[keywordLevel]}`)
        })
      }))
    } else if (cmrFacetName === 'platforms_h' && Array.isArray(facetValue) && facetValue.length) {
      facetValue.forEach(((platform: PlatformFacet) => {
        platformLevels.forEach((platformLevel) => {
          if (platform[platformLevel]) facets.push(`${platformLevel}/${platform[platformLevel]}`)
        })
      }))
    } else if (Array.isArray(facetValue) && facetValue.length) {
      facetValue.forEach(((facet) => {
        facets.push(`${facetNameWithoutH}/${facet}`)
      }))
    }
  })

  if (facets.length) return `${facets.join(' ')} `

  return null
}

// Bucket counts for granules for GA/GTM events

/**
 * Buckets a granule count into a coarse range string for GA/GTM analytics events.
 *
 * Grouping counts into ranges (rather than sending exact values) keeps event
 * cardinality low while still conveying rough scale.
 *
 * @param count - The number of granules to bucket.
 * @returns A string representing the bucket range, e.g. '0', '1-20', '21-40',
 *          '41-60', '61-100', or '100+'.
 */
export const computeBucketGranuleCount = (count: number): string => {
  if (count === 0) return '0'
  if (count <= 20) return '1-20'
  // Do the first few pages as bucket
  if (count <= 40) return '21-40'
  if (count <= 60) return '41-60'
  if (count <= 100) return '61-100'

  return '100+'
}

/**
 * Computes the value at a given quantile (percentile) from an array of render times.
 *
 * Uses the nearest-rank method: sorts are assumed to already be applied by the
 * caller (the array is used in its given order), and the index is computed by
 * rounding up `length * quantile` to the nearest rank, then clamped to the
 * last valid index.
 *
 * @param renderTimes - Array of render time values (expected to be sorted ascending).
 * @param quantile - The quantile to compute, expressed as a fraction between 0 and 1
 *                    (e.g. 0.95 for the 95th percentile).
 * @returns The render time value at the computed quantile, rounded to the nearest integer.
 */
export const computePercentile = (renderTimes: number[], quantile: number) => {
  const index = Math.min(
    Math.ceil(renderTimes.length * quantile) - 1,
    renderTimes.length - 1
  )

  return Math.round(renderTimes[index])
}
