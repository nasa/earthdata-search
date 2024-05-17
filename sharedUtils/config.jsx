import { merge } from 'lodash-es'

import staticConfig from '../static.config.json'
// eslint-disable-next-line import/no-unresolved
import secretConfig from '../secret.config.json'
import overrideConfig from '../overrideStatic.config.json'

const getConfig = () => {
  try {
    // eslint-disable-next-line global-require, import/no-unresolved

    return merge(staticConfig, overrideConfig)
  } catch (error) {
    return staticConfig
  }
}

export const getApplicationConfig = () => getConfig().application
export const getEarthdataConfig = (env) => getConfig().earthdata[env]
export const getEnvironmentConfig = (env) => getConfig().environment[env || process.env.NODE_ENV]
export const getExperimentsConfig = () => getConfig().experiments

export const getSecretEarthdataConfig = (env) => secretConfig.earthdata[env]
export const getSecretEnvironmentConfig = () => secretConfig.environment[process.env.NODE_ENV]
export const getSecretCypressConfig = () => secretConfig.cypress
export const getSecretAdminUsers = () => secretConfig.admins
