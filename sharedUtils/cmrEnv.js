import { getApplicationConfig } from './config'

/**
 * Return the CMR environment to use
 */
export const cmrEnv = () => {
  const { env } = getApplicationConfig()

  if (env === 'dev') return 'prod'

  return env
}

export default cmrEnv
