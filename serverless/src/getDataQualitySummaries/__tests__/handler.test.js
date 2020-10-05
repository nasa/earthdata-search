import nock from 'nock'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import getDataQualitySummaries from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ token: { access_token: 'access_token' } }))
  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ echoRestRoot: 'http://echorest.example.com' }))
  jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ secret: 'jwt-secret' }))
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => 'accesstoken-client')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
})

describe('getDataQualitySummaries', () => {
  test('returns data quality summaries when they exist', async () => {
    nock(/echorest/)
      .get(/data_quality_summary_definitions/)
      .reply(200, [
        {
          reference: {
            id: '1234-ABCD-5678-EFGH-91011',
            location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/data_quality_summary_definitions/1234-ABCD-5678-EFGH-91011',
            name: 'MODIS'
          }
        }
      ])

    nock(/echorest/)
      .get(/1234-ABCD-5678-EFGH-91011/)
      .reply(200, {
        data_quality_summary_definition: {
          id: '1234-ABCD-5678-EFGH-91011',
          name: 'EDSC',
          provider_id: 'EDSC-TEST',
          summary: 'data quality summary',
          updated_at: '2011-01-31T20:42:08Z'
        }
      })

    const dqsResponse = await getDataQualitySummaries({
      body: JSON.stringify({
        params: {
          catalog_item_id: 'C10000001-EDSC'
        }
      })
    }, { functionName: 'getDataQualitySummaries' })

    const {
      body,
      statusCode
    } = dqsResponse

    expect(statusCode).toBe(200)
    expect(body).toBe(JSON.stringify([{
      id: '1234-ABCD-5678-EFGH-91011',
      name: 'EDSC',
      provider_id: 'EDSC-TEST',
      summary: 'data quality summary',
      updated_at: '2011-01-31T20:42:08Z'
    }]))
  })

  test('returns an empty array when no data quality summaries exist', async () => {
    nock(/echorest/)
      .get(/data_quality_summary_definitions/)
      .reply(200, [])

    const dqsResponse = await getDataQualitySummaries({
      body: JSON.stringify({
        params: {
          catalog_item_id: 'C10000001-EDSC'
        }
      })
    }, { functionName: 'getDataQualitySummaries' })

    const {
      body,
      statusCode
    } = dqsResponse

    expect(statusCode).toBe(200)
    expect(body).toBe(JSON.stringify([]))
  })

  test('returns a 404 when we expect a data quality summary but echo rest doesnt return one', async () => {
    nock(/echorest/)
      .get(/data_quality_summary_definitions/)
      .reply(200, [
        {
          reference: {
            id: '1234-ABCD-5678-EFGH-91011',
            location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/data_quality_summary_definitions/1234-ABCD-5678-EFGH-91011',
            name: 'MODIS'
          }
        }
      ])

    nock(/echorest/)
      .get(/1234-ABCD-5678-EFGH-91011/)
      .reply(404, {
        errors: [
          'Unable to find data quality definition for guid [1234-ABCD-5678-EFGH-91011]'
        ]
      })

    const dqsResponse = await getDataQualitySummaries({
      body: JSON.stringify({
        params: {
          catalog_item_id: 'C10000001-EDSC'
        }
      })
    }, { functionName: 'getDataQualitySummaries' })

    const {
      body,
      statusCode
    } = dqsResponse

    expect(statusCode).toBe(404)
    expect(body).toBe(JSON.stringify({
      errors: [
        'Unable to find data quality definition for guid [1234-ABCD-5678-EFGH-91011]'
      ]
    }))
  })

  test('responds correctly on error', async () => {
    nock(/echorest/)
      .get(/data_quality_summary_definitions/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const response = await getDataQualitySummaries({
      body: JSON.stringify({
        params: {
          catalog_item_id: 'C10000001-EDSC'
        }
      })
    }, { functionName: 'getDataQualitySummaries' })

    expect(response.statusCode).toEqual(500)
  })
})
