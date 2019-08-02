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

  const cmrParams = {
    has_granules_or_cwic: true,
    page_num: pageNumber,
    page_size: pageSize,
    include_granule_counts: true,
    include_tags: 'edsc.extra.serverless.*,org.ceos.wgiss.cwic.granules.prod'
  }

  const collectionSearchUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}/search/collections.json?${stringify(cmrParams)}`

  let cmrCollectionResponse
  try {
    cmrCollectionResponse = await request.get({
      uri: collectionSearchUrl,
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().background
      }
    })
  } catch (e) {
    console.log(e)
  }

  const responseBody = readCmrResults(collectionSearchUrl, cmrCollectionResponse)

  const chunkedCollections = chunkArray(responseBody, 100)

  await chunkedCollections.forEachAsync(async (collectionList) => {
    const associationPayload = []

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
          const singleGranule = await getSingleGranule(id)

          if (singleGranule) {
            const {
              cloud_cover: cloudCover = false,
              day_night_flag: dayNightFlag,
              online_access_flag: onlineAccessFlag = false
            } = singleGranule

            const tagData = {
              cloud_cover: cloudCover !== undefined,
              day_night_flag: dayNightFlag && ['DAY', 'NIGHT', 'BOTH'].includes(dayNightFlag.toUpperCase()),
              granule_online_access_flag: onlineAccessFlag
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

  const { 'cmr-hits': cmrHits = 0 } = cmrCollectionResponse.headers

  console.log(`CMR returned ${cmrHits} collections. Current page number is ${pageNumber}, iterating through ${pageSize} at a time.`)

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
