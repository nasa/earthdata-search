import AWS from 'aws-sdk'

import { getEarthdataConfig, getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSecretsManagerConfig } from './aws/getSecretsManagerConfig'

const secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())

/**
 * Builds a configuration object used by the simple-oauth2 plugin
 * @param {Object} clientConfig
 */
export const buildOauthConfig = clientConfig => ({
  client: clientConfig,
  auth: {
    tokenHost: getEarthdataConfig(cmrEnv()).edlHost
  }
})

/**
 * Get the Earthdata Login configuration, from either secret.config.json or AWS
 * @param {Object} edlConfig A previously defined config object, or null if one has not be instantiated
 */
export const getEdlConfig = async (providedCmrEnv) => {
  try {
    // If provided an environment, us it -- otherwise use the configured value
    const cmrEnvironment = (providedCmrEnv || cmrEnv())

    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      const { clientId, password } = getSecretEarthdataConfig(cmrEnvironment)

      return buildOauthConfig({
        id: clientId,
        secret: password
      })
    }

    // Use a variable here for easier find/replace until cmr_env is implemented
    const environment = cmrEnvironment

    console.log(`Fetching UrsClientConfigSecret_${environment}`)

    const params = {
      SecretId: `UrsClientConfigSecret_${environment}`
    }

    // If not running in development mode fetch secrets from AWS
    const secretValue = await secretsmanager.getSecretValue(params).promise()

    const clientConfig = JSON.parse(secretValue.SecretString)

    return buildOauthConfig(clientConfig)
  } catch (e) {
    console.log(e)
  }

  return null
}
