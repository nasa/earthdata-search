/**
 * This script creates a Fastify server that proxies requests to Lambda functions.
 *
 * It will use `getApiResources` to get the API Gateway resources and associated Lambda functions.
 * Then it will create routes for each of the resources and call the associated Lambda function.
 *
 * If the lambda function has an authorizer, it will call the authorizer before calling the Lambda function.
 * If the authorizer fails, it will return a 401 Unauthorized response. It the authorizer succeeds, it will add the authorizer response to the request context.
 *
 * If the Lambda function returns a base64 encoded response, it will return the response as a buffer. This is necessary for the scale image lambda.
 */

import Fastify from 'fastify'
import cors from '@fastify/cors'

// eslint-disable-next-line import/extensions
import { getApiResources } from './getApiResources.mjs'

// Get the template path from command line arguments
const templateFilePath = process.argv[2]
if (!templateFilePath) {
  console.error('Please provide the path to the CloudFormation template as a command line argument.')
  process.exit(1)
}

// Create a wrapper function to call the Lambda function
const lambdaProxyWrapper = (method) => async (request, reply) => {
  const {
    authorizer,
    lambdaFunction
  } = method

  const {
    path: authorizerHandlerPath
  } = authorizer

  const {
    path: handlerPath
  } = lambdaFunction

  let authorizerResponse = {}

  // Call the authorizer if it is defined
  if (method.authorizer?.functionName) {
    try {
      const { default: authorizerHandler } = (await import(authorizerHandlerPath)).default

      // Create the event object to pass to the lambda
      const authEvent = {
        body: request.body,
        headers: request.headers,
        httpMethod: request.method,
        pathParameters: request.params,
        queryStringParameters: request.query,
        requestContext: {
          resourcePath: request.url
        }
      }

      console.log(`Calling authorizer: ${method.authorizer.functionName}`)
      authorizerResponse = await authorizerHandler(authEvent, {})
    } catch (error) {
      console.log(`Authorizer error: ${error}`)

      // Return unauthorized if the authorizer fails
      return reply.send({
        statusCode: 401
      })
    }
  }

  // Create the event object to pass to the lambda
  const event = {
    body: typeof request.body === 'object' ? JSON.stringify(request.body) : request.body,
    headers: request.headers,
    httpMethod: request.method,
    pathParameters: request.params,
    queryStringParameters: request.query,
    requestContext: {}
  }

  // Add the authorizer response to the request context if it exists
  if (authorizerResponse?.context) {
    event.requestContext.authorizer = authorizerResponse?.context
  }

  console.log(`Calling lambda: ${method.lambdaFunction.functionName}`)
  const { default: handler } = (await import(handlerPath)).default
  // Call the lambda function
  const response = await handler(event, {})

  const {
    body: responseBody,
    headers = {},
    isBase64Encoded,
    statusCode
  } = response

  // Set the response status code and headers
  reply.code(statusCode)
  reply.headers(headers)

  // If the response is base64 encoded, return the response as a buffer
  // This is necessary for the scale image lambda
  if (isBase64Encoded) {
    return reply.send(Buffer.from(responseBody, 'base64'))
  }

  // Return JSON response
  return reply.send(responseBody)
}

// Create a Fastify server
const fastify = Fastify({
  bodyLimit: 1048576 * 10, // 1MB * 10
  logger: true,
  requestTimeout: 30000,
  requestIdHeader: 'x-request-id'
})

// Add CORS support
fastify.register(cors)

// Add support for application/x-www-form-urlencoded
fastify.addContentTypeParser('application/x-www-form-urlencoded', { parseAs: 'string' }, (req, body, done) => {
  let returnBody = JSON.stringify({ body })

  try {
    if (JSON.parse(body)) {
      returnBody = body
    }
  } catch (error) {
    console.log('fastify.addContentTypeParser ~ error:', error)
  }

  done(null, returnBody)
})

// Add the routes to the Fastify server
const addRoutes = async () => {
  // Get the API resources from the template
  const apiResources = getApiResources(templateFilePath)

  const keys = Object.keys(apiResources).sort()
  await Promise.all(keys.map(async (resourcePath) => {
    const {
      fullPath,
      methods
    } = apiResources[resourcePath]

    await Promise.all(methods.map(async (method) => {
      const {
        httpMethod
      } = method

      // Replace the path parameters with Fastify route parameters
      // {id} -> :id
      const path = fullPath.replace(/\/\{(.*?)\}/g, '/:$1')

      console.log(`Adding route: ${httpMethod.padEnd(6)} - ${path}`)

      // Add the route to the Fastify server
      fastify[httpMethod.toLowerCase()](`/${path}`, lambdaProxyWrapper(method))
    }))
  }))
}

// Start the Fastify server after adding the routes
addRoutes().then(() => {
  fastify.listen({ port: 3001 })
})
