import request from 'request-promise'
import { pageAllCmrResults } from '../pageAllCmrResults'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('pageAllCmrResults', () => {
  test('does not iterate when uneccessary', async () => {
    const cmrMock = jest.spyOn(request, 'post').mockImplementationOnce(() => ({
      statusCode: 200,
      headers: {
        'cmr-hits': 495
      },
      body: { items: [] }
    }))

    await pageAllCmrResults({
      cmrToken: 'test-token',
      deployedEnvironment: 'sit',
      path: 'search/services',
      additionalHeaders: {
        Accept: 'application/vnd.nasa.cmr.umm_results+json; version=1.2'
      }
    })

    expect(cmrMock).toBeCalledTimes(1)
  })

  test('iterates through the correct number of pages', async () => {
    const pageResponse = {
      statusCode: 200,
      headers: {
        'cmr-hits': 2000
      },
      body: { items: [] }
    }
    const cmrMock = jest.spyOn(request, 'post')
      .mockImplementationOnce(() => pageResponse)
      .mockImplementationOnce(() => pageResponse)
      .mockImplementationOnce(() => pageResponse)
      .mockImplementationOnce(() => pageResponse)

    await pageAllCmrResults({
      cmrToken: 'test-token',
      deployedEnvironment: 'sit',
      path: 'search/services',
      additionalHeaders: {
        Accept: 'application/vnd.nasa.cmr.umm_results+json; version=1.2'
      }
    })

    expect(cmrMock).toBeCalledTimes(4)
  })
})
