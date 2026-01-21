import NlpSearchRequest from '../nlpSearchRequest'

import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

describe('NlpSearchRequest#constructor', () => {
  test('sets searchPath correctly', () => {
    const request = new NlpSearchRequest('prod')

    expect(request.searchPath).toBe('search/nlp/query.json')
  })
})

describe('NlpSearchRequest#search', () => {
  test('calls post with searchPath and params', () => {
    const request = new NlpSearchRequest('prod')
    const postSpy = vi.spyOn(request, 'post').mockImplementation()
    const searchParams = {
      q: 'test',
      pageNum: 1
    }

    request.search(searchParams)

    expect(postSpy).toHaveBeenCalledWith('search/nlp/query.json', searchParams)
  })
})

describe('NlpSearchRequest#nonIndexedKeys', () => {
  test('returns an empty array', () => {
    const request = new NlpSearchRequest('prod')

    expect(request.nonIndexedKeys()).toEqual(['search_params'])
  })
})

describe('NlpSearchRequest#permittedCmrKeys', () => {
  test('returns the correct array of permitted keys', () => {
    const request = new NlpSearchRequest('prod')

    expect(request.permittedCmrKeys()).toEqual([
      'embedding',
      'q',
      'search_params'
    ])
  })
})

describe('NlpSearchRequest#transformResponse', () => {
  test('returns transformed data', () => {
    const data = {
      queryInfo: {
        keyword: 'rainfall',
        reasoning: "The query is asking about 'rainfall in DC last year'. 'DC' refers to Washington, D.C., which is the spatial location. 'Last year' means the entire year before the current year, which is 2024. Therefore, the time range is from January 1, 2024, to December 31, 2024. The main topic or keyword is 'rainfall'.",
        temporal: {
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z'
        },
        spatial: {
          geoLocation: 'DC',
          geoJson: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  coordinates: [-77.0163, 38.883],
                  type: 'Point'
                }
              }
            ],
            name: 'DC.json'
          }
        },
        collectionCount: '1'
      },
      metadata: {
        feed: {
          updated: '2025-12-15T15:55:32.279Z',
          id: 'https://cmr.uat.earthdata.nasa.gov:443/search/collections.json',
          title: 'ECHO dataset metadata',
          entry: [{
            id: 'collectionId',
            tags: {}
          }],
          facets: {
            title: 'Browse Collections',
            type: 'group',
            has_children: true,
            children: [
              {
                title: 'Keywords',
                type: 'group',
                applied: false,
                has_children: true,
                children: [{
                  title: 'Atmosphere',
                  type: 'filter',
                  applied: false,
                  count: 88,
                  links: {
                    apply: 'https://cmr.uat.earthdata.nasa.gov:443/search/collections.json?science_keywords_h%5B0%5D%5Btopic%5D=Atmosphere'
                  },
                  has_children: true
                }]
              }
            ]
          }
        }
      }
    }

    const request = new NlpSearchRequest('prod')
    const result = request.transformResponse(data)

    const expectedResult = {
      metadata: {
        feed: {
          ...data.metadata.feed,
          entry: [{
            conceptId: 'collectionId',
            hasMapImagery: false,
            id: 'collectionId',
            isDefaultImage: true,
            isOpenSearch: false,
            tags: {},
            thumbnail: 'test-file-stub'
          }],
          facets: {
            title: 'Browse Collections',
            type: 'group',
            has_children: true,
            children: [
              {
                title: 'Keywords',
                type: 'group',
                applied: false,
                has_children: true,
                children: [{
                  title: 'Atmosphere',
                  type: 'filter',
                  applied: false,
                  count: 88,
                  links: {
                    apply: 'https://cmr.uat.earthdata.nasa.gov:443/search/collections.json?science_keywords_h%5B0%5D%5Btopic%5D=Atmosphere'
                  },
                  has_children: true
                }]
              }
            ]
          }
        }
      },
      queryInfo: {
        keyword: 'rainfall',
        spatial: {
          geoJson: {
            features: [
              {
                geometry: {
                  coordinates: [
                    -77.0163,
                    38.883
                  ],
                  type: 'Point'
                },
                type: 'Feature'
              }
            ],
            name: 'DC.json',
            type: 'FeatureCollection'
          },
          geoLocation: 'DC'
        },
        temporal: {
          endDate: '2024-12-31T23:59:59.999Z',
          startDate: '2024-01-01T00:00:00.000Z'
        }
      }
    }

    expect(result).toEqual(expectedResult)
  })

  test('returns default structure when response has no data', () => {
    const data = {}
    const request = new NlpSearchRequest('prod')
    const result = request.transformResponse(data)

    expect(result).toEqual({
      metadata: undefined,
      queryInfo: {
        keyword: null,
        spatial: {},
        temporal: {}
      }
    })
  })

  test('returns default structure when response has no queryInfo', () => {
    const data = {
      metadata: {
        feed: {
          updated: '2025-12-15T15:55:32.279Z',
          id: 'https://cmr.uat.earthdata.nasa.gov:443/search/collections.json',
          title: 'ECHO dataset metadata',
          entry: [{
            id: 'collectionId',
            tags: {}
          }]
        }
      },
      queryInfo: {}
    }
    const request = new NlpSearchRequest('prod')
    const result = request.transformResponse(data)

    expect(result).toEqual({
      metadata: data.metadata,
      queryInfo: {
        keyword: null,
        spatial: {},
        temporal: {}
      }
    })
  })
})
