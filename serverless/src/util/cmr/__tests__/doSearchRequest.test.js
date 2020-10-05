import request from 'request-promise'
import { doSearchRequest } from '../doSearchRequest'
import * as getEdlConfig from '../../getEdlConfig'
import * as getAccessTokenFromJwtToken from '../../urs/getAccessTokenFromJwtToken'

describe('util#doSearchRequest', () => {
  test('correctly returns the search response', async () => {
    const body = { success: true }
    const headers = {
      'cmr-hits': 1,
      'cmr-took': 1,
      'cmr-request-id': 123,
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'jwt-token',
      'jwt-token': '123.456.789'
    }
    const statusCode = 200
    const expectedResponse = {
      body: JSON.stringify(body),
      headers,
      statusCode
    }

    jest.spyOn(request, 'post').mockImplementation(() => ({
      body,
      headers: {
        'cmr-hits': 1,
        'cmr-took': 1,
        'cmr-request-id': 123,
        'access-control-allow-origin': '*'
      },
      statusCode
    }))

    const token = {
      token: {
        access_token: '123'
      }
    }

    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => token)
    jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
      client: {
        id: 'clientId'
      }
    }))

    const jwtToken = '123.456.789'
    const url = 'http://example.com/search/path?param1=123&param2=abc&param3%5B%5D=987'

    await expect(doSearchRequest({
      jwtToken,
      path: url
    })).resolves.toEqual(expectedResponse)
  })
})
