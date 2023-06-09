import { v4 as uuidv4 } from 'uuid'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { getDbConnection } from '../util/database/getDbConnection'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { fetchCmrLinks } from './fetchCmrLinks'
import { fetchOpenSearchLinks } from './fetchOpenSearchLinks'
import { fetchOpendapLinks } from './fetchOpendapLinks'
import { flattenGranuleLinks } from './flattenGranuleLinks'

const retrieveGranuleLinks = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const {
      headers,
      multiValueQueryStringParameters,
      queryStringParameters
    } = event

    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const {
      id: retrievalCollectionId,
      cursor,
      pageNum = 1,
      flattenLinks = false,
      requestId = uuidv4()
    } = queryStringParameters
    const { linkTypes } = multiValueQueryStringParameters

    // Decode the provided retrieval id
    const decodedRetrievalCollectionId = deobfuscateId(retrievalCollectionId)

    const jwtToken = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

    // Fetch retrievalOrder from database
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const [retrievalCollectionResponse] = await dbConnection('retrieval_collections')
      .select('retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_collections.granule_params',
        'retrieval_collections.collection_metadata',
        'retrieval_orders.order_information',
        // TODO retrieving the latest user token, is there a way we can refresh this token before using it here
        'user_tokens.access_token')
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .leftOuterJoin('retrieval_orders', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .join('user_tokens', { 'user_tokens.user_id': 'users.id' })
      .where({
        'retrieval_collections.id': decodedRetrievalCollectionId,
        'users.id': userId,
        'user_tokens.environment': earthdataEnvironment
      })
      .orderBy('user_tokens.updated_at', 'desc')

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
    // Determine which action to take based on the access method type
    if (type.toLowerCase() === 'download') {
      const { isOpenSearch } = collectionMetadata

      if (isOpenSearch) {
        ({ links } = await fetchOpenSearchLinks({
          collectionMetadata,
          collectionId,
          granuleParams,
          pageNum
        }))
      } else {
        ({ cursor: newCursor, links } = await fetchCmrLinks({
          collectionId,
          cursor,
          earthdataEnvironment,
          granuleParams,
          linkTypes,
          requestId,
          token
        }))
      }
    }

    if (type.toLowerCase() === 'opendap') {
      const download = await fetchOpendapLinks({
        accessMethod,
        collectionId,
        earthdataEnvironment,
        event,
        granuleParams,
        pageNum,
        requestId
      })
      links = { download }
    }

    if (type.toLowerCase() === 'harmony') {
      // Harmony links are stored in order_information as rel=data links
      const { links: rawLinks = [] } = orderInformation

      links = {}
      rawLinks.forEach((linkObject) => {
        const { href, rel } = linkObject

        const adjustedRel = rel === 'data' ? 'download' : rel

        if (links[adjustedRel]) {
          links[adjustedRel].push(href)
        } else {
          links[adjustedRel] = [href]
        }
      })

      // Don't request another page of links for Harmony
      done = true
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        cursor: newCursor,
        done,
        links: flattenGranuleLinks(links, linkTypes, flattenLinks)
        // TODO EDD needs the user's access_token
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
