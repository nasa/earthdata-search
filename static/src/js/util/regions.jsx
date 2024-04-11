/**
 * Prepare parameters used in getRegions() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in buildRegionSearchParams
 */
export const prepareRegionParams = (state) => {
  const {
    query
  } = state

  const { region: regionQuery } = query

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
