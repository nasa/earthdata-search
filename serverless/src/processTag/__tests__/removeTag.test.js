import request from 'request-promise'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getClientId from '../../../../sharedUtils/getClientId'
import * as removeTag from '../removeTag'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('removeTag', () => {
  test('correctly calls cmr endpoint', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ background: 'eed-edsc-test-serverless-background' }))

    const cmrDeleteMock = jest.spyOn(request, 'delete').mockImplementation(() => jest.fn())

    const removeTagResponse = await removeTag.removeTag(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrDeleteMock).toBeCalledTimes(1)
    expect(cmrDeleteMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations/by_query',
      headers: {
        Authorization: 'Bearer 1234-abcd-5678-efgh',
        'Client-Id': 'eed-edsc-test-serverless-background'
      },
      body: { short_name: 'MIL3MLS' },
      json: true,
      resolveWithFullResponse: true
    })

    expect(removeTagResponse).toBe(true)
  })

  test('reports an error when calls to cmr fail', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ background: 'eed-edsc-test-serverless-background' }))

    const cmrDeleteMock = jest.spyOn(request, 'delete').mockImplementation(() => {
      throw new Error()
    })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const removeTagResponse = await removeTag.removeTag(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrDeleteMock).toBeCalledTimes(1)
    expect(cmrDeleteMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations/by_query',
      headers: {
        Authorization: 'Bearer 1234-abcd-5678-efgh',
        'Client-Id': 'eed-edsc-test-serverless-background'
      },
      body: { short_name: 'MIL3MLS' },
      json: true,
      resolveWithFullResponse: true
    })

    expect(consoleMock).toBeCalledTimes(1)
    expect(removeTagResponse).toBe(false)
  })
})
