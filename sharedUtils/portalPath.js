import { isDefaultPortal } from '../static/src/js/util/portals'

/**
 * Provides a prefix for links that takes the active portal into account
 * @param {Object} portal Object with a portalId key
 */
export const portalPath = (portal) => {
  if (!portal) return ''
  const { portalId = '' } = portal
  let portalPath = ''
  if (!isDefaultPortal(portalId)) portalPath = `/portal/${portalId}`

  return portalPath
}

/**
 * Wrapper for portalPath() that takes the full Redux state
 * @param {Object} state Redux state
 */
export const portalPathFromState = (state) => {
  const { portal } = state
  return portalPath(portal)
}
