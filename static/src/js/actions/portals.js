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
export const restorePortal = portalId => (dispatch) => {
  try {
    const json = require(`../../../../portals/${portalId}/config.json`)

    const { hasStyles, hasScripts } = json

    if (hasStyles) {
      const css = require(`../../../../portals/${portalId}/style.scss`)
      css.use()
    }

    if (hasScripts) {
      require(`../../../../portals/${portalId}/scripts.js`)
    }

    dispatch(addPortal({ portalId, ...json }))
  } catch (error) {
    console.error('Portal could not be loaded', error)
  }
}
