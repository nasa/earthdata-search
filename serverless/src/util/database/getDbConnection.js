import 'pg'
import knex from 'knex'
import { getDbConnectionConfig } from '../database'

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
