/**
 * Returns the collection object from the metadata store for the provided granuleId
 * @param {String} granuleId Focused collection id
 * @param {Object} granules granules from the metadata store
 */
export const getFocusedGranuleObject = (granuleId, granules) => {
  if (!granules) return undefined

  return granules.byId[granuleId] || {}
}

export default getFocusedGranuleObject
