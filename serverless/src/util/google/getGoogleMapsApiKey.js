import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let googleMapsApiKey
let secretsManagerClient

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getGoogleMapsApiKey = async (earthdataEnvironment) => {
  if (googleMapsApiKey == null) {
    if (secretsManagerClient == null) {
      secretsManagerClient = new SecretsManagerClient(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const {
        googleMapsApiKey: googleMapsApiKeyValue
      } = getSecretEarthdataConfig(earthdataEnvironment)

      return googleMapsApiKeyValue
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: 'GoogleMapsApiKey'
    }

    const command = new GetSecretValueCommand(params)
    const secretValue = await secretsManagerClient.send(command)

    googleMapsApiKey = JSON.parse(secretValue.SecretString)
  }

  return googleMapsApiKey
}
