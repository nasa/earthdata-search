import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { getDbConnection } from '../util/database/getDbConnection'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'

/**
 * Retrieve access methods for a provided collection
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getSavedAccessConfigs = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { body, headers } = event

    const { params = {} } = JSON.parse(body)

    const {
      collectionIds
    } = params

    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const jwtToken = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // Retrieve the savedAccessConfig for this user and collection
    const accessConfigRecords = await dbConnection('access_configurations')
      .select('collection_id', 'access_method')
      .where({ user_id: userId })
      .whereIn('collection_id', collectionIds)

    const configs = {}

    accessConfigRecords.forEach((config) => {
      const {
        collection_id: collectionId,
        access_method: accessMethod
      } = config

      // After EDSC-3638, we are saving the form digest as `formDigest`, but previous access configurations will need to be updated
      let { formDigest } = accessMethod
      if (!formDigest) {
        formDigest = accessMethod.form_digest
      }

      configs[collectionId] = {
        ...accessMethod,
        formDigest
      }
    })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(configs)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getSavedAccessConfigs
