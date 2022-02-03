import 'array-foreach-async'
import AWS from 'aws-sdk'
import axios from 'axios'

import { chunkArray } from '../util/chunkArray'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { getRelevantServices } from './getRelevantServices'
import { getServiceOptionDefinitionIdNamePairs } from './getServiceOptionDefinitionIdNamePairs'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { getSystemToken } from '../util/urs/getSystemToken'
import { pageAllCmrResults } from '../util/cmr/pageAllCmrResults'
import { parseError } from '../../../sharedUtils/parseError'
import { tagName } from '../../../sharedUtils/tags'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

// AWS SQS adapter
let sqs

/**
 * Process subsetting information from UMM S associations on collections
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const generateSubsettingTags = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const cmrToken = await getSystemToken()

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

  // The headers we'll send back regardless of our response
  const { defaultResponseHeaders } = getApplicationConfig()

  const { echoRestRoot } = getEarthdataConfig(deployedEnvironment())

  // Retrieve all known service option associations to use later when constructing
  // tag data payloads for ESI collections
  let serviceOptionAssignments = []

  // Service option assignments don't store the name of the service option so we have
  // to retrieve them separately -- we will use this to store a simple key value pair
  // mapping id => name
  let serviceOptionIdNamePairs = {}

  const serviceOptionAssignmentUrl = `${echoRestRoot}/service_option_assignments.json`
  try {
    const serviceOptionResponse = await wrappedAxios({
      method: 'get',
      url: serviceOptionAssignmentUrl,
      headers: {
        'Client-Id': getClientId().background,
        'Echo-Token': cmrToken
      }
    })

    const { config, data } = serviceOptionResponse
    const { elapsedTime } = config

    console.log(`Request for ${data.length} service options assignments successfully completed in ${elapsedTime} ms`)

    serviceOptionAssignments = data

    const serviceOptionIds = serviceOptionAssignments.map((optionAssociation) => {
      const { service_option_assignment: optionAssignment } = optionAssociation
      const { service_option_definition_id: optionId } = optionAssignment

      return optionId
    })

    serviceOptionIdNamePairs = await getServiceOptionDefinitionIdNamePairs(
      cmrToken,
      serviceOptionIds
    )
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }

  // Retrieve only those service objects that match the types edsc subsets
  const serviceObjects = await getRelevantServices(cmrToken)

  console.log(`Retrieved ${Object.keys(serviceObjects).length} services from CMR.`)

  const allCollectionsWithServices = []
  const chunkedServices = chunkArray(Object.keys(serviceObjects), 100)

  await chunkedServices.forEachAsync(async (chunk) => {
    const allCmrCollections = await pageAllCmrResults({
      cmrToken,
      deployedEnvironment: deployedEnvironment(),
      path: 'search/collections.json',
      queryParams: {
        service_concept_id: chunk,
        has_granules: true
      }
    })

    allCollectionsWithServices.push(...allCmrCollections)
  })

  console.log('Retrieved all the collections that have UMM Services we need.')

  allCollectionsWithServices.forEach((collection) => {
    const { associations = {} } = collection
    const { services = [] } = associations

    services.forEach(async (collectionService) => {
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
      // Convert the CMR Service Type to a lowercase string with no spaces
      const tagPostFix = type.toLowerCase().replace(/ /g, '_')
      const collectionTagData = await Promise.all(collections.map(async (collection) => {
        const { id: collectionId } = collection

        // We're adding to the provided object so we use assign to prevent eslint issues
        const data = {
          updated_at: new Date().toISOString(),
          ...tagData
        }

        // Retrieve the service option definition (Echo Form Association) for ESI collections
        if (tagPostFix === 'esi') {
          const foundOptionAssignments = serviceOptionAssignments.filter((optionAssociation) => {
            const { service_option_assignment: optionAssignment } = optionAssociation
            const { catalog_item_id: conceptId } = optionAssignment

            return conceptId === collectionId
          })

          if (foundOptionAssignments.length > 0) {
            data.service_option_definitions = foundOptionAssignments.map((foundServiceOption) => {
              const { service_option_assignment: serviceOptionAssignment } = foundServiceOption
              const { service_option_definition_id: optionDefinitionId } = serviceOptionAssignment

              return {
                id: optionDefinitionId,
                name: serviceOptionIdNamePairs[optionDefinitionId]
              }
            })
          }
        } else if (tagPostFix === 'echo_orders') {
          // Because we've already retrieved collection and we know it support echo orders we'll send
          // this data off to another lambda to fetch to add option definitions to echo_orders subsetting tags
          await sqs.sendMessage({
            QueueUrl: process.env.optionDefinitionQueueUrl,
            MessageBody: JSON.stringify({
              collectionId,
              tagData: data
            })
          }).promise()
        }

        return { 'concept-id': collectionId, data }
      }))

      // Only tag opendap and esi collections, echo_orders will be tagged using the option definition queue
      if (['opendap', 'esi', 'echo_orders'].includes(tagPostFix)) {
        const collectionCriteria = collections.map((collection) => ({ concept_id: collection.id }))

        // Construct an array that we'll negate and use for removing the tag from collections that don't appear here
        collectionsToTag[tagPostFix].push(...collectionCriteria)

        if (tagPostFix !== 'echo_orders') {
          await sqs.sendMessage({
            QueueUrl: process.env.tagQueueUrl,
            MessageBody: JSON.stringify({
              tagName: tagName(`subset_service.${tagPostFix}`),
              action: 'ADD',
              append: false,
              requireGranules: false,
              tagData: collectionTagData
            })
          }).promise()
        }
      }
    }
  })

  console.log('Completed creating an SQS message for all necessary ADD tags.')

  try {
    // Remove tags from collections that don't meet the criteria defined above
    await Object.keys(collectionsToTag).forEachAsync(async (tagPostFix) => {
      const removeTagCriteria = {
        condition: {
          and: [
            {
              tag: { tag_key: tagName(`subset_service.${tagPostFix}`) }
            }
          ]
        }
      }

      const taggedCollections = collectionsToTag[tagPostFix]

      if (taggedCollections.length) {
        removeTagCriteria.condition.and.push({
          not: { or: taggedCollections }
        })

        await sqs.sendMessage({
          QueueUrl: process.env.tagQueueUrl,
          MessageBody: JSON.stringify({
            tagName: tagName(`subset_service.${tagPostFix}`),
            action: 'REMOVE',
            searchCriteria: removeTagCriteria
          })
        }).promise()
      }
    })
  } catch (e) {
    parseError(e)
  }

  console.log('Completed creating an SQS message for all necessary REMOVED tags.')

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify({})
  }
}

export default generateSubsettingTags
