import nock from 'nock'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'

import { getPageOfGranules } from '../getPageOfGranules'

describe('getPageOfGranules', () => {
  test('requests the 20 granules by default', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'http://cmr.example.com'
    }))

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer token')
      .post(/granules/, 'echo_collection_id=C100000-EDSC&page_num=1&page_size=20')
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

    const response = await getPageOfGranules('token', 'C100000-EDSC')

    expect(response).toEqual([{
      id: 'G100000-EDSC',
      title: 'DONEC SED ODIO DUI'
    }, {
      id: 'G100001-EDSC',
      title: 'MAECENAS FAUCIBUS MOLLIS INTERDUM'
    }, {
      id: 'G100002-EDSC',
      title: 'CURABITUR BLANDIT TEMPUS PORTTITOR'
    }])
  })

  test('requests the 30 granules when requested', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'http://cmr.example.com'
    }))

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer token')
      .post(/granules/, 'echo_collection_id=C100000-EDSC&page_num=1&page_size=30')
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

    const response = await getPageOfGranules('token', 'C100000-EDSC', 30)

    expect(response).toEqual([{
      id: 'G100000-EDSC',
      title: 'DONEC SED ODIO DUI'
    }, {
      id: 'G100001-EDSC',
      title: 'MAECENAS FAUCIBUS MOLLIS INTERDUM'
    }, {
      id: 'G100002-EDSC',
      title: 'CURABITUR BLANDIT TEMPUS PORTTITOR'
    }])
  })
})
