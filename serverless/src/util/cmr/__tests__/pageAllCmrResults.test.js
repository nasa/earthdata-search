import nock from 'nock'
import request from 'request-promise'

import { pageAllCmrResults } from '../pageAllCmrResults'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('pageAllCmrResults', () => {
  test('does not iterate when uneccessary', async () => {
    const cmrMock = jest.spyOn(request, 'post')

    nock(/cmr/)
      .matchHeader('Echo-Token', 'test-token')
      .post(/services/)
      .reply(200, {
        items: []
      }, {
        'cmr-hits': 495
      })

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
    const cmrMock = jest.spyOn(request, 'post')

    nock(/cmr/)
      .matchHeader('Echo-Token', 'test-token')
      .post(/services/)
      .times(4)
      .reply(200, {
        items: []
      }, {
        'cmr-hits': 2000
      })

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
