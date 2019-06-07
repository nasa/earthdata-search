import 'array-foreach-async'
import AWS from 'aws-sdk'

import { chunkArray } from '../util'
import { getRelevantServices } from './getRelevantServices'
import { pageAllCmrResults } from './pageAllCmrResults'

let sqs

/**
 * Handler to process subsetting information from UMM S associations on collections
 */
const generateSubsettingTags = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line
  context.callbackWaitsForEmptyEventLoop = false

  sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

  // The headers we'll send back regardless of our response
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }

  // Retrive only those service objects that match the types edsc subsets
  const serviceObjects = await getRelevantServices()

  const allCollectionsWithServices = []
  const chunkedServices = chunkArray(Object.keys(serviceObjects), 100)
  await chunkedServices.forEachAsync(async (chunk) => {
    const allCmrCollections = await pageAllCmrResults('search/collections.json', {
      service_concept_id: chunk
    })

    allCollectionsWithServices.push(...allCmrCollections)
  })

  await allCollectionsWithServices.forEach((collection) => {
    const { associations = {} } = collection
    const { services = [] } = associations

    services.forEach((collectionService) => {
      if (Object.keys(serviceObjects).includes(collectionService)) {
        serviceObjects[collectionService].collections.push(collection.id)
      }
    })
  })

  // Keep track of collections per type so that we can remove old tags
  const collectionsToTag = {
    esi: [],
    opendap: []
  }

  await Object.keys(serviceObjects).forEachAsync(async (serviceConceptId) => {
    const serviceForTagging = serviceObjects[serviceConceptId]

    const { collections, tagData } = serviceForTagging
    const { type } = tagData

    if (collections.length) {
      try {
        const tagPostFix = type.toLowerCase()

        const collectionCriteria = collections.map(collectionId => ({ concept_id: collectionId }))

        if (['opendap', 'esi'].includes(tagPostFix)) {
          collectionsToTag[tagPostFix].push(...collectionCriteria)
        }

        const searchCriteria = {
          condition: {
            or: collectionCriteria
          }
        }

        await sqs.sendMessage({
          QueueUrl: process.env.tagQueueUrl,
          MessageBody: JSON.stringify({
            tagName: `edsc.extra.serverless.subset_service.${tagPostFix}`,
            action: 'ADD',
            append: false,
            requireGranules: false,
            searchCriteria,
            tagData
          })
        }).promise()
      } catch (e) {
        console.log(e)
      }
    }
  })

  // Remove tags from collections that don't meet the criteria defined above
  await Object.keys(collectionsToTag).forEachAsync(async (tagPostFix) => {
    const removeTagCriteria = {
      condition: {
        and: [
          {
            tag: { tag_key: `edsc.extra.serverless.subset_service.${tagPostFix}` }
          }
        ]
      }
    }

    const taggedCollections = collectionsToTag[tagPostFix]

    if (taggedCollections.length) {
      removeTagCriteria.condition.and.push({
        not: { or: taggedCollections }
      })
    }

    try {
      await sqs.sendMessage({
        QueueUrl: process.env.tagQueueUrl,
        MessageBody: JSON.stringify({
          tagName: `edsc.extra.serverless.subset_service.${tagPostFix}`,
          action: 'REMOVE',
          searchCriteria: removeTagCriteria
        })
      }).promise()
    } catch (e) {
      console.log(e)
    }
  })

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({})
  }
}

export default generateSubsettingTags
