import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import exportGranuleSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')
})

describe('exportGranuleSearch', () => {
  test('returns stac response correctly', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))

    const stacData = {
      data: {
        context: {
          limit: 1000000,
          matched: 1,
          returned: 1
        },
        features: [{
          type: 'Feature',
          bbox: [-180, -60, 180, 90],
          collection: 'C1000-TEST'
        }],
        links: [
          {
            rel: 'self',
            href: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.stac?collection_concept_id=C1200382534-CMR_ONLY&page_size=20&sort_key=-start_date&page_num=1'
          },
          {
            rel: 'root',
            href: 'https://cmr.sit.earthdata.nasa.gov:443/search/'
          }
        ],
        numberMatched: 1,
        numberReturned: 1,
        stac_version: '1.0.0',
        type: 'FeatureCollecton'
      }
    }

    nock(/cmr/)
      .post(/granules.stac/)
      .reply(200, stacData)

    const event = {
      body: JSON.stringify({
        data: {
          format: 'stac',
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportGranuleSearch(event, {})

    expect(result.body).toEqual(JSON.stringify(stacData))
  })

  test('responds correctly on http error', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))

    nock(/cmr/)
      .post(/granules.stac/)
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

    const response = await exportGranuleSearch(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })
})
