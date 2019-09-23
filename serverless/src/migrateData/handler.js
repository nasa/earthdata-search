import knex from 'knex'
import { getDbConnectionConfig } from '../util/database'
import { getSystemToken } from '../util/urs/getSystemToken'
import { migrateUsers } from './migrateUsers'
import { migrateAccessConfigurations } from './migrateAccessConfigurations'
import { migrateProjects } from './migrateProjects'
import { migrateRetrievals } from './migrateRetrievals'
import { migrateRetrievalCollections } from './migrateRetrievalCollections'
import { migrateRetrievalOrders } from './migrateRetrievalOrders'
import { migrateShapefiles } from './migrateShapefiles'

let oldDbConnection
let newDbConnection

const migrateData = async () => {
  // Connect to the database created to store 1.x data locally
  const oldDbConfig = getDbConnectionConfig()

  oldDbConnection = await knex({
    client: 'pg',
    connection: {
      ...oldDbConfig,

      // Existing database imported from dump
      database: ''
    }
  })

  // Connect to the database used to store migrated data that we'll import into 2.0
  const newDbConfig = getDbConnectionConfig()

  newDbConnection = await knex({
    client: 'pg',
    connection: {
      ...newDbConfig,

      // New database to store migrated data in
      database: ''
    }
  })

  // Because of CMR_ENV we need to be able to determine data from all environments
  const sitCmrToken = await getSystemToken(null, 'sit')
  const uatCmrToken = await getSystemToken(null, 'uat')
  const prodCmrToken = await getSystemToken(null, 'prod')
  const cmrTokens = {
    sit: sitCmrToken,
    uat: uatCmrToken,
    prod: prodCmrToken
  }

  /**
   * Start the migrations
   */

  await migrateUsers(oldDbConnection, newDbConnection, cmrTokens)

  await migrateAccessConfigurations(oldDbConnection, newDbConnection, cmrTokens)

  await migrateProjects(oldDbConnection, newDbConnection)

  await migrateRetrievals(oldDbConnection, newDbConnection)

  await migrateRetrievalCollections(oldDbConnection, newDbConnection, cmrTokens)

  await migrateRetrievalOrders(oldDbConnection, newDbConnection)

  await migrateShapefiles(oldDbConnection, newDbConnection)

  /**
   * End of migrations
   */

  oldDbConnection.destroy()
  newDbConnection.destroy()

  return true
}

export default migrateData
