import { getApplicationConfig } from '../../../../../sharedUtils/config'

/**
 * Encodes the Advanced Search params into an object
 * @param {Object} advancedSearch advancedSearch object from the store
 */
export const encodePortal = (portalId) => {
  if (!portalId || portalId === getApplicationConfig().defaultPortal) return ''

  return {
    portal: portalId
  }
}

/**
 * Decodes a parameter object into an advancedSearch object
 * @param {Object} params URL parameter object from parsing the URL parameter string
 */
export const decodePortal = (params) => {
  if (Object.keys(params).length === 0) return getApplicationConfig().defaultPortal

  const { portal } = params
  if (!portal) return getApplicationConfig().defaultPortal

  return portal
}
