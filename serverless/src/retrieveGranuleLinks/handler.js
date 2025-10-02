import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { getDbConnection } from '../util/database/getDbConnection'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { fetchOpendapLinks } from './fetchOpendapLinks'
import { flattenGranuleLinks } from './flattenGranuleLinks'
import fetchDownloadLinks from './fetchDownloadLinks'
import fetchHarmonyLinks from './fetchHarmonyLinks'

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
      id: retrievalCollectionId,
      cursor,
      linkTypes,
      pageNum = 1,
      flattenLinks = false,
      requestId = uuidv4()
    } = queryStringParameters

    let { ee: earthdataEnvironment } = queryStringParameters
    if (!earthdataEnvironment) earthdataEnvironment = determineEarthdataEnvironment(headers)

    // Decode the provided retrieval id
    const decodedRetrievalCollectionId = deobfuscateId(retrievalCollectionId)

    const jwtToken = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

    // Fetch retrievalOrder from database
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalCollectionResponseRows = await dbConnection('retrieval_collections')
      .select(
        'retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_collections.granule_params',
        'retrieval_collections.collection_metadata',
        'retrieval_orders.order_information',
        'user_tokens.access_token'
      )
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .leftJoin('retrieval_orders', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .join('user_tokens', { 'user_tokens.user_id': 'users.id' })
      .where({
        'retrieval_collections.id': decodedRetrievalCollectionId,
        'users.id': userId,
        'user_tokens.environment': earthdataEnvironment
      })
      .orderBy('user_tokens.updated_at', 'desc')

    const [retrievalCollectionResponse] = retrievalCollectionResponseRows

    // Determine access method type
    const {
      access_method: accessMethod,
      collection_id: collectionId,
      collection_metadata: collectionMetadata,
      granule_params: granuleParams,
      order_information: orderInformation,
      access_token: token
    } = retrievalCollectionResponse

    const { type } = accessMethod

    let done
    let links
    let newCursor

    switch (type.toLowerCase()) {
      case 'download':
        ({ links, newCursor } = await fetchDownloadLinks({
          collectionId,
          collectionMetadata,
          cursor,
          earthdataEnvironment,
          granuleParams,
          linkTypes,
          pageNum,
          requestId,
          token
        }))

        break
      case 'opendap':
        links = await fetchOpendapLinks({
          accessMethod,
          collectionId,
          earthdataEnvironment,
          event,
          granuleParams,
          pageNum,
          requestId
        })

        break
      case 'harmony':
        // When the order has multiple Harmony jobs, we need to return the links from every job
        if (retrievalCollectionResponseRows.length > 1) {
          // Combine the `order_information` objects from each row into a single object keyed by the `jobID`
          const combinedOrderInformation = retrievalCollectionResponseRows.reduce((acc, curr) => {
            const { order_information: currentOrderInformation } = curr
            const {
              jobID: jobId
            } = currentOrderInformation

            // Initialize the accumulator for this jobID if it doesn't exist
            if (!acc[jobId]) {
              acc[jobId] = {
                orderInformation: currentOrderInformation
              }
            }

            return acc
          }, {})

          // Combine the `links` array from each object in `combinedOrderInformation`
          const combinedOrderInformationLinks = Object.values(combinedOrderInformation).flatMap(
            // Using `|| []` will ensure we always return an array. This is important before the
            // order information exists
            (info) => info.orderInformation.links || []
          )

          // Fetch the Harmony links using the combined links
          links = fetchHarmonyLinks({ links: combinedOrderInformationLinks })
        } else {
          links = fetchHarmonyLinks(orderInformation)
        }

        done = true
        break
      default:
        break
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        cursor: newCursor,
        done,
        links: flattenGranuleLinks(links, linkTypes, flattenLinks)
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
