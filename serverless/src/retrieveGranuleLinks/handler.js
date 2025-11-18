import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getAuthorizerContext } from '../util/getAuthorizerContext'
import { fetchGranuleLinks } from '../util/fetchGranuleLinks'
import DatabaseClient from '../graphQl/utils/databaseClient'

const databaseClient = new DatabaseClient()

const retrieveGranuleLinks = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const {
      headers,
      queryStringParameters
    } = event

    const {
      id: obfuscatedRetrievalCollectionId,
      cursor,
      linkTypes,
      pageNum = 1,
      flattenLinks = false,
      requestId = uuidv4()
    } = queryStringParameters

    let { ee: earthdataEnvironment } = queryStringParameters
    if (!earthdataEnvironment) earthdataEnvironment = determineEarthdataEnvironment(headers)

    const { jwtToken, userId } = getAuthorizerContext(event)

    const {
      cursor: newCursor,
      done,
      links
    } = await fetchGranuleLinks({
      cursor,
      databaseClient,
      earthdataEnvironment,
      flattenLinks,
      edlToken: jwtToken,
      linkTypes,
      obfuscatedRetrievalCollectionId,
      pageNum,
      requestId,
      userId
    })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        cursor: newCursor,
        done,
        links
      })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default retrieveGranuleLinks
