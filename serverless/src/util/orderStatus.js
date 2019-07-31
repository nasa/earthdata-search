import AWS from 'aws-sdk'

const stepfunctions = new AWS.StepFunctions()

const legacyServicesStatusMap = {
  in_progress: ['NOT_VALIDATED', 'VALIDATED', 'QUOTING', 'QUOTED', 'QUOTED_WITH_EXCEPTIONS', 'SUBMITTING', 'SUBMITTED_WITH_EXCEPTIONS', 'PROCESSING', 'PROCESSING_WITH_EXCEPTIONS'],
  complete: ['CLOSED'],
  failed: ['CANCELLING', 'CANCELLED', 'CLOSED_WITH_EXCEPTIONS']
}

const catalogRestStatusMap = {
  in_progress: ['pending', 'processing'],
  complete: ['complete', 'complete_with_errors'],
  failed: ['failed']
}

/**
 * Initiate an order status workflow
 * @param {String} orderId Database ID for an order to retrieve
 * @param {String} accessToken CMR access token
 */
export const startOrderStatusUpdateWorkflow = (orderId, accessToken) => {
  try {
    const stepFunctionResponse = stepfunctions.startExecution({
      stateMachineArn: process.env.updateOrderStatusStateMachineArn,
      input: JSON.stringify({
        id: orderId,
        accessToken
      })
    }).promise()

    console.log('State Machine InvocatioN: ', stepFunctionResponse)
  } catch (e) {
    console.log(e)
  }
}

/**
 * Normalize the order status returned from Legacy Services
 * @param {Object} legacyServicesOrder Response body from Legacy Services order endpoint
 */
export const normalizeLegacyServicesOrderStatus = (legacyServicesOrder) => {
  const orderStatus = legacyServicesOrder.status

  return Object.keys(legacyServicesStatusMap)
    .find(k => legacyServicesStatusMap[k].includes(orderStatus))
}

/**
 * Normalize the order status returned from Catalog Rest
 * @param {Object} catalogRestOrder Response body from Catalog Rest order endpoint
 */
export const normalizeCatalogRestOrderStatus = (catalogRestOrder) => {
  const orderStatus = catalogRestOrder.requestStatus.status

  return Object.keys(catalogRestStatusMap)
    .find(k => catalogRestStatusMap[k].includes(orderStatus))
}
