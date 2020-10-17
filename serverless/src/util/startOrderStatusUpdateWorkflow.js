import AWS from 'aws-sdk'

import { getStepFunctionsConfig } from './aws/getStepFunctionsConfig'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Initiate an order status workflow
 * @param {String} orderId Database ID for an order to retrieve
 * @param {String} accessToken CMR access token
 */
export const startOrderStatusUpdateWorkflow = async (orderId, accessToken, orderType) => {
  try {
    const stepfunctions = new AWS.StepFunctions(getStepFunctionsConfig())

    const stepFunctionResponse = await stepfunctions.startExecution({
      stateMachineArn: process.env.updateOrderStatusStateMachineArn,
      input: JSON.stringify({
        id: orderId,
        accessToken,
        orderType
      })
    }).promise()

    console.log(`State Machine Invocation (Order ID: ${orderId}): `, stepFunctionResponse)
  } catch (e) {
    parseError(e)
  }
}
