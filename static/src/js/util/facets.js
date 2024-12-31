import qs from 'qs'
import { camelCase } from 'lodash-es'
import { queryParamsFromUrlString } from './url/url'
import { isNumber } from './isNumber'
import { alphabet, createEmptyAlphabeticListObj } from './alphabetic-list'

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
    selected = groupToCheck.children.filter((child) => child.applied)
  }

  selected.forEach((selectedFacet) => {
    totalSelectedFacets = countSelectedFacets(selectedFacet, selected.length)
  })

  return startingValue + totalSelectedFacets
}

/**
 * Returns normalized first letter of given facet title.
 * @param {string} title - facet title.
 * @return {string} first letter of facet, or if number detected returns #.
 */
export const getNormalizedFirstLetter = (title) => {
  if (!title?.[0]) return null
  const firstLetter = title[0].toUpperCase()

  return isNumber(firstLetter) ? '#' : firstLetter
}

/**
 * Returns an array unique entries for the first letter of each facet's title. If the first letter
 * is a number, it will return '#'. This function does not count any children facets.
 * @param {object} facets - An object representing the facet response.
 * @return {array} An array of the starting letters.
 */
export const getStartingLetters = (facets) => {
  const firstLetters = facets.reduce((letters, facet) => {
    const letter = getNormalizedFirstLetter(facet?.title)
    if (!letter) return letters

    return letters.includes(letter) ? letters : [...letters, letter]
  }, [])

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
export const changeCmrFacet = (e, facetLinkInfo, onChangeHandler, facet, applied) => {
  const newParams = qs.parse(
    queryParamsFromUrlString(facetLinkInfo.destination),
    {
      decoder: (string, defaultDecoder, charset, type) => {
        // Avoid decoding the facet values
        if (type === 'value') {
          return string
        }

        return defaultDecoder(string)
      }
    }
  )

  const paramsToSend = {
    data_center_h: newParams.data_center_h,
    granule_data_format_h: newParams.granule_data_format_h,
    horizontal_data_resolution_range: newParams.horizontal_data_resolution_range,
    instrument_h: newParams.instrument_h,
    latency: newParams.latency,
    platforms_h: newParams.platforms_h,
    processing_level_id_h: newParams.processing_level_id_h,
    project_h: newParams.project_h,
    science_keywords_h: newParams.science_keywords_h,
    two_d_coordinate_system_name: newParams.two_d_coordinate_system_name
  }

  onChangeHandler(paramsToSend, facet, applied)
}

/**
 * The change handler for View All facets.
 * @param {object} e - An event object
 * @param {object} facetLinkInfo - The information for the clicked facet.
 * @param {object} onChangeHandler - The change handler to call.
 */
export const changeViewAllFacet = (e, facetLinkInfo, onChangeHandler) => {
  const { params, selectedCategory } = facetLinkInfo
  const newParams = qs.parse(queryParamsFromUrlString(params.destination))

  const paramsToSend = {
    data_center_h: newParams.data_center_h,
    horizontal_data_resolution_range: newParams.horizontal_data_resolution_range,
    instrument_h: newParams.instrument_h,
    latency: newParams.latency,
    platforms_h: newParams.platforms_h,
    processing_level_id_h: newParams.processing_level_id_h,
    project_h: newParams.project_h,
    science_keywords_h: newParams.science_keywords_h,
    two_d_coordinate_system_name: newParams.two_d_coordinate_system_name
  }

  onChangeHandler({
    params: paramsToSend,
    selectedCategory
  })
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
    'Processing levels': 'processing-level-id',
    'Tiling System': 'two-d-coordinate-system-name',
    Latency: 'latency'
  }

  return categoryMap[name]
}

/**
 * Takes new CMR facet params from an action and returns an object to be used in a reducer
 * @param {object} newParams - An object containing the next facet params to set.
 * @return {object} An object with the values to be sent to a facets reducer.
 */
export const prepareCMRFacetPayload = (newParams) => ({
  data_center_h: newParams.data_center_h
    ? newParams.data_center_h
    : undefined,
  instrument_h: newParams.instrument_h
    ? newParams.instrument_h
    : undefined,
  granule_data_format_h: newParams.granule_data_format_h
    ? newParams.granule_data_format_h
    : undefined,
  platforms_h: newParams.platforms_h
    ? newParams.platforms_h
    : undefined,
  processing_level_id_h: newParams.processing_level_id_h
    ? newParams.processing_level_id_h
    : undefined,
  project_h: newParams.project_h
    ? newParams.project_h
    : undefined,
  science_keywords_h: newParams.science_keywords_h
    ? newParams.science_keywords_h
    : undefined,
  two_d_coordinate_system_name: newParams.two_d_coordinate_system_name
    ? newParams.two_d_coordinate_system_name
    : undefined,
  horizontal_data_resolution_range: newParams.horizontal_data_resolution_range
    ? newParams.horizontal_data_resolution_range
    : undefined,
  latency: newParams.latency
    ? newParams.latency
    : undefined
})

/**
 * Takes a facets object and some options and returns arrays populated with the relevant facets.
 * @param {object} facets - An object containing the facets to sort.
 * @param {object} options - An object containing options to control sorting.
 * @param {boolean} options.liftSelectedFacets - Designates whether the selected facets should be separated
 * into their own category to be displayed separatly
 * @return {{alphabetizedList: array, facetsToLift: array }} An object containing the organized facets.
 */
export const buildOrganizedFacets = (facets, options) => {
  let facetsToLift = []
  let facetsToSort = []

  if (options.liftSelectedFacets) {
    facetsToLift = facets.filter((facet) => facet.applied)
    facetsToSort = facets.filter((facet) => !facet.applied)
  } else {
    facetsToSort = [...facets]
  }

  let current = '#'
  const alphabetizedList = createEmptyAlphabeticListObj()

  facetsToSort.forEach((facet) => {
    const firstLetter = getNormalizedFirstLetter(facet.title)
    // Skip facets without a valid first letter
    if (!firstLetter) return

    // If the letter is not the current letter, update current
    if (firstLetter !== current) {
      current = firstLetter
    }

    // Add to appropriate list if it matches current letter or is a number
    // Only add if the letter exists in our alphabet (should always be true due to getNormalizedFirstLetter)
    if (alphabet.includes(firstLetter) && (firstLetter === current || (current === '#' && firstLetter === '#'))) {
      alphabetizedList[firstLetter].push(facet)
    }
  })

  return {
    alphabetizedList,
    facetsToLift
  }
}
