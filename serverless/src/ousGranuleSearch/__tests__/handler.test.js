import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as getJwtToken from '../../util/getJwtToken'

import ousGranuleSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
})

describe('ousGranuleSearch', () => {
  test('calls doSearchRequest', async () => {
    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => jest.fn())

    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {
          echo_collection_id: 'C100000-EDSC'
        }
      })
    }

    await ousGranuleSearch(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith({
      earthdataEnvironment: 'prod',
      jwtToken: 'mockJwt',
      path: '/service-bridge/ous/collection/C100000-EDSC',
      params: {},
      requestId: 'asdf-1234-qwer-5678',
      providedHeaders: {
        Accept: 'application/vnd.cmr-service-bridge.v3+json'
      }
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .post(/service-bridge/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {}
      })
    }

    const response = await ousGranuleSearch(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })

  test('responds correctly when an exception is thrown', async () => {
    jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => { throw new Error('Code Exception Occurred') })

    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {}
      })
    }

    const response = await ousGranuleSearch(event, {})

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Error: Code Exception Occurred')
  })
})
