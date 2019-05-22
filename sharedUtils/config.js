import config from '../static.config.json'
import secretConfig from '../secret.config.json'

export const getEarthdataConfig = env => config.earthdata[env]
export const getEnvironmentConfig = () => config.environment[process.env.NODE_ENV]

export const getSecretEarthdataConfig = env => secretConfig.earthdata[env]
export const getSecretEnvironmentConfig = () => secretConfig.environment[process.env.NODE_ENV]
