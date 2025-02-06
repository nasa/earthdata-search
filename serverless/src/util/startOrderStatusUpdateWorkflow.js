import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn'

import { getStepFunctionsConfig } from './aws/getStepFunctionsConfig'
import { parseError } from '../../../sharedUtils/parseError'
import { mockStepFunction } from './mockStepFunction'

/**
 * Initiate an order status workflow
 * @param {String} orderId Database ID for an order to retrieve
 * @param {String} accessToken CMR access token
 */
export const startOrderStatusUpdateWorkflow = async (orderId, accessToken, orderType) => {
  const inputObject = {
    id: orderId,
    accessToken,
    orderType
  }
  try {
    // If we're in development mode and we're not skipping SQS, mock the step function
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_SQS !== 'true') {
      console.log(`Starting order status update workflow for order ID: ${orderId}`)

      // Run the `UpdateOrderStatus` step function with the given input
      mockStepFunction('UpdateOrderStatus', inputObject)

      // Return so we don't try to run the real step function
      return
    }

    const client = new SFNClient(getStepFunctionsConfig())
    const input = {
      stateMachineArn: process.env.UPDATE_ORDER_STATUS_STATE_MACHINE_ARN,
      input: JSON.stringify(inputObject)
    }
    const command = new StartExecutionCommand(input)
    const response = await client.send(command)

    console.log(`State Machine Invocation (Order ID: ${orderId}): `, response)
  } catch (error) {
    parseError(error)
  }
}
