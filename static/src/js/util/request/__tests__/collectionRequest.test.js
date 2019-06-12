import CollectionRequest from '../collectionRequest'

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
    expect(request.baseUrl).toEqual('http://localhost:3001')
    expect(request.searchPath).toEqual('collections')
  })

  test('sets the default values when unauthenticated', () => {
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
      'format',
      'facets_size',
      'has_granules',
      'has_granules_or_cwic',
      'include_facets',
      'include_granule_counts',
      'include_has_granules',
      'include_tags',
      'include_tags',
      'instrument_h',
      'keyword',
      'line',
      'options',
      'page_num',
      'page_size',
      'platform_h',
      'point',
      'polygon',
      'processing_level_id_h',
      'project_h',
      'science_keywords_h',
      'sort_key',
      'tag_key',
      'temporal'
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
      'instrument_h',
      'platform_h',
      'processing_level_id_h',
      'project_h',
      'sort_key',
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
          is_cwic: false
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
          tags: {
            'org.ceos.wgiss.cwic.granules.prod': 'stuff here'
          },
          is_cwic: true
        }]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('returns data if response is not success', () => {
    const request = new CollectionRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})
