import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Does the given portalId match the application defaultPortal
 * @param {String} portalId
 */
export const isDefaultPortal = (portalId) => {
  const defaultPortalId = getApplicationConfig().defaultPortal
  return portalId === defaultPortalId
}
