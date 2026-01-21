import CmrRequest from '../cmrRequest'

import * as getClientId from '../../../../../../sharedUtils/getClientId'

const baseUrl = 'http://example.com'

describe('CmrRequest#constructor', () => {
  test('sets the default values', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual(baseUrl)
    expect(request.lambda).toBeFalsy()
    expect(request.searchPath).toEqual('')
  })

  test('throws an error when no baseUrl value is provided', () => {
    expect(() => {
      CmrRequest()
    }).toThrow()
  })
})

describe('CmrRequest#getEdlToken', () => {
  test('returns the auth token', () => {
    const request = new CmrRequest(baseUrl, 'prod')
    request.edlToken = 'test auth token'

    expect(request.getEdlToken()).toEqual('test auth token')
  })

  test('returns an empty string if optionallyAuthenticated', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    request.optionallyAuthenticated = true

    expect(request.getEdlToken()).toEqual('')
  })
})

describe('CmrRequest#permittedCmrKeys', () => {
  test('returns an empty array', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    expect(request.permittedCmrKeys()).toEqual([])
  })
})

describe('CmrRequest#nonIndexedKeys', () => {
  test('returns an empty array', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    expect(request.nonIndexedKeys()).toEqual([])
  })
})

describe('CmrRequest#transformRequest', () => {
  test('adds authorization header when authenticated', () => {
    const request = new CmrRequest(baseUrl, 'prod')
    const token = '123'

    request.authenticated = true
    request.edlToken = token

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer 123'
    }))
  })

  test('adds client-id header when not authenticated', () => {
    vi.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ client: 'eed-edsc-test-serverless-client' }))

    const request = new CmrRequest(baseUrl, 'prod')

    request.authenticated = false

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      'Client-Id': 'eed-edsc-test-serverless-client'
    }))
  })

  test('correctly transforms data for CMR requests', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    const data = { ParamName: 123 }

    vi.spyOn(CmrRequest.prototype, 'permittedCmrKeys').mockImplementation(() => ['param_name'])

    const transformedData = request.transformRequest(data, {})

    expect(transformedData).toEqual('param_name=123')
  })

  test('correctly transforms data for Lambda requests', () => {
    const request = new CmrRequest(baseUrl, 'prod')
    request.lambda = true
    request.startTime = 1576855756

    const data = { paramName: 123 }

    vi.spyOn(CmrRequest.prototype, 'permittedCmrKeys').mockImplementation(() => ['param_name'])

    const transformedData = request.transformRequest(data, {})

    const parsedData = JSON.parse(transformedData)
    expect(parsedData).toEqual({
      params: {
        param_name: 123
      },
      requestId: expect.any(String)
    })
  })
})

describe('CmrRequest#transformResponse', () => {
  test('returns data', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    const data = { param1: 123 }
    const result = request.transformResponse(data)

    expect(result).toEqual({ param1: 123 })
  })
})

describe('CmrRequest#search', () => {
  test('calls CmrRequest#post', () => {
    const request = new CmrRequest(baseUrl, 'prod')

    const postMock = vi.spyOn(CmrRequest.prototype, 'post').mockImplementation()

    const params = {
      param1: 12,
      ext: 'json'
    }
    request.search(params)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('', params)
  })
})
