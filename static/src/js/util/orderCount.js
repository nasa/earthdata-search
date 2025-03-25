import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Calculate the number of granules per order supported
 * @param {Object} accessMethods Available access methods for a project collection
 * @param {String} selectedAccessMethod Selected access method
 */
export const calculateGranulesPerOrder = (accessMethods, selectedAccessMethod) => {
  const { [selectedAccessMethod]: accessMethod = {} } = accessMethods
  const { maxItemsPerOrder } = accessMethod
  const { defaultGranulesPerOrder } = getApplicationConfig()

  // SWODLR requires us to process each granule as a separate order
  if (accessMethod === 'SWODLR') return 1

  if (!maxItemsPerOrder) return defaultGranulesPerOrder

  return Math.min(maxItemsPerOrder, parseInt(defaultGranulesPerOrder, 10))
}

/**
 * Calculate the number of orders that will be created based on granule count
 * @param {Object} projectCollection Project collection metadata from redux store
 */
export const calculateOrderCount = (projectCollection) => {
  const {
    accessMethods = {},
    granules: projectCollectionGranules = {},
    selectedAccessMethod
  } = projectCollection

  // Order count only applies to access methods that perform additional
  // subsetting work and therefore create orders
  if (['download', 'opendap'].indexOf(selectedAccessMethod) > -1) return 0

  const { hits: granuleCount } = projectCollectionGranules

  // SWODLR requires each granule requested to be its own order
  if (selectedAccessMethod === 'SWODLR') {
    return granuleCount
  }

  return Math.ceil(granuleCount / calculateGranulesPerOrder(accessMethods, selectedAccessMethod))
}
