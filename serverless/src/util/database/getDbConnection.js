import 'pg'
import knex from 'knex'

import { getDbConnectionConfig } from './getDbConnectionConfig'

// Initialize a variable to be set once
let dbConnection

/**
 * Returns a Knex database connection object to the EDSC RDS database
 */
export const getDbConnection = async () => {
  if (dbConnection == null) {
    const dbConnectionConfig = await getDbConnectionConfig()

    const pool = {}

    if (process.env.IS_OFFLINE) {
      // When running locally set the pool min to 0 to avoid idle connections
      pool.min = 0
    }

    dbConnection = knex({
      client: 'pg',
      connection: dbConnectionConfig,
      pool
    })
  }

  return dbConnection
}
