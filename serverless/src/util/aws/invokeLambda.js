import AWS from 'aws-sdk'
import { getLambdaConfig } from './getLambdaConfig'

/**
 * Invoke a Lambda function using the AWS SDK
 * @param {String} name Name of the Lambda to invoke
 * @param {Object} payload Payload to send to Lambda
 */
export const invokeLambda = async (name, payload, type = 'Event') => {
  // TODO: The purpose of this method is to return the appropriate
  // configuration regardless of environment (offline or aws)
  // but I can't yet figure out how to get serverless-offline-direct-lambda
  // working correctly
  if (process.env.IS_OFFLINE) {
    console.info(`Ignoring lambda invocation for ${name}`)

    return false
  }

  const lambda = new AWS.Lambda(getLambdaConfig())

  const lambdaPayload = {
    FunctionName: name,
    InvocationType: type,
    Payload: JSON.stringify(payload)
  }

  console.log(`Invoking ${name}`)

  return lambda.invoke(lambdaPayload).promise()
}
