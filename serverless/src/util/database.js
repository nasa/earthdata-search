import AWS from 'aws-sdk'
import { getEnvironmentConfig, getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSecretsManagerConfig } from './aws/getSecretsManagerConfig'

const secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())

let dbCredentials
let connectionConfig

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = async () => {
  if (dbCredentials == null) {
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

/**
 * Returns an object representing a database configuration
 */
export const getDbConnectionConfig = async () => {
  if (connectionConfig == null) {
    const dbCredentials = await getDbCredentials()

    const configObject = {
      user: dbCredentials.username,
      password: dbCredentials.password
    }

    if (process.env.NODE_ENV === 'development') {
      const { dbHost, dbName, dbPort } = getEnvironmentConfig()
      return {
        ...configObject,
        host: dbHost,
        database: dbName,
        port: dbPort
      }
    }

    connectionConfig = {
      ...configObject,
      host: process.env.dbEndpoint,
      database: process.env.dbName,
      port: process.env.dbPort
    }
  }

  return connectionConfig
}
