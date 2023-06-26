import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let googleMapsApiKey
let secretsmanager

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getGoogleMapsApiKey = async (earthdataEnvironment) => {
  if (googleMapsApiKey == null) {
    if (secretsmanager == null) {
      secretsmanager = new SecretsManagerClient(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const { googleMapsApiKey } = getSecretEarthdataConfig(earthdataEnvironment)

      return googleMapsApiKey
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: 'GoogleMapsApiKey'
    }

    const secretValue = await secretsmanager.send(params)

    googleMapsApiKey = JSON.parse(secretValue.SecretString)
  }

  return googleMapsApiKey
}
