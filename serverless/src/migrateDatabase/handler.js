import pgMigrate from 'node-pg-migrate'

import { Client } from 'pg'

import { getDbConnectionConfig } from '../util/database/getDbConnectionConfig'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Runs migrations using node-pg-migrate
 * @param {Object} event Details about the HTTP request that it received
 */
const migrateDatabase = async (event) => {
  try {
    const dbConnectionConfig = await getDbConnectionConfig()

    const dbClient = new Client(dbConnectionConfig)
    await dbClient.connect()

    const { direction = 'up' } = event

    const config = {
      dbClient,
      direction,
      dir: 'migrations',
      migrationsTable: 'pgmigrations'
    }

    const migrationResponse = await pgMigrate(config)

    await dbClient.end()

    if (migrationResponse.length) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify(migrationResponse)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({ message: 'No migrations to run!' })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      ...parseError(e)
    }
  }
}

export default migrateDatabase
