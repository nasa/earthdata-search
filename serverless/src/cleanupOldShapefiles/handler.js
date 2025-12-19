import 'pg'

import { getDbConnection } from '../util/database/getDbConnection'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Removes shapefile entries that are older than one year
 * @param {Object} event EventBridge event (scheduled event)
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const cleanupOldShapefiles = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  try {
    // Calculate the date one year ago
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    console.log(`Cleaning up shapefiles older than ${oneYearAgo.toISOString()}`)

    // Delete shapefiles older than one year
    const deletedCount = await dbConnection('shapefiles')
      .where('created_at', '<', oneYearAgo)
      .delete()

    console.log(`Successfully deleted ${deletedCount} shapefile(s) older than one year`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully deleted ${deletedCount} shapefile(s)`,
        deletedCount
      })
    }
  } catch (error) {
    console.error('Error cleaning up old shapefiles:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: parseError(error)
      })
    }
  }
}

export default cleanupOldShapefiles
