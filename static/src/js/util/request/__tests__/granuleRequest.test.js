import GranuleRequest from '../granuleRequest'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('GranuleRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new GranuleRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('granules')
  })

  test('sets the default values when unauthenticated', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

    const request = new GranuleRequest(undefined, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/granules.json')
  })
})

describe('GranuleRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new GranuleRequest(undefined, 'prod')

    expect(request.permittedCmrKeys()).toEqual([
      'bounding_box',
      'browse_only',
      'circle',
      'cloud_cover',
      'concept_id',
      'day_night_flag',
      'echo_collection_id',
      'equator_crossing_date',
      'equator_crossing_longitude',
      'exclude',
      'line',
      'online_only',
      'options',
      'orbit_number',
      'page_num',
      'page_size',
      'point',
      'polygon',
      'readable_granule_name',
      'sort_key',
      'temporal',
      'two_d_coordinate_system'
    ])
  })
})

describe('GranuleRequest#nonIndexedKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new GranuleRequest(undefined, 'prod')

    expect(request.nonIndexedKeys()).toEqual([
      'bounding_box',
      'circle',
      'concept_id',
      'exclude',
      'line',
      'point',
      'polygon',
      'readable_granule_name',
      'sort_key'
    ])
  })
})

describe('GranuleRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(GranuleRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns transformed data', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

    const request = new GranuleRequest(undefined, 'prod')

    const data = {
      feed: {
        id: 'https://cmr.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=C123456-MOCK&page_num=2&page_size=20&sort_key=-start_date',
        title: 'ECHO granule metadata',
        updated: '2019-05-21T01:08:02.143Z',
        entry: [{
          id: 'granuleId',
          time_end: '2000-01-31T00:00:00.000Z',
          time_start: '2000-01-01T00:00:00.000Z'
        }]
      }
    }

    const result = request.transformResponse(data)

    const expectedResult = {
      feed: {
        entry: [
          {
            id: 'granuleId',
            time_end: '2000-01-31T00:00:00.000Z',
            time_start: '2000-01-01T00:00:00.000Z',
            thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/granuleId?h=85&w=85',
            formatted_temporal: ['2000-01-01 00:00:00', '2000-01-31 00:00:00'],
            isOpenSearch: false
          }
        ]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  describe('format granule browse image url', () => {
    test('when the granule has no browse image link', () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

      const request = new GranuleRequest(undefined, 'prod')

      const data = {
        feed: {
          id: 'https://cmr.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=C123456-MOCK&page_num=2&page_size=20&sort_key=-start_date',
          title: 'ECHO granule metadata',
          updated: '2019-05-21T01:08:02.143Z',
          entry: [{
            id: 'granuleId',
            time_end: '2000-01-31T00:00:00.000Z',
            time_start: '2000-01-01T00:00:00.000Z'
          }]
        }
      }

      const result = request.transformResponse(data)

      const expectedResult = {
        feed: {
          entry: [
            {
              id: 'granuleId',
              browse_url: undefined,
              time_end: '2000-01-31T00:00:00.000Z',
              time_start: '2000-01-01T00:00:00.000Z',
              thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/granuleId?h=85&w=85',
              formatted_temporal: ['2000-01-01 00:00:00', '2000-01-31 00:00:00'],
              isOpenSearch: false
            }
          ]
        }
      }

      expect(result).toEqual(expectedResult)
    })

    test('when the granule has a browse image link', () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

      const request = new GranuleRequest(undefined, 'prod')

      const data = {
        feed: {
          id: 'https://cmr.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=C123456-MOCK&page_num=2&page_size=20&sort_key=-start_date',
          title: 'ECHO granule metadata',
          updated: '2019-05-21T01:08:02.143Z',
          entry: [{
            id: 'granuleId',
            time_end: '2000-01-31T00:00:00.000Z',
            time_start: '2000-01-01T00:00:00.000Z',
            links: [
              {
                rel: '#browse',
                href: 'https://test.com/browse/image/url.jpg'
              }
            ]
          }]
        }
      }

      const result = request.transformResponse(data)

      const expectedResult = {
        feed: {
          entry: [
            {
              id: 'granuleId',
              browse_url: 'https://test.com/browse/image/url.jpg',
              time_end: '2000-01-31T00:00:00.000Z',
              time_start: '2000-01-01T00:00:00.000Z',
              thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/granuleId?h=85&w=85',
              formatted_temporal: ['2000-01-01 00:00:00', '2000-01-31 00:00:00'],
              isOpenSearch: false,
              links: [
                {
                  rel: '#browse',
                  href: 'https://test.com/browse/image/url.jpg'
                }
              ]
            }
          ]
        }
      }

      expect(result).toEqual(expectedResult)
    })

    test('when the granule has multiple browse image links it uses the first URL', () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

      const request = new GranuleRequest(undefined, 'prod')

      const data = {
        feed: {
          id: 'https://cmr.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=C123456-MOCK&page_num=2&page_size=20&sort_key=-start_date',
          title: 'ECHO granule metadata',
          updated: '2019-05-21T01:08:02.143Z',
          entry: [{
            id: 'granuleId',
            time_end: '2000-01-31T00:00:00.000Z',
            time_start: '2000-01-01T00:00:00.000Z',
            links: [
              {
                rel: '#data',
                href: 'https://test.com/data.json'
              },
              {
                rel: '#browse',
                href: 'https://test.com/browse/image/first_url.jpg'
              },
              {
                rel: '#browse',
                href: 'https://test.com/browse/image/second_url.jpg'
              }
            ]
          }]
        }
      }

      const result = request.transformResponse(data)

      const expectedResult = {
        feed: {
          entry: [
            {
              id: 'granuleId',
              browse_url: 'https://test.com/browse/image/first_url.jpg',
              time_end: '2000-01-31T00:00:00.000Z',
              time_start: '2000-01-01T00:00:00.000Z',
              thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/granuleId?h=85&w=85',
              formatted_temporal: ['2000-01-01 00:00:00', '2000-01-31 00:00:00'],
              isOpenSearch: false,
              links: [
                {
                  rel: '#data',
                  href: 'https://test.com/data.json'
                },
                {
                  rel: '#browse',
                  href: 'https://test.com/browse/image/first_url.jpg'
                },
                {
                  rel: '#browse',
                  href: 'https://test.com/browse/image/second_url.jpg'
                }
              ]
            }
          ]
        }
      }

      expect(result).toEqual(expectedResult)
    })
  })

  test('returns data if response is not successful', () => {
    const request = new GranuleRequest(undefined, 'prod')

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})
