import { keyBy, groupBy } from 'lodash'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'
import { isWarmUp } from '../util/isWarmup'
import { isLinkType } from '../../../static/src/js/util/isLinkType'

// Knex database connection object
let dbConnection = null

/**
 * Handler to retrieve a single color map record from the application database
 */
export default async function getRetrieval(event, context) {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    const { retrieval_id: providedRetrieval } = event.pathParameters

    const jwtToken = getJwtToken(event)

    const { token } = getVerifiedJwtToken(jwtToken)
    const username = getUsernameFromToken(token)

    // Retrieve a connection to the database
    dbConnection = await getDbConnection(dbConnection)

    const retrievalResponse = await dbConnection('retrievals')
      .select('jsondata',
        'retrievals.created_at',
        'retrievals.id AS retrieval_id',
        'retrieval_collections.id',
        'retrieval_collections.collection_id',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_metadata',
        'retrieval_collections.granule_count')
      .join('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrievals.id': providedRetrieval,
        'users.urs_id': username
      })

    if (retrievalResponse !== null && retrievalResponse.length > 0) {
      // Pull out the retrieval data from the first row (they will all be the same due to the join)
      const [retrievalObject] = retrievalResponse

      // Top level retrieval data
      const {
        created_at: createdAt,
        jsondata,
        id
      } = retrievalObject

      // Gather the additional links before we massage the data below
      const links = Object.values(retrievalResponse).map((collection) => {
        const { collection_metadata: collectionMetadata = {} } = collection
        const { dataset_id: datasetId, links = [] } = collectionMetadata

        const metadataLinks = links.filter((link = {}) => isLinkType(link.rel, 'metadata'))

        // Prevent redundant links
        const uniqueMetadataLinks = metadataLinks.filter(
          (thing, index, self) => index === self.findIndex(t => t.href === thing.href)
        )

        return {
          dataset_id: datasetId,
          links: uniqueMetadataLinks
        }
      }).filter(linkList => linkList.links.length > 0)

      let collections = {}

      if (id) {
        collections = groupBy(retrievalResponse, row => row.access_method.type.toLowerCase().replace(/ /g, '_'))

        // strip the body of each collection down to only necessary data instead of the entire result row
        Object.keys(collections).forEach((collection) => {
          collections[collection] = collections[collection].map(({
            id,
            access_method: accessMethod,
            collection_id: collectionId,
            collection_metadata: collectionMetadata,
            granule_count: granuleCount
          }) => ({
            id,
            access_method: accessMethod,
            collection_id: collectionId,
            collection_metadata: collectionMetadata,
            granule_count: granuleCount
          }))
        })

        // The groupBy above will key the collections array on the order type but will result in
        // an array, we'll re-key this to be an object, keyed by the collection id for easy lookup
        Object.keys(collections).forEach((orderType) => {
          collections[orderType] = keyBy(collections[orderType],
            collection => collection.id)
        })
      }

      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [`Retrieval '${providedRetrieval}' not found.`] })
    }
  } catch (e) {
    console.log(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    }
  }
}
