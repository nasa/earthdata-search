/* eslint-disable import/no-dynamic-require, global-require */
import { ADD_PORTAL } from '../constants/actionTypes'

export const addPortal = payload => ({
  type: ADD_PORTAL,
  payload
})

/**
 * Loads the portal config into the Redux Store.
 * @param {String} portalId Portal Name, must match the directory name in which the config is stored.
 */
export const loadPortalConfig = portalId => (dispatch) => {
  if (!portalId) return
  try {
    const defaultJson = require('../../../../portals/default/config.json')
    const portalJson = require(`../../../../portals/${portalId}/config.json`)
    const fullJson = {
      ...defaultJson,
      ...portalJson
    }

    const { hasStyles, hasScripts } = fullJson

    if (hasStyles) {
      const css = require(`../../../../portals/${portalId}/styles.scss`)
      css.use()
    }

    if (hasScripts) {
      require(`../../../../portals/${portalId}/scripts.js`)
    }

    dispatch(addPortal({ portalId, ...fullJson }))
  } catch (error) {
    console.error('Portal could not be loaded', error)
  }
}
