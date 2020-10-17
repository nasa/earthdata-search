import nock from 'nock'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'

import { getSingleGranule } from '../getSingleGranule'

describe('getSingleGranule', () => {
  test('returns the first granule from a standard request', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'http://cmr.example.com'
    }))

    nock(/cmr/)
      .post(/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G100000-EDSC',
            title: 'DONEC SED ODIO DUI'
          }, {
            id: 'G100001-EDSC',
            title: 'MAECENAS FAUCIBUS MOLLIS INTERDUM'
          }, {
            id: 'G100002-EDSC',
            title: 'CURABITUR BLANDIT TEMPUS PORTTITOR'
          }]
        }
      })

    const response = await getSingleGranule('token', 'C100000-EDSC')

    expect(response).toEqual({
      id: 'G100000-EDSC',
      title: 'DONEC SED ODIO DUI'
    })
  })
})
