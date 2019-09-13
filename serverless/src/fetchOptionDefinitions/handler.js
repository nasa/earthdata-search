import AWS from 'aws-sdk'

import 'array-foreach-async'
import request from 'request-promise'
import { stringify } from 'qs'
import { getClientId, getEarthdataConfig } from '../../../sharedUtils/config'
import { getSystemToken } from '../util/urs/getSystemToken'
import { getSingleGranule } from '../util/cmr/getSingleGranule'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'

// AWS SQS adapter
let sqs
let cmrToken

const fetchOptionDefinitions = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (!sqs) {
    sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
  }

  const { Records: sqsRecords = [] } = event

  console.log(`Processing ${sqsRecords.length} tag(s)`)

  cmrToken = await getSystemToken(cmrToken)

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
      const { order_information: orderInformation = {} } = body[0]
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
            tagName: 'edsc.extra.serverless.subset_service.echo_orders',
            action: 'ADD',
            tagData
          })
        }).promise()
      } else {
        console.log(`No Option Definitions for ${collectionId}, skipping 'edsc.extra.serverless.subset_service.echo_orders' tag.`)
      }
    } catch (e) {
      console.log(e)
    }
  })
}

export default fetchOptionDefinitions
