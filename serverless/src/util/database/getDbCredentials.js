import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getSecretEnvironmentConfig } from '../../../../sharedUtils/config'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let dbCredentials
let secretsmanager

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = async () => {
  if (dbCredentials == null) {
    if (secretsmanager == null) {
      secretsmanager = new SecretsManagerClient(getSecretsManagerConfig())
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

    const secretValue = await secretsmanager.send(params)

    dbCredentials = JSON.parse(secretValue.SecretString)
  }

  return dbCredentials
}
