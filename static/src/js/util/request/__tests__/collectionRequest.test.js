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

    const request = new CollectionRequest(undefined, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/collections.json')
  })
})

describe('CollectionRequest#permittedCmrKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new CollectionRequest(undefined, 'prod')

    expect(request.permittedCmrKeys()).toEqual([
      'params',
      'bounding_box',
      'circle',
      'cloud_hosted',
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'data_center',
      'echo_collection_id',
      'facets_size',
      'granule_data_format',
      'granule_data_format_h',
      'has_granules',
      'has_granules_or_cwic',
      'horizontal_data_resolution_range',
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
      'service_type',
      'sort_key',
      'spatial_keyword',
      'tag_key',
      'temporal',
      'two_d_coordinate_system_name'
    ])
  })
})

describe('CollectionRequest#nonIndexedKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new CollectionRequest(undefined, 'prod')

    expect(request.nonIndexedKeys()).toEqual([
      'bounding_box',
      'circle',
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'granule_data_format_h',
      'granule_data_format',
      'horizontal_data_resolution_range',
      'instrument_h',
      'instrument',
      'line',
      'platform_h',
      'platform',
      'point',
      'polygon',
      'processing_level_id_h',
      'project_h',
      'provider',
      'sort_key',
      'service_type',
      'spatial_keyword',
      'tag_key',
      'two_d_coordinate_system_name'
    ])
  })
})

describe('CollectionRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(CollectionRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns transformed data', () => {
    const request = new CollectionRequest(undefined, 'prod')

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
          isOpenSearch: false,
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('return data with isOpenSearch flag correctly', () => {
    const request = new CollectionRequest(undefined, 'prod')

    const data = {
      feed: {
        id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
        title: 'ECHO collection metadata',
        updated: '2019-05-21T01:08:02.143Z',
        entry: [{
          id: 'collectionId',
          links: [{
            length: '0.0KB',
            rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
            hreflang: 'en-US',
            href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
          }]
        }]
      }
    }

    const result = request.transformResponse(data)

    const expectedResult = {
      feed: {
        ...data.feed,
        entry: [{
          id: 'collectionId',
          has_map_imagery: false,
          links: [{
            length: '0.0KB',
            rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
            hreflang: 'en-US',
            href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
          }],
          isOpenSearch: true,
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('return data with isCSDA flag correctly', () => {
    const request = new CollectionRequest(undefined, 'prod')

    const data = {
      feed: {
        id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
        title: 'ECHO collection metadata',
        updated: '2019-05-21T01:08:02.143Z',
        entry: [{
          id: 'collectionId',
          organizations: ['NASA/CSDA']
        }]
      }
    }

    const result = request.transformResponse(data)

    const expectedResult = {
      feed: {
        ...data.feed,
        entry: [{
          id: 'collectionId',
          isCSDA: true,
          organizations: ['NASA/CSDA'],
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  describe('return data with has_map_imagery flag correctly', () => {
    test('when an image is defined', () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

      const request = new CollectionRequest(undefined, 'prod')

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
            isOpenSearch: false,
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
      const request = new CollectionRequest(undefined, 'prod')

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
            isOpenSearch: false,
            tags: {},
            thumbnail: 'test-file-stub'
          }]
        }
      }

      expect(result).toEqual(expectedResult)
    })
  })

  test('returns data if response is not successful', () => {
    const request = new CollectionRequest(undefined, 'prod')

    const data = {
      errors: ['HTTP Request Error']
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})
