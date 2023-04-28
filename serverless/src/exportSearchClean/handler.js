import { getDbConnection } from '../util/database/getDbConnection'

/**
 * @name exportSearchClean
 * @description Delete all rows for exports older than 30 days.  Policy automatically will delete objects from S3 bucket.
 */
const exportSearchClean = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const dbConnection = await getDbConnection()

  const threshold = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()

  // delete any records created more than 30 days ago
  await dbConnection('exports').del().where('created_at', '<=', threshold)
}

export default exportSearchClean
