import nock from 'nock'

import { cwicGranuleTemplate, cwicOsddErrorResponse, cwicOsddResponse } from './mocks'
import { getCwicGranulesUrl } from '../getCwicGranulesUrl'

describe('getCwicGranulesUrl', () => {
  test('successful returns a template for a known collection', async () => {
    nock(/wgiss/)
      .get(/opensearch/)
      .reply(200, cwicOsddResponse)

    const response = await getCwicGranulesUrl('C1597928934-NOAA_NCEI')

    const {
      statusCode,
      body
    } = response

    expect(statusCode).toEqual(200)
    expect(body).toEqual(cwicGranuleTemplate)
  })

  test('returns an error for an unknown collection', async () => {
    nock(/wgiss/)
      .get(/opensearch/)
      .reply(400, cwicOsddErrorResponse, {
        'Content-Type': 'application/opensearchdescription+xml'
      })

    const response = await getCwicGranulesUrl('C1597928934-SNOAA_NCEI')

    const {
      statusCode,
      body
    } = response

    expect(statusCode).toEqual(400)
    expect(body).toEqual(JSON.stringify({
      statusCode: 400,
      errors: ['REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset']
    }))
  })
})
