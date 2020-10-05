import nock from 'nock'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import regionSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ regionHost: 'http://region.com' }))
})

describe('regionSearch', () => {
  test('returns region results when they exist', async () => {
    nock(/region/)
      .get(/regions/)
      .reply(200, {
        status: '200 OK',
        hits: 1,
        time: '5.128 ms.',
        'search on': {
          parameter: 'region',
          exact: true
        },
        results: {
          'California Region': {
            HUC: '18',
            'Visvalingam Polygon': '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692'
          }
        }
      })

    const regionResponse = await regionSearch({
      queryStringParameters: {
        endpoint: 'regions',
        exact: true,
        query: 'California Region'
      }
    })

    const {
      body,
      statusCode
    } = regionResponse

    expect(statusCode).toBe(200)
    expect(body).toBe(JSON.stringify({
      hits: 1,
      time: 5.128,
      results: [{
        id: 'California Region',
        HUC: '18',
        'Visvalingam Polygon': '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692'
      }]
    }))
  })

  test('returns huc results when they exist', async () => {
    nock(/region/)
      .get(/huc/)
      .reply(200, {
        status: '200 OK',
        hits: 1,
        time: '3.133 ms.',
        'search on': {
          parameter: 'HUC',
          exact: true
        },
        results: {
          1805000301: {
            'Region Name': 'Upper Coyote Creek',
            'Visvalingam Polygon': '-121.71876769859176,37.348544156610956,-121.72219968921144,37.35039130244144'
          }
        }
      })

    const regionResponse = await regionSearch({
      queryStringParameters: {
        endpoint: 'hucs',
        exact: true,
        query: '1805000301'
      }
    })

    const {
      body,
      statusCode
    } = regionResponse

    expect(statusCode).toBe(200)
    expect(body).toBe(JSON.stringify({
      hits: 1,
      time: 3.133,
      results: [{
        id: '1805000301',
        'Region Name': 'Upper Coyote Creek',
        'Visvalingam Polygon': '-121.71876769859176,37.348544156610956,-121.72219968921144,37.35039130244144'
      }]
    }))
  })

  test('returns error when a warning is received', async () => {
    nock(/region/)
      .get(/huc/)
      .reply(200, {
        error: '413: Your query has returned 16575 results (> 100). If you\'re searching a specific HUC, use the parameter \'exact=True\'.Otherwise, refine your search to return less results, or head here: https://water.usgs.gov/GIS/huc.html to download mass HUC data.'
      })

    const regionResponse = await regionSearch({
      queryStringParameters: {
        endpoint: 'hucs',
        exact: false,
        query: '10'
      }
    })

    const {
      body,
      statusCode
    } = regionResponse

    expect(statusCode).toBe(413)
    expect(body).toBe(JSON.stringify({
      errors: ['Your query has returned 16575 results (> 100). If you\'re searching a specific HUC, use the parameter \'exact=True\'.Otherwise, refine your search to return less results, or head here: https://water.usgs.gov/GIS/huc.html to download mass HUC data.']
    }))
  })

  test('returns error when a failure is received', async () => {
    nock(/region/)
      .get(/huc/)
      .reply(500)

    const regionResponse = await regionSearch({
      queryStringParameters: {
        endpoint: 'hucs',
        exact: false,
        query: '10'
      }
    })

    const {
      body,
      statusCode
    } = regionResponse

    expect(statusCode).toBe(500)
    expect(body).toBe(JSON.stringify({
      errors: ['An unknown error has occurred']
    }))
  })

  test('returns error when a ESOCKETTIMEDOUT is received', async () => {
    nock(/region/)
      .get(/huc/)
      .replyWithError('ESOCKETTIMEDOUT')

    const regionResponse = await regionSearch({
      queryStringParameters: {
        endpoint: 'hucs',
        exact: false,
        query: '10'
      }
    })

    const {
      body,
      statusCode
    } = regionResponse

    expect(statusCode).toBe(504)
    expect(body).toBe(JSON.stringify({
      errors: ['Request to external service timed out after 20000 ms']
    }))
  })

  test('returns region results when they exist', async () => {
    nock(/region/)
      .get(/regions/)
      .reply(200, {
        status: '200 OK',
        hits: 0,
        time: '5.128 ms.',
        'search on': {
          parameter: 'region',
          exact: true
        },
        errorMessage: 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.'
      })

    const regionResponse = await regionSearch({
      queryStringParameters: {
        endpoint: 'regions',
        exact: true,
        query: 'California Region'
      }
    })

    const {
      body,
      statusCode
    } = regionResponse

    expect(statusCode).toBe(500)
    expect(body).toBe(JSON.stringify({
      errors: ['Cras justo odio, dapibus ac facilisis in, egestas eget quam.']
    }))
  })
})
