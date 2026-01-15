import { SQSClient } from '@aws-sdk/client-sqs'

import { validateToken } from '../../util/authorizer/validateToken'
import { determineEarthdataEnvironment } from '../../util/determineEarthdataEnvironment'
import { downcaseKeys } from '../../util/downcaseKeys'
import getLoaders from './getLoaders'
import DatabaseClient from './databaseClient'
import { getSqsConfig } from '../../util/aws/getSqsConfig'

const databaseClient = new DatabaseClient()

const loaders = getLoaders({ databaseClient })

// AWS SQS adapter
let sqs

/**
 * Gets the context for the GraphQL resolver
 * @param {Object} params The parameters for the context
 * @param {Object} params.event The event object from the lambda function
 * @param {Object} params.context The context object from the lambda function
 * @returns {Object} The context object
 */
const getContext = async ({ event }) => {
  const { body, headers } = event

  const { operationName } = JSON.parse(body)

  // If the query is the IntrospectionQuery, return out of this method
  // The IntrospectionQuery is used when the playground has schema polling
  // enabled. Returning out of this method for those calls saves API
  // requests to URS and database calls
  if (operationName === 'IntrospectionQuery') return null

  const {
    authorization: bearerToken = ''
  } = downcaseKeys(headers)

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const edlToken = bearerToken.split(' ')[1]

  const { username } = await validateToken(edlToken, earthdataEnvironment)

  let user

  // If a username was returned, get the user from the database
  if (username) {
    user = await databaseClient.getUserWhere({
      environment: earthdataEnvironment,
      urs_id: username
    })
  }

  if (sqs == null) {
    sqs = new SQSClient(getSqsConfig())
  }

  return {
    databaseClient,
    edlToken,
    earthdataEnvironment,
    bearerToken,
    loaders,
    sqs,
    user
  }
}

export default getContext
