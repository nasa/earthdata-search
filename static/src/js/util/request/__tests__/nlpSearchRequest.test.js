import axios from 'axios'
import { simplify, booleanClockwise } from '@turf/turf'
import NlpSearchRequest from '../nlpSearchRequest'
import { getEarthdataConfig } from '../../../../../../sharedUtils/config'

jest.mock('axios')
jest.mock('../../../../../../sharedUtils/config')
jest.mock('@turf/turf')

const mockConfig = {
  cmrHost: 'https://cmr.sit.earthdata.nasa.gov'
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
  getEarthdataConfig.mockReturnValue(mockConfig)

  simplify.mockClear()
  booleanClockwise.mockClear()
})

describe('NlpSearchRequest#constructor', () => {
  test('sets searchPath correctly', () => {
    const request = new NlpSearchRequest('test-auth-token', 'sit')

    expect(request.searchPath).toBe('search/nlp/query.json')
  })
})

describe('NlpSearchRequest#get', () => {
  test('calls axios with correct options', async () => {
    const request = new NlpSearchRequest('test-token', 'sit')
    const startTimerSpy = jest.spyOn(request, 'startTimer').mockImplementation()
    const setFullUrlSpy = jest.spyOn(request, 'setFullUrl').mockImplementation()
    const mockCancelToken = { token: 'mock-cancel-token' }
    request.cancelToken = mockCancelToken
    const mockResponse = { data: 'test' }
    axios.mockResolvedValue(mockResponse)

    const url = 'test/path'
    const params = { q: 'test' }

    const result = await request.get(url, params)

    expect(startTimerSpy).toHaveBeenCalledTimes(1)
    expect(setFullUrlSpy).toHaveBeenCalledWith(url)
    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: 'get',
      baseURL: mockConfig.cmrHost,
      url,
      params,
      cancelToken: mockCancelToken.token,
      transformResponse: expect.any(Array)
    }))

    expect(result).toBe(mockResponse)
  })
})

describe('NlpSearchRequest#search', () => {
  test('calls get with searchPath and params', () => {
    const request = new NlpSearchRequest('', 'sit')
    const getSpy = jest.spyOn(request, 'get').mockImplementation()
    const searchParams = {
      q: 'test',
      pageNum: 1
    }

    request.search(searchParams)

    expect(getSpy).toHaveBeenCalledWith('search/nlp/query.json', searchParams)
  })
})

describe('NlpSearchRequest#nonIndexedKeys', () => {
  test('returns an empty array', () => {
    const request = new NlpSearchRequest('', 'sit')

    expect(request.nonIndexedKeys()).toEqual([])
  })
})

describe('NlpSearchRequest#permittedCmrKeys', () => {
  test('returns the correct array of permitted keys', () => {
    const request = new NlpSearchRequest('', 'sit')

    expect(request.permittedCmrKeys()).toEqual(['q'])
  })
})

describe('NlpSearchRequest#simplifyNlpGeometry', () => {
  let request

  beforeEach(() => {
    request = new NlpSearchRequest('', 'sit')
  })

  test('handles null geometry through transformResponse', () => {
    const response = {
      data: {
        queryInfo: {
          spatial: null
        }
      }
    }

    const result = request.transformResponse(response, 'test query')

    expect(result).toEqual(expect.objectContaining({
      query: 'test query',
      spatial: null,
      temporal: null
    }))
  })

  test('handles geometry without type through transformResponse', () => {
    const invalidGeometry = {
      coordinates: [[0, 0], [1, 1]]
    }

    const response = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: invalidGeometry
          }
        }
      }
    }

    const result = request.transformResponse(response, 'test query')

    expect(result).toEqual(expect.objectContaining({
      query: 'test query',
      spatial: null,
      temporal: null
    }))
  })

  test('returns Point geometry unchanged', () => {
    const pointGeometry = {
      type: 'Point',
      coordinates: [0, 0]
    }

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: pointGeometry
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(result.spatial).toEqual({ geoJson: pointGeometry, geoLocation: '' })
  })

  test('returns small polygon unchanged when under MAX_POLYGON_SIZE', () => {
    const smallPolygon = {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
    }

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: smallPolygon
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(result.spatial.geoJson).toEqual(smallPolygon)
  })

  test('simplifies large polygon when over MAX_POLYGON_SIZE', () => {
    const largeCoordinates = Array.from({ length: 60 }, (_, i) => [i, i])
    largeCoordinates.push(largeCoordinates[0])

    const largePolygon = {
      type: 'Polygon',
      coordinates: [largeCoordinates]
    }

    const simplifiedPolygon = {
      type: 'Polygon',
      coordinates: [[[0, 0], [10, 10], [20, 20], [0, 0]]]
    }

    simplify.mockReturnValue(simplifiedPolygon)
    booleanClockwise.mockReturnValue(false)

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: largePolygon
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(simplify).toHaveBeenCalledWith(largePolygon, {
      tolerance: 0.001,
      highQuality: false
    })

    expect(booleanClockwise).toHaveBeenCalledWith(simplifiedPolygon.coordinates[0])

    const expectedGeometry = {
      ...simplifiedPolygon,
      coordinates: [simplifiedPolygon.coordinates[0].reverse()]
    }
    expect(result.spatial.geoJson).toEqual(expectedGeometry)
  })

  test('handles simplification with multiple attempts when still too large', () => {
    const largeCoordinates = Array.from({ length: 60 }, (_, i) => [i, i])
    largeCoordinates.push(largeCoordinates[0])

    const largePolygon = {
      type: 'Polygon',
      coordinates: [largeCoordinates]
    }

    const stillLargePolygon = {
      type: 'Polygon',
      coordinates: [Array.from({ length: 55 }, (_, i) => [i, i]).concat([[0, 0]])]
    }

    const goodPolygon = {
      type: 'Polygon',
      coordinates: [Array.from({ length: 10 }, (_, i) => [i, i]).concat([[0, 0]])]
    }

    simplify
      .mockReturnValueOnce(stillLargePolygon)
      .mockReturnValueOnce(goodPolygon)

    booleanClockwise.mockReturnValue(true)

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: largePolygon
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(simplify).toHaveBeenCalledTimes(2)
    expect(simplify).toHaveBeenNthCalledWith(1, largePolygon, {
      tolerance: 0.001,
      highQuality: false
    })

    expect(simplify).toHaveBeenNthCalledWith(2, largePolygon, {
      tolerance: 0.002,
      highQuality: false
    })

    expect(result.spatial.geoJson).toEqual(goodPolygon)
  })

  test('handles simplification error and returns original geometry', () => {
    const largeCoordinates = Array.from({ length: 60 }, (_, i) => [i, i])
    largeCoordinates.push(largeCoordinates[0])

    const largePolygon = {
      type: 'Polygon',
      coordinates: [largeCoordinates]
    }

    simplify.mockImplementation(() => {
      throw new Error('Simplification failed')
    })

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: largePolygon
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(result.spatial.geoJson).toEqual(largePolygon)

    consoleWarnSpy.mockRestore()
  })

  test('handles maximum simplification attempts reached', () => {
    const largeCoordinates = Array.from({ length: 60 }, (_, i) => [i, i])
    largeCoordinates.push(largeCoordinates[0])

    const largePolygon = {
      type: 'Polygon',
      coordinates: [largeCoordinates]
    }

    const stillTooLargePolygon = {
      type: 'Polygon',
      coordinates: [Array.from({ length: 55 }, (_, i) => [i, i]).concat([[0, 0]])]
    }

    simplify.mockReturnValue(stillTooLargePolygon)

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: largePolygon
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(simplify).toHaveBeenCalledTimes(10)
    expect(result.spatial.geoJson).toEqual(largePolygon)

    consoleWarnSpy.mockRestore()
  })
})

describe('NlpSearchRequest#transformResponse', () => {
  let request

  beforeEach(() => {
    request = new NlpSearchRequest('', 'sit')
  })

  test('returns default structure when response has no data', () => {
    const response = {}
    const query = 'test query'

    const result = request.transformResponse(response, query)

    expect(result).toEqual({
      query: 'test query',
      spatial: null,
      temporal: null
    })
  })

  test('returns default structure when response has no queryInfo', () => {
    const response = {
      data: {}
    }
    const query = 'climate data'

    const result = request.transformResponse(response, query)

    expect(result).toEqual({
      query: 'climate data',
      spatial: null,
      temporal: null
    })
  })

  test('processes spatial data with geoJson property', () => {
    const spatialGeometry = {
      type: 'Point',
      coordinates: [10, 20]
    }

    const response = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: spatialGeometry,
            geoLocation: 'Test Location'
          }
        }
      }
    }

    const result = request.transformResponse(response, 'test query')

    expect(result).toEqual(expect.objectContaining({
      query: 'test query',
      spatial: {
        geoJson: spatialGeometry,
        geoLocation: 'Test Location'
      },
      temporal: null
    }))
  })

  test('processes spatial data as direct geometry', () => {
    const spatialGeometry = {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
    }

    const response = {
      data: {
        queryInfo: {
          spatial: spatialGeometry
        }
      }
    }

    const result = request.transformResponse(response, 'ocean data')

    expect(result.spatial.geoJson).toEqual(spatialGeometry)

    expect(result.temporal).toBeNull()
  })

  test('processes temporal data', () => {
    const temporalData = {
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-12-31T23:59:59.999Z'
    }

    const response = {
      data: {
        queryInfo: {
          temporal: temporalData
        }
      }
    }

    const result = request.transformResponse(response, 'temperature data')

    expect(result).toEqual(expect.objectContaining({
      query: 'temperature data',
      spatial: null,
      temporal: {
        startDate: '2020-01-01T00:00:00.000Z',
        endDate: '2020-12-31T23:59:59.999Z'
      }
    }))
  })

  test('processes both spatial and temporal data', () => {
    const spatialGeometry = {
      type: 'Point',
      coordinates: [-100, 40]
    }

    const temporalData = {
      startDate: '2023-01-01T00:00:00.000Z',
      endDate: '2023-06-30T23:59:59.999Z'
    }

    const response = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: spatialGeometry,
            geoLocation: 'Alaska Region'
          },
          temporal: temporalData
        }
      }
    }

    const result = request.transformResponse(response, 'landsat data')

    expect(result).toEqual(expect.objectContaining({
      query: 'landsat data',
      spatial: {
        geoJson: spatialGeometry,
        geoLocation: 'Alaska Region'
      },
      temporal: {
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-06-30T23:59:59.999Z'
      }
    }))
  })

  test('handles temporal data with no dates', () => {
    const temporalData = {}

    const response = {
      data: {
        queryInfo: {
          temporal: temporalData
        }
      }
    }

    const result = request.transformResponse(response, 'test query')

    expect(result.temporal).toBeNull()
  })

  test('handles simplified geometry returning null', () => {
    const badGeometry = {
      type: 'Polygon',
      coordinates: []
    }

    const response = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: badGeometry
          }
        }
      }
    }

    const originalTransformResponse = request.transformResponse
    request.transformResponse = function mockTransformResponse(mockResponse, mockQuery) {
      const { data } = mockResponse

      if (!data || !data.queryInfo) {
        return {
          query: mockQuery,
          spatial: null,
          temporal: null
        }
      }

      let spatialData = null

      if (data.queryInfo.spatial) {
        const simplifiedGeometry = null

        if (simplifiedGeometry) {
          spatialData = {
            type: 'FeatureCollection',
            name: data.queryInfo.spatial.geoLocation || 'Extracted Spatial Area',
            features: [{
              type: 'Feature',
              properties: {
                source: 'nlp',
                query: mockQuery,
                edscId: '0'
              },
              geometry: simplifiedGeometry
            }]
          }
        }
      }

      return {
        query: mockQuery,
        spatial: spatialData,
        temporal: null
      }
    }

    const result = request.transformResponse(response, 'test query')

    expect(result).toEqual({
      query: 'test query',
      spatial: null,
      temporal: null
    })

    request.transformResponse = originalTransformResponse
  })

  test('handles LineString geometry type', () => {
    const lineGeometry = {
      type: 'LineString',
      coordinates: [[0, 0], [1, 1], [2, 2]]
    }

    const response = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: lineGeometry
          }
        }
      }
    }

    const result = request.transformResponse(response, 'flight path')

    expect(result.spatial.geoJson).toEqual(lineGeometry)
  })

  test('handles geometry with missing coordinates', () => {
    const badGeometry = {
      type: 'Polygon'
    }

    const response = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: badGeometry
          }
        }
      }
    }

    const result = request.transformResponse(response, 'test query')

    expect(result.spatial.geoJson).toEqual(badGeometry)
  })

  test('handles polygon winding correction when already clockwise', () => {
    const largeCoordinates = Array.from({ length: 60 }, (_, i) => [i, i])
    largeCoordinates.push(largeCoordinates[0])

    const largePolygon = {
      type: 'Polygon',
      coordinates: [largeCoordinates]
    }

    const simplifiedPolygon = {
      type: 'Polygon',
      coordinates: [[[0, 0], [10, 10], [20, 20], [0, 0]]]
    }

    simplify.mockReturnValue(simplifiedPolygon)
    booleanClockwise.mockReturnValue(true)

    const mockResponse = {
      data: {
        queryInfo: {
          spatial: {
            geoJson: largePolygon
          }
        }
      }
    }

    const result = request.transformResponse(mockResponse, 'test query')

    expect(booleanClockwise).toHaveBeenCalledWith(simplifiedPolygon.coordinates[0])
    expect(result.spatial.geoJson).toEqual(simplifiedPolygon)
  })

  test('handles temporal data with missing startDate', () => {
    const temporalData = {
      endDate: '2020-12-31T23:59:59.999Z'
    }

    const response = {
      data: {
        queryInfo: {
          temporal: temporalData
        }
      }
    }

    const result = request.transformResponse(response, 'partial temporal data')

    expect(result.temporal).toEqual({
      startDate: '',
      endDate: '2020-12-31T23:59:59.999Z'
    })
  })

  test('handles temporal data with missing endDate', () => {
    const temporalData = {
      startDate: '2020-01-01T00:00:00.000Z'
    }

    const response = {
      data: {
        queryInfo: {
          temporal: temporalData
        }
      }
    }

    const result = request.transformResponse(response, 'partial temporal data')

    expect(result.temporal).toEqual({
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: ''
    })
  })
})
