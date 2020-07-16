import AWS from 'aws-sdk'

import 'array-foreach-async'
import request from 'request-promise'
import { stringify } from 'qs'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getSingleGranule } from '../util/cmr/getSingleGranule'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { tagName } from '../../../sharedUtils/tags'
import { parseError } from '../../../sharedUtils/parseError'
import { getClientId } from '../../../sharedUtils/getClientId'

// AWS SQS adapter
let sqs

/**
 * Redirects the user to the correct EDL login URL
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const fetchOptionDefinitions = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { Records: sqsRecords = [] } = event

  if (sqsRecords.length === 0) return

  console.log(`Processing ${sqsRecords.length} tag(s)`)

  // Retrieve a connection to the database
  const cmrToken = await getSystemToken()

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

  const { echoRestRoot } = getEarthdataConfig(cmrEnv())

  // Retrieve option definition data for the collections pertaining to the echo orders tag
  const optionDefinitionUrl = `${echoRestRoot}/order_information.json`

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    const collectionGranuleAssocation = JSON.parse(body)
    const { collectionId, tagData: providedTagData } = collectionGranuleAssocation

    try {
      const singleGranule = await getSingleGranule(cmrToken, collectionId)

      const { id: granuleId } = singleGranule

      const optionDefinitionResponse = await request.post({
        uri: optionDefinitionUrl,
        form: stringify({
          'catalog_item_id[]': granuleId
        }, { indices: false, arrayFormat: 'brackets' }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Echo-Token': cmrToken,
          'Client-Id': getClientId().background
        },
        json: true,
        resolveWithFullResponse: true
      })

      const { body } = optionDefinitionResponse
      const [optionDefinition] = body
      const { order_information: orderInformation } = optionDefinition
      const { option_definition_refs: optionDefinitions = [] } = orderInformation

      // Merge the option definitions into the previous tag data
      const tagData = [{
        'concept-id': collectionId,
        data: {
          ...providedTagData,
          option_definitions: optionDefinitions.map((def) => {
            const { id, name } = def

            return {
              id,
              name
            }
          })
        }
      }]

      if (optionDefinitions.length) {
        await sqs.sendMessage({
          QueueUrl: process.env.tagQueueUrl,
          MessageBody: JSON.stringify({
            tagName: tagName('subset_service.echo_orders'),
            action: 'ADD',
            tagData
          })
        }).promise()
      } else {
        console.log(`No Option Definitions for ${collectionId}, skipping '${tagName('subset_service.echo_orders')}' tag.`)
      }
    } catch (e) {
      parseError(e)
    }
  })
}

export default fetchOptionDefinitions
