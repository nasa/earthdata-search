import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Calculate the number of orders that will be created based on granule count
 * @param {Object} projectCollection Project collection metadata from the store
 */
export const calculateOrderCount = (projectCollection) => {
  const {
    granules: projectCollectionGranules = {},
    selectedAccessMethod
  } = projectCollection

  // Order count only applies to access methods that perform additional
  // subsetting work and therefore create orders
  if (['download'].indexOf(selectedAccessMethod) > -1) return 0

  const { count: granuleCount } = projectCollectionGranules
  const { defaultGranulesPerOrder } = getApplicationConfig()

  return Math.ceil(granuleCount / parseInt(defaultGranulesPerOrder, 10))
}
