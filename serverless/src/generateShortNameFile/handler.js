import axios from 'axios'
import { PutObjectCommand } from '@aws-sdk/client-s3'

import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getS3Client } from '../util/getS3Client'
import { parseError } from '../../../sharedUtils/parseError'

const collectionsGraphQlQuery = `
  query Collections($params: CollectionsInput) {
    collections(params: $params) {
      count
      cursor
      items {
        collectionProgress
        hasGranules
        shortName
        version
      }
    }
  }`

// CollectionProgress values that indicate the collection is non-operational
const nonOperationalProgresses = ['PLANNED', 'DEPRECATED', 'PREPRINT', 'INREVIEW']

// AWS S3 adapter
let s3

/**
 * Fetches every collection's shortName and version from cmr-graphql, paging through
 * the results with the returned cursor until no more items are returned
 * @param {Number} [maxRequests] Optional limit on the number of requests to make, useful for testing
 */
const fetchAllShortNames = async (maxRequests) => {
  const { env } = getApplicationConfig()
  const { graphQlHost } = getEarthdataConfig(env)

  const graphQlUrl = `${graphQlHost}/api`

  const collections = []
  let cursor = null
  let hasMoreResults = true
  let requestCount = 0

  while (hasMoreResults && (!maxRequests || requestCount < maxRequests)) {
    requestCount += 1

    console.log('Request count: ', requestCount)
    // eslint-disable-next-line no-await-in-loop
    const response = await axios({
      url: graphQlUrl,
      method: 'post',
      data: {
        query: collectionsGraphQlQuery,
        variables: {
          params: {
            cursor,
            includeNonOperational: true,
            includeHasGranules: true,
            limit: 500,
            sortKey: 'entry_id'
          }
        },
        operationName: 'Collections'
      },
      headers: {
        'Client-Id': getClientId().background
      }
    })

    const { data: responseData } = response
    const { data, errors } = responseData

    if (errors && errors.length > 0) {
      throw new Error(JSON.stringify(errors))
    }

    const { collections: collectionsData } = data
    const { cursor: responseCursor, items } = collectionsData

    if (!items || items.length === 0) {
      hasMoreResults = false
    } else {
      collections.push(...items.map(({
        collectionProgress,
        hasGranules,
        shortName,
        version
      }) => ({
        isActive: !nonOperationalProgresses.includes(collectionProgress),
        hasGranules,
        shortName,
        version
      })))

      cursor = responseCursor
    }
  }

  return collections
}

/**
 * Generates a JSON file of all collection shortNames and versions and writes it to S3
 * @param {Object} event EventBridge event (scheduled event). Optionally include `maxRequests` to limit the number of graphql requests made
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const generateShortNameFile = async (event, context) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (s3 == null) {
    s3 = getS3Client()
  }

  const { defaultResponseHeaders } = getApplicationConfig()

  const { maxRequests: maxRequestsParam } = event || {}
  const maxRequests = parseInt(maxRequestsParam, 10) || undefined

  console.log('Generating short name file with maxRequests:', maxRequests ?? 'no request limit')

  const {
    NLP_SHORT_NAME_FILE_BUCKET_NAME: bucketName = 'earthdata-search-dev-nlp-short-name-file',
    NLP_SHORT_NAME_FILE_KEY: key = 'nlpShortNamesCache.json'
  } = process.env

  try {
    const collections = await fetchAllShortNames(maxRequests)

    console.log('Fetched Collections, writing file with count:', collections.length)

    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(collections),
      ContentType: 'application/json'
    }))

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        bucket: bucketName,
        key,
        count: collections.length
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

export default generateShortNameFile
