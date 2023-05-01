import { cloneDeep, merge } from 'lodash'

import { getApplicationConfig } from '../../../../sharedUtils/config'
import { availablePortals } from '../../../../portals'

/**
 * Does the given portalId match the application defaultPortal
 * @param {String} portalId
 */
export const isDefaultPortal = (portalId) => {
  const defaultPortalId = getApplicationConfig().defaultPortal
  return portalId === defaultPortalId
}

/**
 * Recursively build the portal config merging the config into the configs parent config
 * @param {Object} json Portal config
 */
export const buildConfig = (json) => {
  const { parentConfig } = json

  // If the current config has a parent, merge the current config into the result of the parents being merged together
  if (parentConfig) {
    const { [parentConfig]: parentJson } = availablePortals
    const parent = buildConfig(parentJson)
    return merge(cloneDeep(parent), json)
  }

  // If the config doesn't have a parent, merge the current config into the default portal config
  const { default: defaultJson } = availablePortals
  return merge(cloneDeep(defaultJson), json)
}
