import jwt from 'jsonwebtoken'
import request from 'request-promise'

import * as getEarthdataConfig from '../../../sharedUtils/config'

import {
  pick,
  buildURL,
  doSearchRequest,
  prepareExposeHeaders,
  getSystemToken,
  getJwtToken
} from '../util'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('util#pick', () => {
  test('correctly returns when null is provided', () => {
    const data = pick(null, ['a'])

    expect(Object.keys(data).sort()).toEqual([])
  })

  test('correctly returns when undefined is provided', () => {
    const data = pick(undefined, ['a'])

    expect(Object.keys(data).sort()).toEqual([])
  })

  test('correctly picks whitelisted keys', () => {
    const object = {
      a: 1,
      b: 2,
      array: [1, 2, 3],
      obj: { c: 3 }
    }
    const desiredKeys = ['array', 'b']

    const data = pick(object, desiredKeys)

    expect(Object.keys(data).sort()).toEqual(['array', 'b'])
  })
})

describe('util#buildURL', () => {
  test('correctly builds a search URL', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const body = '{"params":{"param1":123,"param2":"abc","param3":["987"]}}'
    const permittedCmrKeys = [
      'param1',
      'param2',
      'param3'
    ]
    const nonIndexedKeys = [
      'param3'
    ]

    const params = {
      body,
      nonIndexedKeys,
      path: '/search/path',
      permittedCmrKeys
    }
    expect(buildURL(params)).toEqual('http://example.com/search/path?param1=123&param2=abc&param3%5B%5D=987')
  })
})

describe('util#prepareExposeHeaders', () => {
  test('appends jwt-token to expose headers when they exist', () => {
    expect(prepareExposeHeaders({ 'access-control-expose-headers': 'header-1' })).toEqual('header-1, jwt-token')
  })

  test('returns jwt-token when no expose headers exist', () => {
    expect(prepareExposeHeaders({})).toEqual('jwt-token')
  })
})

describe('util#doSearchRequest', () => {
  test('correctly returns the search response', async () => {
    const body = { success: true }
    const headers = {
      'access-control-expose-headers': 'jwt-token',
      'jwt-token': '123.456.789'
    }
    const statusCode = 200
    const expectedResponse = {
      body,
      headers,
      statusCode
    }

    jest.spyOn(request, 'get').mockImplementation(() => ({
      body,
      headers: {},
      statusCode
    }))

    const token = {
      token: {
        access_token: '123'
      }
    }

    jest.spyOn(jwt, 'verify').mockImplementation(() => token)
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))

    const jwtToken = '123.456.789'
    const url = 'http://example.com/search/path?param1=123&param2=abc&param3%5B%5D=987'

    await expect(doSearchRequest(jwtToken, url)).resolves.toEqual(expectedResponse)
  })
})

describe('util#getJwtToken', () => {
  test('correctly returns the JWT token when one is already set', () => {
    const token = '123.456.789'

    const event = {
      requestContext: {
        authorizer: {
          jwtToken: token
        }
      }
    }

    expect(getJwtToken(event)).toEqual('123.456.789')
  })
})

describe('util#getSystemToken', () => {
  test('correctly returns the cmr token when one is already set', async () => {
    const token = '1234-abcd-5678-efgh'
    const tokenResponse = await getSystemToken(token)

    expect(tokenResponse).toEqual('1234-abcd-5678-efgh')
  })
})
