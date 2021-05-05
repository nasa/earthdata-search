import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'

import exportSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
})

describe('exportSearch', () => {
  test('returns json response correctly', async () => {
    nock(/localhost/)
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: [{
              conceptId: 'C100000-EDSC',
              title: 'Test collection',
              platforms: [{
                shortName: 'platform'
              }]
            }, {
              conceptId: 'C100001-EDSC',
              title: 'Test collection 1',
              platforms: [{
                shortName: 'platform'
              }]
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

    expect(result.body).toEqual('[{"conceptId":"C100000-EDSC","title":"Test collection","platforms":["platform"]},{"conceptId":"C100001-EDSC","title":"Test collection 1","platforms":["platform"]}]')
  })

  test('responds correctly on http error', async () => {
    nock(/localhost/)
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
