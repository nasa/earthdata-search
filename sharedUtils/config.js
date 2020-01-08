import config from '../static.config.json'
import { cmrEnv } from './cmrEnv'
import secretConfig from '../secret.config.json'

export const getApplicationConfig = () => config.application
export const getEarthdataConfig = env => config.earthdata[env]
export const getEnvironmentConfig = () => config.environment[process.env.NODE_ENV]

export const getSecretEarthdataConfig = env => secretConfig.earthdata[env]
export const getSecretEnvironmentConfig = () => secretConfig.environment[process.env.NODE_ENV]
export const getSecretCypressConfig = () => secretConfig.cypress

export const getClientId = () => {
  if (process.env.NODE_ENV === 'test') return getEarthdataConfig('test').clientId
  if (process.env.NODE_ENV === 'development') return getEarthdataConfig('dev').clientId

  return getEarthdataConfig(cmrEnv()).clientId
}
