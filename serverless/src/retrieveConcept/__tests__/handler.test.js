import nock from 'nock'
import * as cmrEnv from '../../../../sharedUtils/cmrEnv'

import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import retrieveConcept from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
  jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')
})

describe('retrieveConcept', () => {
  test('retrieves the concept from CMR', async () => {
    nock(/cmr/)
      .get(/search\/concepts\/C100000-EDSC/)
      .reply(200, {
        id: 'C100000-EDSC',
        title: 'Aenean lacinia bibendum nulla sed consectetur.'
      }, {
        'cmr-hits': 1,
        'cmr-took': 34,
        'cmr-request-id': 'asdf-1234-qwer-5678',
        'access-control-allow-origin': '*'
      })

    const event = {
      requestId: 'asdf-1234-qwer-5678',
      pathParameters: {
        id: 'C100000-EDSC'
      },
      queryStringParameters: {
        pretty: true
      }
    }

    const response = await retrieveConcept(event, {})

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'access-control-expose-headers': 'jwt-token',
        'access-control-allow-origin': '*',
        'cmr-hits': '1',
        'cmr-took': '34',
        'cmr-request-id': 'asdf-1234-qwer-5678',
        'jwt-token': 'mockJwt'
      },
      body: JSON.stringify({
        id: 'C100000-EDSC',
        title: 'Aenean lacinia bibendum nulla sed consectetur.'
      })
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .get(/search\/concepts\/C100000-EDSC/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      requestId: 'asdf-1234-qwer-5678',
      pathParameters: {
        id: 'C100000-EDSC'
      }
    }

    const response = await retrieveConcept(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })
})
