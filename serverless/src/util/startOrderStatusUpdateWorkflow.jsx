import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn'

import { getStepFunctionsConfig } from './aws/getStepFunctionsConfig'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Initiate an order status workflow
 * @param {String} orderId Database ID for an order to retrieve
 * @param {String} accessToken CMR access token
 */
export const startOrderStatusUpdateWorkflow = async (orderId, accessToken, orderType) => {
  try {
    const client = new SFNClient(getStepFunctionsConfig())
    const input = {
      stateMachineArn: process.env.updateOrderStatusStateMachineArn,
      input: JSON.stringify({
        id: orderId,
        accessToken,
        orderType
      })
    }
    const command = new StartExecutionCommand(input)
    const response = await client.send(command)

    console.log(`State Machine Invocation (Order ID: ${orderId}): `, response)
  } catch (error) {
    parseError(error)
  }
}
