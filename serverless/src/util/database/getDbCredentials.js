import AWS from 'aws-sdk'

import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { getSecretsManagerConfig } from '../aws/getSecretsManagerConfig'

let dbCredentials
let secretsmanager

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = async () => {
  if (dbCredentials == null) {
    if (secretsmanager == null) {
      secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      const { dbUsername, dbPassword } = getSecretEarthdataConfig(cmrEnv())

      return {
        username: dbUsername,
        password: dbPassword
      }
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: process.env.configSecretId
    }

    const secretValue = await secretsmanager.getSecretValue(params).promise()

    dbCredentials = JSON.parse(secretValue.SecretString)
  }

  return dbCredentials
}
