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
