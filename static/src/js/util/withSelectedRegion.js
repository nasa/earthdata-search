import { isEmpty } from 'lodash-es'

/**
 * Takes CMR params and applies any changes needed to
 * account for the current advanced search state.
 * @param {Object} params The current collection search params.
 * @param {Object} selectedRegion The current selected region params.
 * @returns {Object} Parameters merged with advanced search spatial.
 */
export const withSelectedRegion = (params, selectedRegion) => {
  const mergedParams = {
    ...params
  }

  // If we have a spatial value for the selectedRegion, use that for the spatial
  if (!isEmpty(selectedRegion) && selectedRegion.spatial) {
    // Query spatial is saved as an array, but the selectedRegion spatial is not
    const { type } = selectedRegion

    if (type === 'reach') {
      mergedParams.line = [selectedRegion.spatial]
    } else {
      mergedParams.polygon = [selectedRegion.spatial]
    }
  }

  return mergedParams
}
