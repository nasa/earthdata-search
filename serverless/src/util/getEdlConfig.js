import AWS from 'aws-sdk'

import {
  getEarthdataConfig,
  getSecretEarthdataConfig
} from '../../../sharedUtils/config'

import { getSecretsManagerConfig } from './aws/getSecretsManagerConfig'

const clientConfig = {}
let secretsmanager

/**
 * Configuration object used by the simple-oauth2 plugin
 */
const oAuthConfig = (earthdataEnvironment) => ({
  auth: {
    tokenHost: getEarthdataConfig(earthdataEnvironment).edlHost
  }
})

/**
 * Get the Earthdata Login configuration, from either secret.config.json or AWS
 * @param {Object} edlConfig A previously defined config object, or null if one has not be instantiated
 */
export const getEdlConfig = async (earthdataEnvironment) => {
  const { [earthdataEnvironment]: environmentConfig } = clientConfig
  if (environmentConfig == null) {
    if (secretsmanager == null) {
      secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const { clientId, password } = getSecretEarthdataConfig(earthdataEnvironment)

      return {
        ...oAuthConfig(earthdataEnvironment),
        client: {
          id: clientId,
          secret: password
        }
      }
    }

    console.log(`Fetching UrsClientConfigSecret_${earthdataEnvironment}`)

    const params = {
      SecretId: `UrsClientConfigSecret_${earthdataEnvironment}`
    }

    // If not running in development mode fetch secrets from AWS
    const secretValue = await secretsmanager.getSecretValue(params).promise()

    clientConfig[earthdataEnvironment] = JSON.parse(secretValue.SecretString)
  }

  return {
    ...oAuthConfig(earthdataEnvironment),
    client: clientConfig[earthdataEnvironment]
  }
}
