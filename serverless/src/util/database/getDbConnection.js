import 'pg'
import knex from 'knex'

import { getDbConnectionConfig } from './getDbConnectionConfig'

// Initalize a variable to be set once
let dbConnection

/**
 * Returns a Knex database connection object to the EDSC RDS database
 */
export const getDbConnection = async () => {
  if (dbConnection == null) {
    const dbConnectionConfig = await getDbConnectionConfig()

    dbConnection = knex({
      client: 'pg',
      connection: dbConnectionConfig
    })
  }

  return dbConnection
}
