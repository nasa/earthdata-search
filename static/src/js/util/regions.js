/**
 * Prepare parameters used in getRegions() based on current State
 * @param {object} regionQuery Current region query
 * @returns Parameters used in buildRegionSearchParams
 */
export const prepareRegionParams = (regionQuery) => {
  const {
    endpoint,
    exact,
    keyword
  } = regionQuery

  return {
    endpoint,
    exact,
    query: keyword
  }
}
