import request from 'request-promise'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getCollectionsByJson from '../getCollectionsByJson'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getCollectionsByJson', () => {
  test('correctly returns when null is provided', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const mockedTokenValue = 'mocked-system-token'

    const headers = {
      'Client-Id': 'eed-edsc-test-serverless-background',
      'Echo-Token': mockedTokenValue
    }

    const responseEntry = {
      updated: '2019-05-28T18:09:24.958Z',
      id: 'http://example.com/search/collections.json',
      title: 'ECHO dataset metadata',
      entry: [{
        id: 'C123456789-EDSC',
        tags: {
          'edsc.extra.gibs': {
            data: [{
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }]
          }
        }
      }]
    }
    const body = {
      feed: responseEntry
    }
    const statusCode = 200

    const requestMock = jest.spyOn(request, 'post').mockImplementationOnce(() => ({
      statusCode,
      headers,
      body
    }))

    const queryParams = { include_tags: 'edsc.extra.test' }
    const searchCriteria = { condition: { short_name: 'MIL3MLS' } }
    const data = await getCollectionsByJson.getCollectionsByJson(
      queryParams,
      searchCriteria,
      mockedTokenValue
    )

    expect(requestMock).toBeCalledTimes(1)
    expect(requestMock).toBeCalledWith({
      uri: 'http://example.com/search/collections.json?include_tags=edsc.extra.test',
      headers: {
        'Client-Id': 'eed-edsc-test-serverless-background',
        'Echo-Token': 'mocked-system-token'
      },
      body: { condition: { short_name: 'MIL3MLS' } },
      followAllRedirects: true,
      json: true,
      resolveWithFullResponse: true
    })
    expect(Object.keys(data).sort()).toEqual(['entry', 'id', 'title', 'updated'])
  })
})
