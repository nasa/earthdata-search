import nock from 'nock'

import { doSearchRequest } from '../doSearchRequest'

import * as getEdlConfig from '../../getEdlConfig'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getAccessTokenFromJwtToken from '../../urs/getAccessTokenFromJwtToken'

describe('util#doSearchRequest', () => {
  test('correctly returns the search response', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))

    const body = { success: true }
    const headers = {
      'cmr-hits': '1',
      'cmr-took': '1',
      'cmr-request-id': '123',
      'access-control-allow-credentials': true,
      'access-control-allow-headers': '*',
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

    nock(/cmr/)
      .matchHeader('CMR-Hits', 1)
      .matchHeader('CMR-Took', 1)
      .matchHeader('CMR-Request-Id', 123)
      .matchHeader('Access-Control-Allow-Credentials', 'true')
      .matchHeader('Access-Control-Allow-Headers', '*')
      .matchHeader('Access-Control-Allow-Origin', '*')
      .post(/path/)
      .reply(200, { success: true }, {
        'cmr-hits': '1',
        'cmr-took': '1',
        'cmr-request-id': '123',
        'access-control-allow-origin': '*'
      })

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
    const path = '/search/path'
    const params = {
      param1: '123',
      param2: 'abc',
      param3: ['987']
    }

    await expect(doSearchRequest({
      jwtToken,
      earthdataEnvironment: 'prod',
      params,
      providedHeaders: headers,
      path
    })).resolves.toEqual(expectedResponse)
  })
})
