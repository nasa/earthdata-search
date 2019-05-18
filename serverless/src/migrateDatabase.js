import pgMigrate from 'node-pg-migrate'
import { getDbCredentials } from './util'

export default function migrateDatabase(event, context, callback) {
  try {
    const dbCredentials = getDbCredentials()
    const databaseUrl = `postgres://${dbCredentials.username}:${dbCredentials.password}@${process.env.dbEndpoint}/${process.env.dbName}`

    const config = {
      databaseUrl,
      direction: event.direction || 'up',
      dir: 'migrations',
      migrationsTable: 'pgmigrations'
    }

    const migrationResponse = pgMigrate(config)

    if (migrationResponse) {
      callback(null, {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify(migrationResponse)
      })
    }

    callback(null, {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({ message: 'No migrations to run!' })
    })
  } catch (e) {
    callback(null, {
      isBase64Encoded: false,
      statusCode: 500,
      body: JSON.stringify({ errors: [e] })
    })
  }
}
