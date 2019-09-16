import AWS from 'aws-sdk'

/**
 * Initiate an order status workflow
 * @param {String} orderId Database ID for an order to retrieve
 * @param {String} accessToken CMR access token
 */
export const startOrderStatusUpdateWorkflow = async (orderId, accessToken, orderType) => {
  try {
    const stepfunctions = new AWS.StepFunctions()

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
    console.log(e)
  }
}
