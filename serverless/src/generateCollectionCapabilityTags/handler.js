import 'array-foreach-async'
import AWS from 'aws-sdk'
import request from 'request-promise'
import { stringify } from 'qs'
import { getSingleGranule } from '../util/cmr/getSingleGranule'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { tagName } from '../../../sharedUtils/tags'
import { getClientId } from '../../../sharedUtils/getClientId'

// AWS SQS Adapter
let sqs

const pageSize = 300

/**
 * Returns tags for a collection based on a single granule sample
 * @param {String} cmrToken The CMR token used to authenticate the request
 * @param {Object} collection Collection metadata
 */
const collectionTags = async (cmrToken, collection) => {
  const {
    id
  } = collection

  const singleGranule = await getSingleGranule(cmrToken, id)
  const {
    cloud_cover: cloudCover = false,
    day_night_flag: dayNightFlag,
    online_access_flag: onlineAccessFlag = false,
    orbit_calculated_spatial_domains: orbitCalculatedSpatialDomains = {}
  } = singleGranule

  return {
    cloud_cover: cloudCover !== undefined,
    day_night_flag: dayNightFlag && ['DAY', 'NIGHT', 'BOTH'].includes(dayNightFlag.toUpperCase()),
    granule_online_access_flag: onlineAccessFlag,
    orbit_calculated_spatial_domains: Object.keys(orbitCalculatedSpatialDomains).length > 0
  }
}

/**
 * Handler to process subsetting information from UMM S associations on collections
 */
const generateCollectionCapabilityTags = async (input) => {
  // CMR uses 1-based indexing for pages, default to page 1
  const { pageNumber = 1 } = input

  // Retrieve a connection to the database
  const cmrToken = await getSystemToken()

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

  const cmrParams = {
    has_granules: true,
    page_num: pageNumber,
    page_size: pageSize,
    include_granule_counts: true,
    include_tags: tagName('*')
  }

  const { cmrHost } = getEarthdataConfig(cmrEnv())
  const collectionSearchUrl = `${cmrHost}/search/collections.json`

  const cmrCollectionResponse = await request.post({
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

  const { 'cmr-hits': cmrHits = 0 } = cmrCollectionResponse.headers

  console.log(`CMR returned ${cmrHits} collections. Current page number is ${pageNumber}, tagging ${pageSize} collections.`)

  // All of the collections requested
  const collections = readCmrResults(collectionSearchUrl, cmrCollectionResponse)

  // Filter out collections that dont have any granules
  const collectionsWithGranules = collections.filter(collection => collection.granule_count > 0)

  console.log(`Number of collections with granules: ${collectionsWithGranules.length}`)

  // Build a list of associations to create
  const associationPayload = []

  await collectionsWithGranules.forEachAsync(async (collection) => {
    const { id } = collection
    try {
      // Discovered CMR-5890, need to skip records throwing 500s
      const tagData = await collectionTags(cmrToken, collection)
      associationPayload.push({
        'concept-id': id,
        data: tagData
      })
    } catch (e) {
      console.log(e)
    }
  })

  if (associationPayload.length > 0) {
    console.log(`Submitting ${associationPayload.length} tags to SQS for tagging`)

    await sqs.sendMessage({
      QueueUrl: process.env.tagQueueUrl,
      MessageBody: JSON.stringify({
        tagName: tagName('collection_capabilities'),
        action: 'ADD',
        tagData: associationPayload
      })
    }).promise()
  }

  return {
    hasMoreCollections: pageNumber * pageSize < cmrHits,
    pageNumber: pageNumber + 1
  }
}

export default generateCollectionCapabilityTags
