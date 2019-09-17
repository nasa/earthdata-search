import 'array-foreach-async'
import AWS from 'aws-sdk'
import request from 'request-promise'
import { stringify } from 'qs'
import { chunkArray } from '../util/chunkArray'
import { getSingleGranule } from '../util/cmr/getSingleGranule'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { getEarthdataConfig, getClientId } from '../../../sharedUtils/config'
import { invokeLambda } from '../util/aws/invokeLambda'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSystemToken } from '../util/urs/getSystemToken'

let cmrToken
let lambda
let sqs

const tagName = 'edsc.extra.serverless.collection_capabilities'

/**
 * Handler to process subsetting information from UMM S associations on collections
 */
const generateCollectionCapabilityTags = async (event) => {
  if (lambda === undefined) {
    lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })
  }

  if (sqs === undefined) {
    sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
  }

  const { pageNumber = 1, pageSize = 500 } = event

  cmrToken = await getSystemToken(cmrToken)

  const cmrParams = {
    has_granules_or_cwic: true,
    page_num: pageNumber,
    page_size: pageSize,
    include_granule_counts: true,
    include_tags: 'edsc.extra.serverless.*,org.ceos.wgiss.cwic.granules.prod'
  }

  const { cmrHost } = getEarthdataConfig(cmrEnv())
  const collectionSearchUrl = `${cmrHost}/search/collections.json`

  console.log(`Requesting collections from ${collectionSearchUrl}`)

  let cmrCollectionResponse
  try {
    cmrCollectionResponse = await request.post({
      uri: collectionSearchUrl,
      form: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
      headers: {
        'Client-Id': getClientId().background,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Echo-Token': cmrToken
      },
      json: true,
      resolveWithFullResponse: true
    })
  } catch (e) {
    console.log(e)
  }

  const { 'cmr-hits': cmrHits = 0 } = cmrCollectionResponse.headers

  console.log(`CMR returned ${cmrHits} collections. Current page number is ${pageNumber}, iterating through ${pageSize} at a time.`)

  const responseBody = readCmrResults(collectionSearchUrl, cmrCollectionResponse)

  // Chunk the results into 100 collections to minimize the size of the payloads we send to the tagging endpoint
  const chunkedCollections = chunkArray(responseBody, 100)

  // Each chunk of 100 collections
  await chunkedCollections.forEachAsync(async (collectionList) => {
    const associationPayload = []

    // Construct the tag data for each collection in this chunk
    await collectionList.forEachAsync(async (collection) => {
      const {
        id,
        granule_count: granuleCount = 0,
        tags = {}
      } = collection

      try {
        if (Object.keys(tags).includes('org.ceos.wgiss.cwic.granules.prod') && granuleCount === 0) {
          // Create an SQS Queue for adding CWIC specific data
        } else {
          const singleGranule = await getSingleGranule(cmrToken, id)

          if (singleGranule) {
            const {
              cloud_cover: cloudCover = false,
              day_night_flag: dayNightFlag,
              online_access_flag: onlineAccessFlag = false,
              orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains = []
            } = singleGranule

            const tagData = {
              cloud_cover: cloudCover !== undefined,
              day_night_flag: dayNightFlag && ['DAY', 'NIGHT', 'BOTH'].includes(dayNightFlag.toUpperCase()),
              granule_online_access_flag: onlineAccessFlag,
              orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains.length > 0
            }

            associationPayload.push({
              'concept-id': id,
              data: tagData
            })
          } else {
            console.log(`${id} doesn't have any granules`)
          }
        }
      } catch (e) {
        console.log(e)
      }
    })

    if (associationPayload.length) {
      await sqs.sendMessage({
        QueueUrl: process.env.tagQueueUrl,
        MessageBody: JSON.stringify({
          tagName,
          action: 'ADD',
          tagData: associationPayload
        })
      }).promise()
    }
  })

  if (cmrHits > pageNumber * pageSize) {
    const lambdaParams = {
      ...event,
      pageNumber: pageNumber + 1
    }

    try {
      await invokeLambda(process.env.collectionCapabilitiesLambda, lambdaParams)
    } catch (e) {
      console.log(e)
    }
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({ message: `Processing ${chunkedCollections.length} chunks of 100 collections.` })
  }
}

export default generateCollectionCapabilityTags
