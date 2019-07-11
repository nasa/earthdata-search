import 'array-foreach-async'
import AWS from 'aws-sdk'
import request from 'request-promise'
import { chunkArray } from '../util'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getRelevantServices } from './getRelevantServices'
import { pageAllCmrResults } from '../util/cmr/pageAllCmrResults'
import { getSystemToken } from '../util/urs/getSystemToken'

// AWS SQS adapter
let sqs
let cmrToken

/**
 * Handler to process subsetting information from UMM S associations on collections
 */
const generateSubsettingTags = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line
  context.callbackWaitsForEmptyEventLoop = false

  sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

  cmrToken = await getSystemToken(cmrToken)

  // The headers we'll send back regardless of our response
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }

  const { echoRestRoot } = getEarthdataConfig('prod')

  // Retrieve all known service option associations to use later when constructing
  // tag data payloads for ESI collections
  let serviceOptions = []
  const serviceOptionAssignmentUrl = `${echoRestRoot}/service_option_assignments.json`
  try {
    const serviceOptionResponse = await request.get({
      uri: serviceOptionAssignmentUrl,
      json: true,
      resolveWithFullResponse: true
    })

    serviceOptions = serviceOptionResponse.body
  } catch (e) {
    console.log(e)
  }

  // Retrive only those service objects that match the types edsc subsets
  const serviceObjects = await getRelevantServices()

  const allCollectionsWithServices = []
  const chunkedServices = chunkArray(Object.keys(serviceObjects), 100)

  await chunkedServices.forEachAsync(async (chunk) => {
    const allCmrCollections = await pageAllCmrResults('search/collections.json', {
      service_concept_id: chunk,
      has_granules: true
    })

    allCollectionsWithServices.push(...allCmrCollections)
  })

  await allCollectionsWithServices.forEachAsync(async (collection) => {
    const { associations = {} } = collection
    const { services = [] } = associations

    await services.forEachAsync(async (collectionService) => {
      if (Object.keys(serviceObjects).includes(collectionService)) {
        serviceObjects[collectionService].collections.push(collection)
      }
    })
  })

  // Keep track of collections per type so that we can remove old tags
  const collectionsToTag = {
    esi: [],
    opendap: [],
    echo_orders: []
  }

  await Object.keys(serviceObjects).forEachAsync(async (serviceConceptId) => {
    const serviceForTagging = serviceObjects[serviceConceptId]
    const { collections, tagData } = serviceForTagging
    const { type } = tagData

    if (collections.length) {
      try {
        // Convert the CMR Service Type to a lowercase string with no spaces
        const tagPostFix = type.toLowerCase().replace(/ /g, '_')
        const collectionTagData = await Promise.all(collections.map(async (collection) => {
          const { id: collectionId } = collection

          // We're adding to the provided object so we use assign to prevent eslint issues
          const data = Object.assign({
            updated_at: new Date().toISOString()
          }, tagData)

          // Retrieve the service option definition (Echo Form Association) for ESI collections
          if (tagPostFix === 'esi') {
            const foundServiceOption = serviceOptions.find((serviceOptionAssociation) => {
              const { service_option_assignment: optionAssignment } = serviceOptionAssociation
              const { catalog_item_id: conceptId } = optionAssignment

              return conceptId === collectionId
            })

            if (foundServiceOption) {
              const { service_option_assignment: serviceOptionAssignment } = foundServiceOption
              const { service_option_definition_id: optionDefinitionId } = serviceOptionAssignment

              data.service_option_definition = optionDefinitionId
            }
          } else if (tagPostFix === 'echo_orders') {
            // Because we've already retrieved collection and we know it support echo orders we'll send
            // this data off to another lambda to fetch to add option definitions to echo_orders subsetting tags
            try {
              await sqs.sendMessage({
                QueueUrl: process.env.optionDefinitionQueueUrl,
                MessageBody: JSON.stringify({
                  collectionId,
                  tagData: data
                })
              }).promise()
            } catch (e) {
              console.log(e)
            }
          }

          return { 'concept-id': collectionId, data }
        }))

        // Only tag opendap and esi collections, echo_orders will be tagged using the option definition queue
        if (['opendap', 'esi', 'echo_orders'].includes(tagPostFix)) {
          const collectionCriteria = collections.map(collection => ({ concept_id: collection.id }))

          // Construct an array that we'll negate and use for removing the tag from collections that don't appear here
          collectionsToTag[tagPostFix].push(...collectionCriteria)

          if (tagPostFix !== 'echo_orders') {
            await sqs.sendMessage({
              QueueUrl: process.env.tagQueueUrl,
              MessageBody: JSON.stringify({
                tagName: `edsc.extra.serverless.subset_service.${tagPostFix}`,
                action: 'ADD',
                append: false,
                requireGranules: false,
                tagData: collectionTagData
              })
            }).promise()
          }
        }
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
