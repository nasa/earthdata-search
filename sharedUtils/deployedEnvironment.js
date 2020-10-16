import { getApplicationConfig } from './config'

/**
 * Return the CMR environment to use
 */
export const deployedEnvironment = () => {
  const { env } = getApplicationConfig()

  if (env === 'dev') return 'prod'

  return env
}

export default deployedEnvironment
