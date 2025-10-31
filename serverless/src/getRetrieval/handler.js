import { keyBy } from 'lodash-es'

import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getAuthorizerContext } from '../util/getAuthorizerContext'
import { isLinkType } from '../../../static/src/js/util/isLinkType'
import { parseError } from '../../../sharedUtils/parseError'
import { obfuscateId } from '../util/obfuscation/obfuscateId'

/**
 * Retrieve a single retrieval record from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
export default async function getRetrieval(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { pathParameters } = event

    const { id: providedRetrieval } = pathParameters

    // Decode the provided retrieval id
    const decodedRetrievalId = deobfuscateId(providedRetrieval)

    const { userId } = getAuthorizerContext(event)

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select(
        'jsondata',
        'retrievals.jsondata',
        'retrievals.token',
        'retrievals.environment',
        'retrievals.created_at',
        'retrievals.id AS retrieval_id',
        'retrieval_collections.id',
        'retrieval_collections.collection_id',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_metadata',
        'retrieval_collections.granule_count',
        'retrieval_collections.granule_params',
        'users.urs_id'
      )
      .join('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrievals.id': decodedRetrievalId,
        'users.id': userId
      })

    if (retrievalResponse !== null && retrievalResponse.length > 0) {
      // Pull out the retrieval data from the first row (they will all be the same due to the join)
      const [retrievalObject] = retrievalResponse

      // Top level retrieval data
      const {
        created_at: createdAt,
        jsondata,
        id: retrievalId
      } = retrievalObject

      // Gather the additional links before we massage the data below
      const links = Object.values(retrievalResponse).map((collection) => {
        const { collection_metadata: collectionMetadata = {} } = collection
        const {
          dataset_id: datasetId,
          links: collectionMetadataLinks = []
        } = collectionMetadata

        const metadataLinks = collectionMetadataLinks.filter((link = {}) => isLinkType('metadata', link.rel))

        // Prevent redundant links
        const uniqueMetadataLinks = metadataLinks.filter(
          (thing, index, self) => index === self.findIndex((t) => t.href === thing.href)
        )

        return {
          dataset_id: datasetId,
          links: uniqueMetadataLinks
        }
      }).filter((linkList) => linkList.links.length > 0)

      const collections = {}
      if (retrievalId) {
        collections.byId = keyBy(retrievalResponse, (row) => row.id)

        // Strip the body of each collection down to only necessary data instead of the entire result row
        Object.keys(collections.byId).forEach((collection) => {
          const {
            id: rowId,
            access_method: accessMethod,
            collection_id: collectionId,
            collection_metadata: collectionMetadata,
            granule_count: granuleCount,
            granule_params: granuleParams,
            urs_id: ursId
          } = collections.byId[collection]

          const obfuscatedId = obfuscateId(rowId)

          const { type } = accessMethod
          const accessMethodKey = type.toLowerCase().replace(/ /g, '_')

          // If the access method has not been added to the collection response
          // yet, create an empty array for it
          if (!(accessMethodKey in collections)) {
            collections[accessMethodKey] = []
          }

          collections[accessMethodKey].push(rowId)

          collections.byId[collection] = {
            access_method: accessMethod,
            collection_id: collectionId,
            collection_metadata: collectionMetadata,
            granule_count: granuleCount,
            granule_params: granuleParams,
            id: rowId,
            retrieval_collection_id: obfuscatedId,
            retrieval_id: providedRetrieval, // Ensure the obfuscated id is returned
            urs_id: ursId
          }
        })
      }

      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify({
          id: providedRetrieval,
          jsondata,
          created_at: createdAt,
          collections,
          links
        })
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors: [`Retrieval '${providedRetrieval}' not found.`] })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}
