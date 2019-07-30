import AWS from 'aws-sdk'

const stepfunctions = new AWS.StepFunctions();

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

export const startOrderStatusUpdateWorkflow = (orderId, accessToken) => {
  stepfunctions.startExecution({
    stateMachineArn: process.env.updateOrderStatusStateMachineArn,
    input: JSON.stringify({
      id: orderId,
      accessToken: accessToken
    })
  }, (err, data => {
    if (err) {
      console.log(err)
    } else {
      console.log('state machine invocation:', data)
    }
  }))
}

export const normalizeLegacyServicesOrderStatus = legacyServicesOrder => {
  const orderStatus = legacyServicesOrder.status;
  return Object.keys(legacyServicesStatusMap).find(k => {
    return legacyServicesStatusMap[k].includes(orderStatus)
  })
}

export const normalizeCatalogRestOrderStatus = catalogRestOrder => {
  const orderStatus = catalogRestOrder.requestStatus.status;
  return Object.keys(catalogRestStatusMap).find(k => {
    return catalogRestStatusMap[k].includes(orderStatus)
  })
}
