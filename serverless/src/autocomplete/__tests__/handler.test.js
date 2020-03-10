import nock from 'nock'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import autocomplete from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
})

describe('autocomplete', () => {
  test('calls doSearchRequest', async () => {
    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {
          q: 'ICE'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    await autocomplete(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith({
      jwtToken: 'mockJwt',
      bodyType: 'json',
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
    jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => { throw new Error('Code Exception Occurred') })

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
