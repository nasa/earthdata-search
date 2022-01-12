import GraphQlRequest from '../graphQlRequest'

import * as getClientId from '../../../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('GraphQlRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new GraphQlRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('graphql')
  })

  test('sets the default values when unauthenticated', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ graphQlHost: 'https://graphql.earthdata.nasa.gov' }))

    const request = new GraphQlRequest(undefined, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://graphql.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('api')
  })
})

describe('GraphQlRequest#transformRequest', () => {
  test('adds authorization header when authenticated', () => {
    const request = new GraphQlRequest(undefined, 'prod')
    const token = '123'

    request.authenticated = true
    request.authToken = token

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer 123'
    }))
  })

  test('adds client-id header when not authenticated', () => {
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ client: 'eed-edsc-test-serverless-client' }))

    const request = new GraphQlRequest(undefined, 'prod')

    request.authenticated = false

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      'Client-Id': 'eed-edsc-test-serverless-client'
    }))
  })

  test('correctly transforms data for CMR requests', () => {
    const request = new GraphQlRequest(undefined, 'prod')

    const data = { ParamName: 123 }

    const transformedData = request.transformRequest(data, {})

    expect(transformedData).toEqual('{"ParamName":123}')
  })

  test('correctly transforms data for Lambda requests', () => {
    const request = new GraphQlRequest(undefined, 'prod')
    request.lambda = true
    request.startTime = 1576855756

    const data = { paramName: 123 }

    const transformedData = request.transformRequest(data, {})

    const parsedData = JSON.parse(transformedData)
    expect(parsedData).toEqual({
      data: {
        paramName: 123
      },
      requestId: expect.any(String)
    })
  })

  test('adds content type header when making direct calls', () => {
    const request = new GraphQlRequest(undefined, 'prod')

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      'Content-Type': 'application/json'
    }))
  })
})

describe('GraphQlRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(GraphQlRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new GraphQlRequest(undefined, 'prod')

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})
