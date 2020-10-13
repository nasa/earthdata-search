import AWS from 'aws-sdk'

import {
  getEarthdataConfig,
  getSecretEarthdataConfig
} from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSecretsManagerConfig } from './aws/getSecretsManagerConfig'

let clientConfig
let secretsmanager

/**
 * Configuration object used by the simple-oauth2 plugin
 */
const oAuthConfig = cmrEnvironment => ({
  auth: {
    tokenHost: getEarthdataConfig(cmrEnvironment).edlHost
  }
})

/**
 * Get the Earthdata Login configuration, from either secret.config.json or AWS
 * @param {Object} edlConfig A previously defined config object, or null if one has not be instantiated
 */
export const getEdlConfig = async (providedCmrEnv) => {
  // If provided an environment, us it -- otherwise use the configured value
  const cmrEnvironment = (providedCmrEnv || cmrEnv())

  if (clientConfig == null) {
    if (secretsmanager == null) {
      secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const { clientId, password } = getSecretEarthdataConfig(cmrEnvironment)

      return {
        ...oAuthConfig(cmrEnvironment),
        client: {
          id: clientId,
          secret: password
        }
      }
    }

    // Use a variable here for easier find/replace until cmr_env is implemented
    const environment = cmrEnvironment

    console.log(`Fetching UrsClientConfigSecret_${environment}`)

    const params = {
      SecretId: `UrsClientConfigSecret_${environment}`
    }

    // If not running in development mode fetch secrets from AWS
    const secretValue = await secretsmanager.getSecretValue(params).promise()

    clientConfig = JSON.parse(secretValue.SecretString)
  }

  return {
    ...oAuthConfig(cmrEnvironment),
    client: clientConfig
  }
}
