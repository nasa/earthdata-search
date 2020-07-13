/* eslint-disable import/no-dynamic-require, global-require */
import { merge } from 'lodash'

import { ADD_PORTAL } from '../constants/actionTypes'

export const addPortal = payload => ({
  type: ADD_PORTAL,
  payload
})

/**
 * Recursively build the portal config merging the config into the configs parent config
 * @param {Object} json Portal config
 */
const buildConfig = (json) => {
  const { parentConfig } = json

  // If the current config has a parent, merge the current config into the result of the parents being merged together
  if (parentConfig) {
    const parentJson = require(`../../../../portals/${parentConfig}/config.json`)

    return merge(buildConfig(parentJson), json)
  }

  // If the config doesn't have a parent, merge the current config into the default portal config
  const defaultJson = require('../../../../portals/default/config.json')
  return merge(defaultJson, json)
}

/**
 * Loads the portal config into the Redux Store.
 * @param {String} portalId Portal Name, must match the directory name in which the config is stored.
 */
export const loadPortalConfig = portalId => (dispatch) => {
  if (!portalId) return
  try {
    const portalJson = require(`../../../../portals/${portalId}/config.json`)

    const fullJson = buildConfig(portalJson)

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
