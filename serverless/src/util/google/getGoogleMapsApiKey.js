import AWS from 'aws-sdk'
import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let googleMapsApiKey
let secretsmanager

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getGoogleMapsApiKey = async () => {
  if (googleMapsApiKey == null) {
    if (secretsmanager == null) {
      secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const { googleMapsApiKey } = getSecretEarthdataConfig(cmrEnv())

      return googleMapsApiKey
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: 'GoogleMapsApiKey'
    }

    const secretValue = await secretsmanager.getSecretValue(params).promise()

    googleMapsApiKey = JSON.parse(secretValue.SecretString)
  }

  return googleMapsApiKey
}
