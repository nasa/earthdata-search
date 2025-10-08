import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as getJwtToken from '../../util/getJwtToken'

import timelineSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
})

describe('timelineSearch', () => {
  test('calls doSearchRequest', async () => {
    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementationOnce(() => jest.fn())

    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {
          bounding_box: ['-78.27539,38.03269,-75.90234,39.75445'],
          concept_id: ['C10000-EDSC'],
          end_date: '2023-12-08T13:00:00.000Z',
          interval: 'minute',
          start_date: '2023-12-06T01:00:00.000Z'
        }
      })
    }

    await timelineSearch(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith({
      jwtToken: 'mockJwt',
      earthdataEnvironment: 'prod',
      path: '/search/granules/timeline',
      params: 'end_date=2023-12-08T13:00:00.000Z&interval=minute&start_date=2023-12-06T01:00:00.000Z&bounding_box[]=-78.27539,38.03269,-75.90234,39.75445&concept_id[]=C10000-EDSC',
      requestId: 'asdf-1234-qwer-5678'
    })
  })

  test('responds correctly on http error', async () => {
    nock(/cmr/)
      .post(/timeline/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {
          concept_id: ['C10000-EDSC']
        }
      })
    }

    const response = await timelineSearch(event, {})

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
        params: {
          concept_id: ['C10000-EDSC']
        }
      })
    }

    const response = await timelineSearch(event, {})

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Error: Code Exception Occurred')
  })

  test('returns 400 when concept_id is missing', async () => {
    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {
          end_date: '2023-12-08T13:00:00.000Z',
          interval: 'minute',
          start_date: '2023-12-06T01:00:00.000Z'
        }
      })
    }

    const response = await timelineSearch(event, {})

    expect(response.statusCode).toEqual(400)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Timeline requests must include at least one collection concept_id')
  })

  test('returns 400 when concept_id is an empty array', async () => {
    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {
          concept_id: [],
          end_date: '2023-12-08T13:00:00.000Z',
          interval: 'minute',
          start_date: '2023-12-06T01:00:00.000Z'
        }
      })
    }

    const response = await timelineSearch(event, {})

    expect(response.statusCode).toEqual(400)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Timeline requests must include at least one collection concept_id')
  })
})
