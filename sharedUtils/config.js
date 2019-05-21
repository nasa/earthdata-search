import config from '../static.config.json'
import secretConfig from '../secret.config.json'

export const getConfig = env => config[env]
export const getSecretConfig = env => secretConfig[env]
