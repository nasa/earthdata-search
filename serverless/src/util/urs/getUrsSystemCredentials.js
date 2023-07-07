import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let secretsManagerClient
let ursSystemCredentials

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 * @param {String} earthdataEnvironment The CMR Environment to retrieve a token from
 */
export const getUrsSystemCredentials = async (earthdataEnvironment) => {
  if (ursSystemCredentials == null) {
    if (secretsManagerClient == null) {
      secretsManagerClient = new SecretsManagerClient(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const {
        cmrSystemUsername, cmrSystemPassword
      } = getSecretEarthdataConfig(earthdataEnvironment)

      return {
        username: cmrSystemUsername,
        password: cmrSystemPassword
      }
    }
    
    const params = {
      SecretId: `UrsSystemPasswordSecret_${earthdataEnvironment}`
    }

    // If not running in development mode fetch secrets from AWS
    const command = new GetSecretValueCommand(params)
    const secretValue = await secretsManagerClient.send(command)

    ursSystemCredentials = JSON.parse(secretValue.SecretString)
  }

  return ursSystemCredentials
}
