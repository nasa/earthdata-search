import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'

import collectionSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
})

describe('collectionSearch', () => {
  test('calls doSearchRequest', async () => {
    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {
          concept_id: 'C100005-EDSC',
          tag_key: 'edsc.extra.serverless'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    await collectionSearch(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith({
      earthdataEnvironment: 'prod',
      jwtToken: 'mockJwt',
      path: '/search/collections.json',
      params: 'concept_id=C100005-EDSC&tag_key=edsc.extra.serverless',
      providedHeaders: {},
      requestId: 'asdf-1234-qwer-5678'
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .post(/collections/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        params: {
          concept_id: 'C100005-EDSC',
          tag_key: 'edsc.extra.serverless'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await collectionSearch(event, {})

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
          concept_id: 'C100005-EDSC',
          tag_key: 'edsc.extra.serverless'
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await collectionSearch(event, {})

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Error: Code Exception Occurred')
  })
})
