import axios from 'axios'
import 'array-foreach-async'
import AWS from 'aws-sdk'

import { constructLayerTagData } from './constructLayerTagData'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { getSupportedGibsLayers } from './getSupportedGibsLayers'
import { getSystemToken } from '../util/urs/getSystemToken'
import { parseError } from '../../../sharedUtils/parseError'
import { tagName } from '../../../sharedUtils/tags'

// AWS SQS adapter
let sqs

/**
 * Handler to process product information from world view and tag CMR collections
 */
const generateGibsTags = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

  // Retrieve a connection to the database
  const cmrToken = await getSystemToken()

  // The headers we'll send back regardless of our response
  const { defaultResponseHeaders } = getApplicationConfig()

  const supportedGibsLayers = await getSupportedGibsLayers()

  const layerTagData = []

  Object.keys(supportedGibsLayers).forEach(async (key) => {
    const gibsLayer = supportedGibsLayers[key]

    const layerConfigs = constructLayerTagData(gibsLayer)

    layerTagData.push(...layerConfigs)
  })

  // Given concept ids we can make tags directly without using cmr search
  let conceptIdLayers = {}

  // As we iterate through all the layerTagDatas we'll keep track of
  // each individual configuration; we'll then tell CMR to delete tags on
  // any collection that does match the compiled configurations
  const allTagConditions = []

  // When we already have a concept id we dont need to provide searchCriteria to `addTag` but we need to modify
  // the payload a bit to include it
  await layerTagData.forEachAsync(async (tagData) => {
    const { collection, data: collectionTagData } = tagData

    const { condition } = collection

    const { concept_id: conceptId } = condition

    allTagConditions.push(condition)

    // If this layer is specific to a concept id already
    if (conceptId) {
      const { [conceptId]: existingLayer = [] } = conceptIdLayers

      conceptIdLayers = {
        ...conceptIdLayers,
        [conceptId]: [
          ...existingLayer,
          collectionTagData
        ]
      }
    } else {
      try {
        const collectionJsonQlUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/collections`

        const cmrResponse = await axios({
          method: 'post',
          url: collectionJsonQlUrl,
          data: JSON.stringify(collection),
          headers: {
            'Client-Id': getClientId().background,
            'Content-Type': 'application/json',
            'Echo-Token': cmrToken
          }
        })

        const { data = {} } = cmrResponse
        const { feed = {} } = data
        const { entry = [] } = feed

        entry.forEach((entry) => {
          const { id } = entry

          const { [conceptId]: existingLayer = [] } = conceptIdLayers

          conceptIdLayers = {
            ...conceptIdLayers,
            [id]: [
              ...existingLayer,
              collectionTagData
            ]
          }
        })
      } catch (e) {
        parseError(e)
      }
    }
  })

  await Object.keys(conceptIdLayers).forEachAsync(async (conceptId) => {
    const { [conceptId]: tagData } = conceptIdLayers

    await sqs.sendMessage({
      QueueUrl: process.env.tagQueueUrl,
      MessageBody: JSON.stringify({
        tagName: tagName('gibs'),
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': conceptId,
          data: tagData
        }
      })
    }).promise()
  })

  // Remove stale tags
  if (Object.keys(conceptIdLayers).length > 0) {
    // If conceptIdLayers contains values we want to ensure we delete tags
    // from only the collections that arent within it
    await sqs.sendMessage({
      QueueUrl: process.env.tagQueueUrl,
      MessageBody: JSON.stringify({
        tagName: tagName('gibs'),
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            and: [
              {
                tag: {
                  tag_key: tagName('gibs')
                }
              },
              {
                not: {
                  or: Object.keys(conceptIdLayers).map((conceptId) => ({ concept_id: conceptId }))
                }
              }
            ]
          }
        }
      })
    }).promise()
  } else {
    // If no collections were found to match the gibs criteria, we'll just delete all the tags.
    await sqs.sendMessage({
      QueueUrl: process.env.tagQueueUrl,
      MessageBody: JSON.stringify({
        tagName: tagName('gibs'),
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            tag: {
              tag_key: tagName('gibs')
            }
          }
        }
      })
    }).promise()
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify(allTagConditions)
  }
}

export default generateGibsTags
