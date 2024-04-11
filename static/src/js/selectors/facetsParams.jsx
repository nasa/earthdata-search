/**
 * Retrieve the cmr specific facet parameters from Redux
 * @param {Object} state Current state of Redux
 */
export const getCmrFacetParams = (state) => {
  const { facetsParams = {} } = state
  const { cmr = {} } = facetsParams

  return cmr
}
