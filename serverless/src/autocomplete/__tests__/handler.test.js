import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import * as getAuthorizerContext from '../../util/getAuthorizerContext'

import autocomplete from '../handler'

beforeEach(() => {
  vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  vi.spyOn(getAuthorizerContext, 'getAuthorizerContext').mockImplementation(() => ({ jwtToken: 'mockJwt' }))
})

describe('autocomplete', () => {
  test('calls doSearchRequest', async () => {
    const mock = vi.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => vi.fn())

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    await autocomplete(event, {})

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith({
      jwtToken: 'mockJwt',
      earthdataEnvironment: 'prod',
      method: 'get',
      path: '/search/autocomplete',
      params: {
        q: 'ICE'
      },
      requestId: 'asdf-1234-qwer-5678'
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .get(/autocomplete/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await autocomplete(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })

  test('responds correctly when an exception is thrown', async () => {
    vi.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => { throw new Error('Code Exception Occurred') })

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await autocomplete(event, {})

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Error: Code Exception Occurred')
  })
})
