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
    polygon,
    point
  } = spatial
  if (boundingBox) return 'Bounding Box'
  if (polygon) return 'Polygon'
  if (point) return 'Point'
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
* @param {Object} state - The current Redux state.
* @returns {String} The currently applied facets.
*/
export const computeFacets = (state) => {
  const { facetsParams } = state
  const {
    feature: featureParams = {},
    cmr: cmrParams = {}
  } = facetsParams

  const facets = []

  if (featureParams.mapImagery) facets.push('features/Map Imagery')
  if (featureParams.nearRealTime) facets.push('features/Near Real Time')
  if (featureParams.customizable) facets.push('features/Customizable')

  const cmrFacetKeys = [
    'category',
    'data_center',
    'project',
    'platform',
    'instrument',
    'processing_level_id',
    'science_keywords'
  ]

  const keywordLevels = [
    'topic',
    'term',
    'variable_level_1',
    'variable_level_2',
    'variable_level_3',
    'detailed_variable'
  ]

  cmrFacetKeys.forEach((cmrFacet) => {
    const facetName = `${cmrFacet}_h`
    if (cmrFacet === 'science_keywords' && (cmrParams[facetName] && cmrParams[facetName].length)) {
      cmrParams[facetName].forEach(((keyword) => {
        keywordLevels.forEach((keywordLevel) => {
          if (keyword[keywordLevel]) facets.push(`${keywordLevel}/${keyword[keywordLevel]}`)
        })
      }))
    } else if (cmrParams[facetName] && cmrParams[facetName].length) {
      cmrParams[facetName].forEach(((facet) => {
        facets.push(`${cmrFacet}/${facet}`)
      }))
    }
  })

  if (facets.length) return `${facets.join(' ')} `
  return null
}
