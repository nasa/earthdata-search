import qs from 'qs'
import { camelCase } from 'lodash'
import { isNumber } from './is-number'
import { queryParamsFromUrlString } from './url/url'


/**
 * Counts the selected facets in a facet group provided from CMR.
 * @param {object} groupToCheck - An object representing the facet to be checked.
 * @param {number} startingValue - A number representing the number from which to start counting.
 * @return {number} The number of selected facets within the provided facet group.
 */
export const countSelectedFacets = (groupToCheck, startingValue = 0) => {
  let totalSelectedFacets = 0
  let selected = []

  if (groupToCheck.children && groupToCheck.children.length) {
    selected = groupToCheck.children.filter(child => child.applied)
  }

  selected.forEach((selectedFacet) => {
    totalSelectedFacets = countSelectedFacets(selectedFacet, selected.length)
  })

  return startingValue + totalSelectedFacets
}

/**
 * Returns an array unique entries for the first letter of each facet's title. If the first letter
 * is a number, it will return '#'. This function does not count any children facets.
 * @param {object} groupToCheck - An object representing the facet to be checked.
 * @return {array} An array of the starting letters.
 */
export const getStartingLetters = (facets) => {
  const firstLetters = []
  facets.forEach((facet) => {
    let firstLetter = facet.title[0].toUpperCase()
    if (isNumber(firstLetter)) firstLetter = '#'
    if (!firstLetters.includes(firstLetter)) firstLetters.push(firstLetter)
  })
  return firstLetters
}


/**
 * Takes a facet and returns the arguments to be passed to it's changeHandler function.
 * @param {object} facet - The clicked facet.
 * @return {object} The arguments to be passed to the changeHandler function.
 */
export const generateFacetArgs = (facet) => {
  const link = {
    destination: null,
    title: facet.title
  }

  if (facet.type === 'group' || facet.type === 'filter') {
    link.destination = facet.links.apply ? facet.links.apply : facet.links.remove
  }

  return link
}

/**
 * The change handler for feature facets.
 * @param {object} e - An event object
 * @param {object} facetLinkInfo - The information for the clicked facet.
 * @param {object} onChangeHandler - The change handler to call.
 */
export const changeFeatureFacet = (e, facetLinkInfo, onChangeHandler) => {
  const { title } = facetLinkInfo
  const { checked } = e.target

  onChangeHandler({ [camelCase(title)]: checked })
}

/**
 * The change handler for CMR facets.
 * @param {object} e - An event object
 * @param {object} facetLinkInfo - The information for the clicked facet.
 * @param {object} onChangeHandler - The change handler to call.
 */
export const changeCmrFacet = (e, facetLinkInfo, onChangeHandler) => {
  const newParams = qs.parse(queryParamsFromUrlString(facetLinkInfo.destination))

  const paramsToSend = {
    data_center_h: newParams.data_center_h,
    instrument_h: newParams.instrument_h,
    platform_h: newParams.platform_h,
    processing_level_id_h: newParams.processing_level_id_h,
    project_h: newParams.project_h,
    science_keywords_h: newParams.science_keywords_h
  }

  onChangeHandler(paramsToSend)
}

/**
 * The change handler for View All facets.
 * @param {object} e - An event object
 * @param {object} facetLinkInfo - The information for the clicked facet.
 * @param {object} onChangeHandler - The change handler to call.
 */
export const changeViewAllFacet = (e, facetLinkInfo, onChangeHandler) => {
  const newParams = qs.parse(queryParamsFromUrlString(facetLinkInfo.destination))

  const paramsToSend = {
    data_center_h: newParams.data_center_h,
    instrument_h: newParams.instrument_h,
    platform_h: newParams.platform_h,
    processing_level_id_h: newParams.processing_level_id_h,
    project_h: newParams.project_h,
    science_keywords_h: newParams.science_keywords_h
  }

  onChangeHandler(paramsToSend)
}

/**
 * Takes a facet category name and returns the corresponding CMR param.
 * @param {string} name - The facet category name.
 * @return {string} The matched CMR parameter name.
 */
export const categoryNameToCMRParam = (name) => {
  const categoryMap = {
    Keywords: 'science-keywords',
    Platforms: 'platform',
    Instruments: 'instrument',
    Organizations: 'data-center',
    Projects: 'project',
    'Processing levels': 'processing-level-id'
  }
  return categoryMap[name]
}

/**
 * Takes new CMR facet params from an action and returns an object to be used in a reducer
 * @param {object} newParams - An object containing the next facet params to set.
 * @return {object} An object with the values to be sent to a facets reducer.
 */
export const prepareCMRFacetPayload = newParams => ({
  data_center_h: newParams.data_center_h
    ? newParams.data_center_h
    : undefined,
  instrument_h: newParams.instrument_h
    ? newParams.instrument_h
    : undefined,
  platform_h: newParams.platform_h
    ? newParams.platform_h
    : undefined,
  processing_level_id_h: newParams.processing_level_id_h
    ? newParams.processing_level_id_h
    : undefined,
  project_h: newParams.project_h
    ? newParams.project_h
    : undefined,
  science_keywords_h: newParams.science_keywords_h
    ? newParams.science_keywords_h
    : undefined
})
