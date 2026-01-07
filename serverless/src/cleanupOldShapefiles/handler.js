import 'pg'

import { getDbConnection } from '../util/database/getDbConnection'

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

    // Delete shapefiles older than one year, but only if:
    // - The shapefile is not a parent (no children), OR
    // - The shapefile is a parent and ALL its children are also older than one year
    const deletedCount = await dbConnection('shapefiles')
      .where('created_at', '<', oneYearAgo)
      // https://knexjs.org/guide/query-builder.html#whereexists
      // eslint-disable-next-line func-names
      .whereNotExists(function () {
        // Only delete parent if ALL children are also older than one year
        // This checks: there should NOT exist any children created within the last year
        // If no children exist (not a parent), subquery returns empty -> parent can be deleted
        // If children exist but all are old, subquery returns empty -> parent can be deleted
        // If any child is new, subquery returns a row -> parent is NOT deleted
        this.select(1)
          .from('shapefiles as children')
          .whereRaw('children.parent_shapefile_id = shapefiles.id')
          .where('children.created_at', '>=', oneYearAgo)
      })
      .delete()

    console.log(deletedCount > 0
      ? `Successfully deleted ${deletedCount} shapefile(s) ${oneYearAgo.toISOString()}`
      : `No shapefiles older than ${oneYearAgo.toISOString()} found exiting cleanup process`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully deleted ${deletedCount} shapefile(s)`,
        deletedCount
      })
    }
  } catch (error) {
    console.log('Error cleaning up old shapefiles:', error)

    // Event Bridge will retry the function if an uncaught error is thrown
    // so we are catching an error and returning a 500 status code
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error cleaning up old shapefiles',
        error: error.message
      })
    }
  }
}

export default cleanupOldShapefiles
