import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import exportSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
})

describe('exportSearch', () => {
  test('returns csv response correctly', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/graphql/)
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: [{
              conceptId: 'C100000-EDSC',
              title: 'Test collection',
              platforms: [{ shortName: 'platform' }],
              processingLevel: {
                id: '1'
              },
              provider: 'EDSC',
              shortName: 'TestShortName',
              timeStart: '2018-07-11T00:00:00.000Z',
              timeEnd: '2023-08-31T00:00:00.000Z',
              version: 'v1'
            }, {
              conceptId: 'C100001-EDSC',
              title: 'Test collection 1',
              platforms: [{ shortName: 'platform' }],
              processingLevel: {
                id: '1'
              },
              provider: 'EDSC',
              shortName: 'TestShortName',
              timeStart: '2018-07-11T00:00:00.000Z',
              timeEnd: '2023-08-31T00:00:00.000Z',
              version: 'v1'
            }]
          }
        }
      })
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: []
          }
        }
      })

    const event = {
      body: JSON.stringify({
        data: {
          format: 'csv',
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportSearch(event, {})

    expect(result.body).toEqual('Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n"EDSC","TestShortName","v1","Test collection","1","platform","2018-07-11T00:00:00.000Z","2023-08-31T00:00:00.000Z"\r\n"EDSC","TestShortName","v1","Test collection 1","1","platform","2018-07-11T00:00:00.000Z","2023-08-31T00:00:00.000Z"\r\n')
  })

  test('returns json response correctly', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/graphql/)
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: [{
              conceptId: 'C100000-EDSC',
              title: 'Test collection',
              platforms: [{ shortName: 'platform' }],
              processingLevel: {
                id: '1'
              },
              provider: 'EDSC',
              shortName: 'TestShortName',
              timeStart: '2018-07-11T00:00:00.000Z',
              timeEnd: '2023-08-31T00:00:00.000Z',
              version: 'v1'
            }, {
              conceptId: 'C100001-EDSC',
              title: 'Test collection 1',
              platforms: [{ shortName: 'platform' }],
              processingLevel: {
                id: '1'
              },
              provider: 'EDSC',
              shortName: 'TestShortName',
              timeStart: '2018-07-11T00:00:00.000Z',
              timeEnd: '2023-08-31T00:00:00.000Z',
              version: 'v1'
            }]
          }
        }
      })
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: []
          }
        }
      })

    const event = {
      body: JSON.stringify({
        data: {
          format: 'json',
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportSearch(event, {})

    expect(result.body).toEqual('[{"conceptId":"C100000-EDSC","title":"Test collection","platforms":[{"shortName":"platform"}],"processingLevel":{"id":"1"},"provider":"EDSC","shortName":"TestShortName","timeStart":"2018-07-11T00:00:00.000Z","timeEnd":"2023-08-31T00:00:00.000Z","version":"v1"},{"conceptId":"C100001-EDSC","title":"Test collection 1","platforms":[{"shortName":"platform"}],"processingLevel":{"id":"1"},"provider":"EDSC","shortName":"TestShortName","timeStart":"2018-07-11T00:00:00.000Z","timeEnd":"2023-08-31T00:00:00.000Z","version":"v1"}]')
  })

  test('responds correctly on http error', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/graphql/)
      .post(/api/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        data: {
          format: 'json',
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await exportSearch(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })
})
