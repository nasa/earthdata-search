import pgMigrate from 'node-pg-migrate'
import { Client } from 'pg'
import { getDbConnectionConfig } from './util'

let dbConnectionConfig = null

/**
 * Migrate the application database
 * @param {Object} event The Lambda event body
 * @return {String} A formatted URL with the users request parameters inserted
 */
export default async function migrateDatabase(event) {
  try {
    dbConnectionConfig = await getDbConnectionConfig(dbConnectionConfig)

    const dbClient = new Client(dbConnectionConfig)

    await dbClient.connect()

    const config = {
      dbClient,
      direction: event.direction || 'up',
      dir: 'migrations',
      migrationsTable: 'pgmigrations'
    }

    const migrationResponse = await pgMigrate(config)

    await dbClient.end()

    if (migrationResponse) {
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
    console.log(e)
    return {
      isBase64Encoded: false,
      statusCode: 500,
      body: JSON.stringify({ errors: [e] })
    }
  }
}
