import AWS from 'aws-sdk'

import { getConfig, getSecretConfig } from '../../sharedUtils/config'

const secretsmanager = new AWS.SecretsManager({
  region: 'us-east-1'
})

/**
 * Builds a configuration object used by the simple-oauth2 plugin
 * @param {*} clientConfig
 */
export const buildOauthConfig = clientConfig => ({
  client: clientConfig,
  auth: {
    tokenHost: getConfig('prod').edlHost
  }
})

/**
 * Get the Earthdata Login configuration, from either secret.config.json or AWS
 * @param {*} edlConfig
 */
export const getEdlConfig = async (edlConfig) => {
  if (edlConfig !== null) {
    return edlConfig
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      const { clientId, password } = getSecretConfig('prod')

      return buildOauthConfig({
        id: clientId,
        secret: password
      })
    }

    const params = { SecretId: 'ursClientConfigProd' }

    const secretValue = await secretsmanager.getSecretValue(params).promise()

    const clientConfig = JSON.parse(secretValue.SecretString)

    return buildOauthConfig(clientConfig)
  } catch (e) {
    console.log(e)
  }

  return null
}
