import AWS from 'aws-sdk'
import knex from 'knex'
import { getEnvironmentConfig, getSecretEarthdataConfig } from '../../../sharedUtils/config'

const secretsmanager = new AWS.SecretsManager()

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = async (dbCredentials) => {
  if (dbCredentials === null) {
    if (process.env.NODE_ENV === 'development') {
      const { dbUsername, dbPassword } = getSecretEarthdataConfig('prod')

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

    return JSON.parse(secretValue.SecretString)
  }

  return dbCredentials
}

/**
 * Returns an object representing a database configuration
 */
export const getDbConnectionConfig = async (connectionConfig) => {
  if (connectionConfig) {
    return connectionConfig
  }

  const dbCredentials = await getDbCredentials(null)

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

  return {
    ...configObject,
    host: process.env.dbEndpoint,
    database: process.env.dbName,
    port: process.env.dbPort
  }
}

/**
 * Returns a Knex database connection object to the EDSC RDS database
 */
export const getDbConnection = async (dbConnection) => {
  if (dbConnection === null) {
    const dbConnectionConfig = await getDbConnectionConfig(null)

    return knex({
      client: 'pg',
      connection: dbConnectionConfig
    })
  }

  return dbConnection
}
