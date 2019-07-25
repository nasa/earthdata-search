import request from 'request-promise'
import { pageAllCmrResults } from '../pageAllCmrResults'
import * as getSystemToken from '../../urs/getSystemToken'

beforeEach(() => {
  jest.clearAllMocks()
})

/**
 * Because CMR does not support using POST to query the service endpoint
 * we have to chunk our requests, the current page size is set to 500
 */
describe('pageAllCmrResults', () => {
  test('does not iterate when uneccessary', async () => {
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const cmrMock = jest.spyOn(request, 'get').mockImplementationOnce(() => ({
      statusCode: 200,
      headers: {
        'cmr-hits': 495
      },
      body: { items: [] }
    }))

    await pageAllCmrResults('search/services')

    expect(cmrMock).toBeCalledTimes(1)
  })

  test('iterates through the correct number of pages', async () => {
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const pageResponse = {
      statusCode: 200,
      headers: {
        'cmr-hits': 2000
      },
      body: { items: [] }
    }
    const cmrMock = jest.spyOn(request, 'get')
      .mockImplementationOnce(() => pageResponse)
      .mockImplementationOnce(() => pageResponse)
      .mockImplementationOnce(() => pageResponse)
      .mockImplementationOnce(() => pageResponse)

    await pageAllCmrResults('search/services')

    expect(cmrMock).toBeCalledTimes(4)
  })
})
