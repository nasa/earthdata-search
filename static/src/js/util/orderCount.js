import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Calculate the number of orders that will be created based on granule count
 * @param {Integer} granuleCount Number of granules being requested
 */
export const calculateOrderCount = (projectCollection) => {
  const {
    granules: projectCollectionGranules = {},
    selectedAccessMethod
  } = projectCollection

  // Order count only applies to access methods that perform additional
  // subsetting work and therefore create orders
  if (['download', 'opendap'].indexOf(selectedAccessMethod) > -1) return 0

  const { defaultGranulesPerOrder } = getApplicationConfig()

  const { hits: granuleCount } = projectCollectionGranules

  return Math.ceil(granuleCount / parseInt(defaultGranulesPerOrder, 10))
}
