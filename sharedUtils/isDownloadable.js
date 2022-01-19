import camelcaseKeys from 'camelcase-keys'

/**
 * Determine if the collection associated with the provided granules is considered downloadable
 * @param {Array<Object>} granules Array of CMR granules to examine for online_access_flag
 */
export const isDownloadable = (granules) => granules.some((granule) => {
  const { onlineAccessFlag = false } = camelcaseKeys(granule)

  return onlineAccessFlag
})
