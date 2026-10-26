import CollectionRequest from '../collectionRequest'
// @ts-expect-error Types are not defined for this module
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'
import { CollectionResponseData } from '../../../types/sharedTypes'

vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

describe('CollectionRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new CollectionRequest(token, 'prod')

    expect(request.authenticated).toBeTruthy()
    expect(request.edlToken).toEqual(token)
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/collections.json')
  })

  test('sets the default values when unauthenticated', () => {
    const request = new CollectionRequest(null, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/collections.json')
  })
})

describe('CollectionRequest#permittedCmrKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new CollectionRequest(null, 'prod')

    expect(request.permittedCmrKeys()).toEqual([
      'bounding_box',
      'browsable',
      'circle',
      'cloud_hosted',
      'collection_data_type',
      'collection_progress',
      'concept_id',
      'consortium',
      'data_center_h',
      'data_center',
      'doi',
      'downloadable',
      'echo_collection_id',
      'entry_id',
      'entry_title',
      'facets_size',
      'granule_data_format_h',
      'granule_data_format',
      'has_granules_or_cwic',
      'has_granules',
      'has_granules_created_at',
      'horizontal_data_resolution_range',
      'include_facets',
      'include_granule_counts',
      'include_has_granules',
      'include_non_operational',
      'include_tags',
      'include_tags',
      'instrument_h',
      'instrument',
      'keyword',
      'latency',
      'line',
      'options',
      'page_num',
      'page_size',
      'params',
      'platform',
      'platforms_h',
      'point',
      'polygon',
      'processing_level_id_h',
      'project_h',
      'project',
      'provider',
      'science_keywords_h',
      'service_type',
      'service_name',
      'short_name',
      'sort_key',
      'spatial_keyword',
      'standard_product',
      'tag_key',
      'temporal',
      'tool_concept_id',
      'tool_name',
      'two_d_coordinate_system_name',
      'version',
      'variable_name'
    ])
  })
})

describe('CollectionRequest#filterData', () => {
  test('preserves advanced collection identifiers in the request payload', () => {
    const request = new CollectionRequest(null, 'prod')

    expect(request.filterData({
      entryId: ['ATL03_004', 'ATL03_003'],
      shortName: 'ATL03',
      version: '003'
    })).toEqual({
      entry_id: ['ATL03_004', 'ATL03_003'],
      short_name: 'ATL03',
      version: '003'
    })
  })
})

describe('CollectionRequest#nonIndexedKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new CollectionRequest(null, 'prod')

    expect(request.nonIndexedKeys()).toEqual([
      'bounding_box',
      'circle',
      'collection_data_type',
      'collection_progress',
      'concept_id',
      'consortium',
      'data_center_h',
      'entry_id',
      'granule_data_format_h',
      'granule_data_format',
      'horizontal_data_resolution_range',
      'instrument_h',
      'instrument',
      'latency',
      'line',
      'platform',
      'point',
      'polygon',
      'processing_level_id_h',
      'project',
      'project_h',
      'provider',
      'service_type',
      'short_name',
      'sort_key',
      'spatial_keyword',
      'tag_key',
      'tool_concept_id',
      'two_d_coordinate_system_name',
      'version'
    ])
  })
})

describe('CollectionRequest#transformRequest', () => {
  test('includes advanced filters with CMR field names in the POST body', () => {
    const request = new CollectionRequest(null, 'prod')
    const body = request.transformRequest({
      doi: '10.5067/EXAMPLE',
      entryTitle: 'Example Collection',
      consortium: ['CEOS'],
      hasGranulesCreatedAt: '2026-01-01T00:00:00Z,',
      collectionDataType: ['SCIENCE_QUALITY'],
      collectionProgress: ['ACTIVE', 'COMPLETE'],
      downloadable: true,
      browsable: true,
      variableName: 'temperature',
      serviceName: 'testServie',
      toolName: 'test_tool'
    }, {})
    if (typeof body !== 'string') throw new TypeError('Expected a URL-encoded request body')

    const params = new URLSearchParams(body)

    expect(Object.fromEntries(params)).toEqual({
      doi: '10.5067/EXAMPLE',
      entry_title: 'Example Collection',
      'consortium[]': 'CEOS',
      has_granules_created_at: '2026-01-01T00:00:00Z,',
      'collection_data_type[]': 'SCIENCE_QUALITY',
      'collection_progress[]': 'COMPLETE',
      downloadable: 'true',
      browsable: 'true',
      variable_name: 'temperature',
      service_name: 'testServie',
      tool_name: 'test_tool'
    })

    expect(params.getAll('collection_progress[]')).toEqual(['ACTIVE', 'COMPLETE'])
  })

  test('includes multiple Entry IDs in the POST body', () => {
    const request = new CollectionRequest(null, 'prod')

    expect(request.transformRequest({ entryId: ['ATL03_004', 'ATL03_003'] }, {}))
      .toEqual('entry_id[]=ATL03_004&entry_id[]=ATL03_003')
  })

  test('includes multiple Short Names and Versions in the POST body', () => {
    const request = new CollectionRequest(null, 'prod')

    expect(request.transformRequest({
      shortName: ['ATL03', 'ATL06'],
      version: ['003', '004']
    }, {}))
      .toEqual('short_name[]=ATL03&short_name[]=ATL06&version[]=003&version[]=004')
  })
})

describe('CollectionRequest#transformResponse', () => {
  test('returns transformed data', () => {
    const request = new CollectionRequest(null, 'prod')

    const data: CollectionResponseData = {
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
          conceptId: 'collectionId',
          hasMapImagery: false,
          id: 'collectionId',
          isDefaultImage: true,
          isOpenSearch: false,
          tags: {},
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('return data with isOpenSearch flag correctly', () => {
    const request = new CollectionRequest(null, 'prod')

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
          conceptId: 'collectionId',
          hasMapImagery: false,
          id: 'collectionId',
          isDefaultImage: true,
          isOpenSearch: true,
          links: [{
            href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev',
            hreflang: 'en-US',
            length: '0.0KB',
            rel: 'http://esipfed.org/ns/fedsearch/1.1/search#'
          }],
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('return data with isCSDA flag correctly', () => {
    const request = new CollectionRequest(null, 'prod')

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
          conceptId: 'collectionId',
          id: 'collectionId',
          isCSDA: true,
          isDefaultImage: true,
          organizations: ['NASA/CSDA'],
          thumbnail: 'test-file-stub'
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  describe('return data with has_map_imagery flag correctly', () => {
    test('when an image is defined', () => {
      vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

      const request = new CollectionRequest(null, 'prod')

      const data: CollectionResponseData = {
        feed: {
          id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_size=1',
          title: 'ECHO collection metadata',
          updated: '2019-05-21T01:08:02.143Z',
          entry: [{
            browse_flag: true,
            id: 'collectionId',
            has_granules: false,
            links: [{
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
              hreflang: 'en-US',
              href: 'https://sample.nasa.gov/thumbnails/thumbnail.jpg'
            }],
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
            browseFlag: true,
            conceptId: 'collectionId',
            hasGranules: false,
            hasMapImagery: true,
            id: 'collectionId',
            isOpenSearch: false,
            links: [{
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
              hreflang: 'en-US',
              href: 'https://sample.nasa.gov/thumbnails/thumbnail.jpg'
            }],
            tags: {
              'edsc.extra.serverless.gibs': 'stuff here'
            },
            thumbnail: 'http://localhost:3000/scale?h=85&w=85&imageSrc=https%3A%2F%2Fsample.nasa.gov%2Fthumbnails%2Fthumbnail.jpg'
          }]
        }
      }

      expect(result).toEqual(expectedResult)
    })

    test('when an image is not defined', () => {
      const request = new CollectionRequest(null, 'prod')

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
            browseFlag: false,
            conceptId: 'collectionId',
            hasGranules: false,
            hasMapImagery: false,
            id: 'collectionId',
            isDefaultImage: true,
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
    const request = new CollectionRequest(null, 'prod')

    const data: CollectionResponseData = {
      errors: ['HTTP Request Error']
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})
