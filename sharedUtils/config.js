import config from '../static.config.json'

const getConfig = env => config[env]

export default getConfig
