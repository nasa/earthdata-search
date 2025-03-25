import { getDbCredentials } from './getDbCredentials'
import { getEnvironmentConfig } from '../../../../sharedUtils/config'

let connectionConfig

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
      const { dbHost, dbName, databasePort } = getEnvironmentConfig()

      return {
        ...configObject,
        host: dbHost,
        database: dbName,
        port: databasePort
      }
    }

    connectionConfig = {
      ...configObject,
      host: process.env.DATABASE_ENDPOINT,
      database: process.env.DB_NAME,
      port: process.env.DATABASE_PORT
    }
  }

  return connectionConfig
}
