import CollectionRequest from '../collectionRequest'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('CollectionRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new CollectionRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('collections')
  })

  test('sets the default values when unauthenticated', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

    const request = new CollectionRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/collections')
  })
})

describe('CollectionRequest#permittedCmrKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new CollectionRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'params',
      'bounding_box',
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'data_center',
      'echo_collection_id',
      'format',
      'facets_size',
      'granule_data_format',
      'granule_data_format_h',
      'has_granules',
      'has_granules_or_cwic',
      'include_facets',
      'include_granule_counts',
      'include_has_granules',
      'include_tags',
      'include_tags',
      'instrument',
      'instrument_h',
      'keyword',
      'line',
      'options',
      'page_num',
      'page_size',
      'platform',
      'platform_h',
      'point',
      'polygon',
      'processing_level_id_h',
      'project_h',
      'project',
      'provider',
      'science_keywords_h',
      'sort_key',
      'spatial_keyword',
      'tag_key',
      'temporal',
      'two_d_coordinate_system'
    ])
  })
})

describe('CollectionRequest#nonIndexedKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new CollectionRequest()

    expect(request.nonIndexedKeys()).toEqual([
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'granule_data_format',
      'granule_data_format_h',
      'instrument',
      'instrument_h',
      'platform',
      'platform_h',
      'processing_level_id_h',
      'project_h',
      'provider',
      'sort_key',
      'spatial_keyword',
      'tag_key'
    ])
  })
})

describe('CollectionRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(CollectionRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns transformed data', () => {
    const request = new CollectionRequest()

    const data = {
      feed: {
        id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
        title: 'ECHO collection metadata',
        updated: '2019-05-21T01:08:02.143Z',
        entry: [{
          id: 'collectionId',
          tags: {}
        }]
      }
    }

    const result = request.transformResponse(data)

    const expectedResult = {
      feed: {
        ...data.feed,
        entry: [{
          id: 'collectionId',
          tags: {},
          has_map_imagery: false,
          is_cwic: false,
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('return data with is_cwic flag correctly', () => {
    const request = new CollectionRequest()

    const data = {
      feed: {
        id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
        title: 'ECHO collection metadata',
        updated: '2019-05-21T01:08:02.143Z',
        entry: [{
          id: 'collectionId',
          has_granules: false,
          tags: {
            'org.ceos.wgiss.cwic.granules.prod': 'stuff here'
          }
        }]
      }
    }

    const result = request.transformResponse(data)

    const expectedResult = {
      feed: {
        ...data.feed,
        entry: [{
          id: 'collectionId',
          has_granules: false,
          has_map_imagery: false,
          tags: {
            'org.ceos.wgiss.cwic.granules.prod': 'stuff here'
          },
          is_cwic: true,
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  describe('return data with has_map_imagery flag correctly', () => {
    test('when an image is defined', () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

      const request = new CollectionRequest()

      const data = {
        feed: {
          id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
          title: 'ECHO collection metadata',
          updated: '2019-05-21T01:08:02.143Z',
          entry: [{
            browse_flag: true,
            id: 'collectionId',
            has_granules: false,
            tags: {
              'edsc.extra.serverless.gibs': 'stuff here'
            }
          }]
        }
      }

      const result = request.transformResponse(data)

      const expectedResult = {
        feed: {
          ...data.feed,
          entry: [{
            id: 'collectionId',
            browse_flag: true,
            has_granules: false,
            has_map_imagery: true,
            is_cwic: false,
            tags: {
              'edsc.extra.serverless.gibs': 'stuff here'
            },
            thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/datasets/collectionId?h=85&w=85'
          }]
        }
      }

      expect(result).toEqual(expectedResult)
    })

    test('when an image is not defined', () => {
      const request = new CollectionRequest()

      const data = {
        feed: {
          id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
          title: 'ECHO collection metadata',
          updated: '2019-05-21T01:08:02.143Z',
          entry: [{
            browse_flag: false,
            id: 'collectionId',
            has_granules: false,
            tags: {}
          }]
        }
      }

      const result = request.transformResponse(data)

      const expectedResult = {
        feed: {
          ...data.feed,
          entry: [{
            browse_flag: false,
            has_granules: false,
            has_map_imagery: false,
            id: 'collectionId',
            is_cwic: false,
            tags: {},
            thumbnail: 'test-file-stub'
          }]
        }
      }

      expect(result).toEqual(expectedResult)
    })
  })

  test('returns data if response is not successful', () => {
    const request = new CollectionRequest()

    const data = {
      errors: ['HTTP Request Error']
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('CollectionRequest#transformRequest', () => {
  test('adds umm version header', () => {
    const request = new CollectionRequest()

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual({
      Accept: 'application/vnd.nasa.cmr.umm_results+json; version=1.13',
      'Client-Id': 'eed-edsc-test-serverless-client'
    })
  })
})
