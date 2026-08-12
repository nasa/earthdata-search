import 'pg'

import { getDbConnection } from '../util/database/getDbConnection'

/**
 * Removes retrieval entries that are older than one year. Deleting a retrieval cascades
 * (via ON DELETE CASCADE foreign keys) to its retrieval_collections and retrieval_orders if applicable.
 * @param {Object} event EventBridge event (scheduled event)
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const cleanupOldRetrievals = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  try {
    // Calculate the date one year ago
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    console.log(`Cleaning up retrievals older than ${oneYearAgo.toISOString()}`)

    // Delete retrievals older than one year. Foreign keys on retrieval_collections and
    // retrieval_orders are ON DELETE CASCADE, so their related rows are removed automatically
    const deletedCount = await dbConnection('retrievals')
      .where('created_at', '<', oneYearAgo)
      .delete()

    console.log(deletedCount > 0
      ? `Successfully deleted ${deletedCount} retrieval(s) ${oneYearAgo.toISOString()}`
      : `No retrievals older than ${oneYearAgo.toISOString()} found exiting cleanup process`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully deleted ${deletedCount} retrieval(s)`,
        deletedCount
      })
    }
  } catch (error) {
    console.log('Error cleaning up old retrievals:', error)

    // Event Bridge will retry the function if an uncaught error is thrown
    // so we are catching an error and returning a 500 status code
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error cleaning up old retrievals',
        error: error.message
      })
    }
  }
}

export default cleanupOldRetrievals
