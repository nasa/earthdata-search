import spatialTypes from '../../constants/spatialTypes'
import useEdscStore from '../../zustand/useEdscStore'

/**
* Get the current keyword from the state.
* @param {Object} state - The current Redux state.
* @returns {String} The current keyword.
*/
export const computeKeyword = (state) => {
  const { query } = state
  const { collection } = query
  const { keyword } = collection
  if (keyword) return keyword

  return null
}

/**
* Get the current spatial type from the state.
* @param {Object} state - The current Redux state.
* @returns {String} The current spatial type.
*/
export const computeSpatialType = (state) => {
  const { query } = state
  const { collection } = query
  const { spatial } = collection
  const {
    boundingBox,
    circle,
    polygon,
    point
  } = spatial
  if (boundingBox) return spatialTypes.BOUNDING_BOX
  if (circle) return spatialTypes.CIRCLE
  if (polygon) return spatialTypes.POLYGON
  if (point) return spatialTypes.POINT

  return null
}

/**
* Get the current temporal type from the state.
* @param {Object} state - The current Redux state.
* @returns {String} The current temporal type.
*/
export const computeTemporalType = (state) => {
  const { query } = state
  const { collection } = query
  const { temporal } = collection
  if (temporal) {
    // TODO: Set up recurring temporal
    if (temporal.recurring) return 'Recurring Temporal'
    if (temporal.startDate || temporal.endDate) return 'Standard Temporal'
  }

  return null
}

/**
* Get the current focused collection from the state.
* @param {Object} state - The current Redux state.
* @returns {String} The current focused collection id.
*/
export const computeCollectionsViewed = (state) => {
  const { focusedCollection } = state

  if (focusedCollection) return focusedCollection

  return null
}

/**
* Get the last collection added from the state.
* @param {Object} state - The current Redux state.
* @returns {String} The id of the last collection added.
*/
export const computeCollectionsAdded = (state) => {
  const { project } = state
  const { collections: projectCollections } = project
  const { allIds } = projectCollections

  if (allIds.length) return allIds[allIds.length - 1]

  return null
}

/**
* Get the facet information from the state.
* @returns {String} The currently applied facets.
*/
export const computeFacets = () => {
  const { facetParams } = useEdscStore.getState()
  const {
    featureFacets: featureParams = {},
    cmrFacets: cmrParams = {}
  } = facetParams

  const facets = []

  if (featureParams.availableInEarthdataCloud) facets.push('features/Aavailable In Earthdata Cloud')
  if (featureParams.mapImagery) facets.push('features/Map Imagery')
  if (featureParams.customizable) facets.push('features/Customizable')

  const cmrFacetKeys = [
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

  const keywordLevels = [
    'topic',
    'term',
    'variable_level_1',
    'variable_level_2',
    'variable_level_3',
    'detailed_variable'
  ]

  const platformLevels = [
    'basis',
    'category',
    'sub_category',
    'short_name'
  ]

  cmrFacetKeys.forEach((cmrFacetName) => {
    const facetNameWithoutH = cmrFacetName.replace(/_h$/, '')
    const facetValue = cmrParams[cmrFacetName]

    if (cmrFacetName === 'science_keywords_h' && (facetValue && facetValue.length)) {
      facetValue.forEach(((keyword) => {
        keywordLevels.forEach((keywordLevel) => {
          if (keyword[keywordLevel]) facets.push(`${keywordLevel}/${keyword[keywordLevel]}`)
        })
      }))
    } else if (cmrFacetName === 'platforms_h' && (facetValue && facetValue.length)) {
      facetValue.forEach(((platform) => {
        platformLevels.forEach((platformLevel) => {
          if (platform[platformLevel]) facets.push(`${platformLevel}/${platform[platformLevel]}`)
        })
      }))
    } else if (facetValue && facetValue.length) {
      facetValue.forEach(((facet) => {
        facets.push(`${facetNameWithoutH}/${facet}`)
      }))
    }
  })

  if (facets.length) return `${facets.join(' ')} `

  return null
}
