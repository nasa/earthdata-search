import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { getSecretEnvironmentConfig } from '../../../../sharedUtils/config'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let dbCredentials
let secretsManagerClient

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = async () => {
  if (dbCredentials == null) {
    if (secretsManagerClient == null) {
      secretsManagerClient = new SecretsManagerClient(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const { dbUsername, dbPassword } = getSecretEnvironmentConfig(process.env.NODE_ENV)

      return {
        username: dbUsername,
        password: dbPassword
      }
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: process.env.configSecretId
    }

    const command = new GetSecretValueCommand(params)
    const secretValue = await secretsManagerClient.send(command)

    dbCredentials = JSON.parse(secretValue.SecretString)
  }

  return dbCredentials
}
