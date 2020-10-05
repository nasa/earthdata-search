import 'array-foreach-async'
import AWS from 'aws-sdk'
import { groupBy, omit } from 'lodash'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { tagName } from '../../../sharedUtils/tags'
import { constructLayerTagData } from './constructLayerTagData'
import { getSupportedGibsLayers } from './getSupportedGibsLayers'
import { getApplicationConfig } from '../../../sharedUtils/config'

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
  const conceptIdLayers = groupBy(layerTagData, layer => layer.collection.condition.concept_id)

  // As we iterate through all the layerTagDatas we'll keep track of
  // each individual configuration; we'll then tell CMR to delete tags on
  // any collection that does match the compiled configurations
  const allTagConditions = []

  // conceptIdLayers are layers that apply to specific concept ids. When we already have a
  // concept id we dont need to provide searchCriteria to `addTag` but we need to modify
  // the payload a bit to include it
  await Object.keys(omit(conceptIdLayers, undefined)).forEachAsync(async (collectionId) => {
    const { [collectionId]: configurations } = conceptIdLayers

    const tagData = configurations.map((configuration) => {
      const { data } = configuration

      const { collection } = configuration
      const { condition } = collection

      allTagConditions.push(condition)

      return data
    })

    const [firstConfiguration] = configurations

    const { collection: searchCriteria } = firstConfiguration
    const { condition } = searchCriteria
    const { concept_id: conceptId } = condition

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

  // Shortname and provider require using the search endpoint to create tags as their concept ids are not yet known
  const shortNameLayers = groupBy(layerTagData, layer => layer.collection.condition.short_name)
  const providerLayers = groupBy(layerTagData, layer => layer.collection.condition.provider)

  const searchableLayers = {
    ...omit(shortNameLayers, undefined),
    ...omit(providerLayers, undefined)
  }
  await Object.keys(searchableLayers).forEachAsync(async (collectionId) => {
    const { [collectionId]: configurations } = searchableLayers

    const tagData = configurations.map((configuration) => {
      const { data } = configuration

      const { collection } = configuration
      const { condition } = collection

      allTagConditions.push(condition)

      return data
    })

    const [firstConfiguration] = configurations

    const { collection: searchCriteria } = firstConfiguration

    await sqs.sendMessage({
      QueueUrl: process.env.tagQueueUrl,
      MessageBody: JSON.stringify({
        tagName: tagName('gibs'),
        action: 'ADD',
        requireGranules: false,
        searchCriteria,
        tagData
      })
    }).promise()
  })

  // Remove stale tags
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
                or: allTagConditions
              }
            }
          ]
        }
      }
    })
  }).promise()

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify(allTagConditions)
  }
}

export default generateGibsTags
