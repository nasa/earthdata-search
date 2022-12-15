/* eslint-disable import/no-dynamic-require, global-require */

import { ADD_PORTAL } from '../constants/actionTypes'
import { displayNotificationType } from '../constants/enums'
import { getPortalConfig } from '../util/portals'
import { addError } from './errors'

export const addPortal = (payload) => ({
  type: ADD_PORTAL,
  payload
})

/**
 * Loads the portal config into the Redux Store.
 * @param {String} portalId Portal Name, must match the directory name in which the config is stored.
 */
export const loadPortalConfig = (portalId) => (dispatch) => {
  if (!portalId) return
  try {
    const json = getPortalConfig(portalId)

    const { hasStyles, hasScripts } = json

    if (hasStyles) {
      const css = require(`../../../../portals/${portalId}/styles.scss`)
      css.use()
    }

    if (hasScripts) {
      require(`../../../../portals/${portalId}/scripts.js`)
    }

    dispatch(addPortal({ portalId, ...json }))
  } catch (error) {
    console.error('Portal could not be loaded', error)
    dispatch(
      addError({
        id: portalId,
        notificationType: displayNotificationType.banner,
        title: `Portal ${portalId} could not be loaded`
      })
    )
  }
}
