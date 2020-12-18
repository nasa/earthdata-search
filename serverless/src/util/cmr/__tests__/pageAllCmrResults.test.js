import nock from 'nock'

import { pageAllCmrResults } from '../pageAllCmrResults'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('pageAllCmrResults', () => {
  test('does not iterate when uneccessary', async () => {
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
  })

  test('iterates through the correct number of pages', async () => {
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
  })
})
