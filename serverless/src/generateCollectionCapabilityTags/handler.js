import 'array-foreach-async'

import AWS from 'aws-sdk'
import axios from 'axios'

import { stringify } from 'qs'

import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getCollectionCapabilities } from './getCollectionCapabilities'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { getSystemToken } from '../util/urs/getSystemToken'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { tagName } from '../../../sharedUtils/tags'

// AWS SQS Adapter
let sqs

const pageSize = 300

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

  const { conceptId } = input

  // eslint-disable-next-line no-param-reassign
  delete input.conceptId

  // If a concept id was provided add it to the request params to scope it down
  if (conceptId) cmrParams.concept_id = conceptId

  const { cmrHost } = getEarthdataConfig(deployedEnvironment())
  const collectionSearchUrl = `${cmrHost}/search/collections.json`

  const response = await axios({
    method: 'post',
    url: collectionSearchUrl,
    data: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
    headers: {
      'Client-Id': getClientId().background,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${cmrToken}`
    }
  })

  const cmrHits = parseInt(response.headers['cmr-hits'], 10)

  console.log(`CMR returned ${cmrHits} collections. Current page number is ${pageNumber}, tagging ${pageSize} collections.`)

  // All of the collections requested
  const collections = readCmrResults('search/collections.json', response)

  // Filter out collections that dont have any granules
  const collectionsWithGranules = collections.filter((collection) => {
    const {
      id,
      granule_count: granuleCount
    } = collection

    const hasGranules = granuleCount > 0

    if (!hasGranules) {
      console.log(`${id} has no granules, skipping ${tagName('collection_capabilities')} tag.`)
    }

    return hasGranules
  })

  console.log(`Number of collections with granules: ${collectionsWithGranules.length}`)

  // Build a list of associations to create
  const associationPayload = []

  await collectionsWithGranules.forEachAsync(async (collection) => {
    const { id } = collection

    const tagData = await getCollectionCapabilities({ cmrToken, collection })

    associationPayload.push({
      'concept-id': id,
      data: tagData
    })
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
