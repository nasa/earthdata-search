import MockDate from 'mockdate'
import {
  calculateTimelineParams,
  prepareTimelineParams,
  timelineIntervalZooms,
  zoomLevelDifference
} from '../timeline'

describe('zoomLevelDifference', () => {
  beforeEach(() => {
    MockDate.set(new Date(2023, 0, 1))
  })

  afterEach(() => {
    MockDate.reset()
  })

  test('returns correct zoom level based on date difference', () => {
    const testCases = [
      // Decade cases
      ['2012-01-01', '2023-01-01', 'decade'], // 11 years
      ['2013-01-01', '2023-01-01', 'decade'], // Exactly 10 years

      // Year cases
      ['2021-01-01', '2023-01-01', 'year'], // 2 years
      ['2022-01-01', '2023-01-01', 'year'], // Exactly 1 year

      // Month cases
      ['2022-07-01', '2023-01-01', 'month'], // 6 months
      ['2022-01-02', '2023-01-01', 'month'], // Just under 1 year
      ['2022-12-01', '2023-01-01', 'month'], // Exactly 1 month

      // Day cases
      ['2022-12-17', '2023-01-01', 'day'], // 15 days
      ['2022-12-02', '2023-01-01', 'day'], // Just under 1 month
      ['2022-12-31', '2023-01-01', 'day'], // Exactly 1 day

      // Hour cases
      ['2022-12-31T12:00:00', '2023-01-01', 'hour'], // 12 hours
      ['2022-12-31T00:01:00', '2023-01-01', 'hour'], // Just under 1 day
      ['2022-12-31T23:45:00', '2023-01-01', 'hour'] // A few minutes
    ]

    testCases.forEach(([startDate, endDate, expected]) => {
      expect(zoomLevelDifference(startDate, endDate)).toBe(expected)
    })
  })

  test('handles various input formats', () => {
    expect(zoomLevelDifference('2022-01-01T00:00:00Z', '2023-01-01T00:00:00Z')).toBe('year')
    expect(zoomLevelDifference('01/01/2022', '01/01/2023')).toBe('year')
    expect(zoomLevelDifference('Jan 1, 2022', 'Jan 1, 2023')).toBe('year')
    expect(zoomLevelDifference(new Date(2022, 0, 1), new Date(2023, 0, 1))).toBe('year')
    expect(zoomLevelDifference('2022-12-01')).toBe('month')
  })
})

describe('calculateTimelineParams', () => {
  // This util function takes this value as a prop, it doesn't call Date.now() directly
  // so it's safe to mock it like this
  const currentDate = 1740668355337 // Thu Feb 27 2025 14:59:15.337

  test('should handle project page with multiple collections', () => {
    const props = {
      isProjectPage: true,
      projectCollectionsIds: ['C100000-EDSC', 'C100001-EDSC', 'C100002-EDSC'],
      collectionMetadata: {
        'C100000-EDSC': {
          timeStart: 1640995200000, // 2022-01-01
          timeEnd: 1654041600000 // 2022-06-01
        },
        'C100001-EDSC': {
          timeStart: 1388534400000, // 2014-01-01
          timeEnd: 1622505600000 // 2021-06-01
        },
        'C100002-EDSC': {
          timeStart: 1672531200000, // 2023-01-01
          timeEnd: 1717200000000 // 2024-06-01
        }
      }
    }
    const expectedStart = new Date(props.collectionMetadata['C100001-EDSC'].timeStart).getTime()
    const expectedEnd = new Date(props.collectionMetadata['C100002-EDSC'].timeEnd).getTime()
    const result = calculateTimelineParams(props)
    expect(result).toEqual({
      zoomLevel: timelineIntervalZooms.decade,
      initialCenter: (expectedStart + expectedEnd) / 2
    })
  })

  test('should handle granule results page', () => {
    const props = {
      isProjectPage: false,
      projectCollectionsIds: [],
      collectionMetadata: {
        'C100000-EDSC': {
          timeStart: 1640995200000, // 2022-01-01
          timeEnd: 1654041600000 // 2022-06-01
        }
      },
      collectionConceptId: 'C100000-EDSC',
      currentDate
    }
    const expectedStart = new Date(props.collectionMetadata['C100000-EDSC'].timeStart).getTime()
    const expectedEnd = new Date(props.collectionMetadata['C100000-EDSC'].timeEnd).getTime()
    const result = calculateTimelineParams(props)
    expect(result).toEqual({
      zoomLevel: timelineIntervalZooms.month,
      initialCenter: (expectedStart + expectedEnd) / 2
    })
  })

  test('should handle collection without timeEnd', () => {
    const props = {
      isProjectPage: false,
      projectCollectionsIds: [],
      collectionMetadata: {
        'C100003-EDSC': {
          timeStart: 1640995200000 // 2022-01-01
        }
      },
      collectionConceptId: 'C100003-EDSC',
      currentDate
    }
    const expectedStart = new Date(props.collectionMetadata['C100003-EDSC'].timeStart).getTime()
    const expectedEnd = currentDate
    const result = calculateTimelineParams(props)
    expect(result).toEqual({
      zoomLevel: timelineIntervalZooms.year,
      initialCenter: (expectedStart + expectedEnd) / 2
    })
  })

  test('should handle project with empty collections', () => {
    const props = {
      isProjectPage: true,
      projectCollectionsIds: [],
      collectionMetadata: {},
      currentDate
    }
    const result = calculateTimelineParams(props)
    expect(result).toEqual({
      zoomLevel: timelineIntervalZooms.day,
      initialCenter: (currentDate + currentDate - (24 * 60 * 60 * 1000)) / 2
    })
  })

  test('should handle collections with missing metadata', () => {
    const props = {
      isProjectPage: true,
      projectCollectionsIds: ['C100004-EDSC', 'C100005-EDSC'],
      collectionMetadata: {
        'C100004-EDSC': {
        },
        'C100005-EDSC': {
        }
      },
      currentDate
    }
    const result = calculateTimelineParams(props)
    expect(result).toEqual({
      zoomLevel: timelineIntervalZooms.day,
      initialCenter: (currentDate + currentDate - (24 * 60 * 60 * 1000)) / 2
    })
  })
})

describe('prepareTimelineParams', () => {
  const setup = (overrides = {}) => {
    const baseStateWithOverrides = {
      authToken: 'test-auth-token',
      focusedCollection: '',
      project: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {
          spatial: {
            boundingBox: [],
            point: [],
            polygon: []
          }
        }
      },
      router: {
        location: {
          pathname: '/search'
        }
      },
      timeline: {
        query: {
          startDate: '2022-01-01T00:00:00Z',
          endDate: '2023-01-01T00:00:00Z',
          interval: 'month'
        }
      },
      ...overrides
    }

    return baseStateWithOverrides
  }

  test('should return null when no conceptIds are available', () => {
    const state = setup()

    expect(prepareTimelineParams(state)).toBeNull()
  })

  test('should return null when startDate is not provided', () => {
    const state = setup({
      focusedCollection: 'C100000-EDSC',
      project: {
        collections: {
          allIds: ['C100000-EDSC', 'C100001-EDSC', 'C100002-EDSC']
        }
      },
      timeline: {
        query: {
          startDate: null
        }
      }
    })

    expect(prepareTimelineParams(state)).toBeNull()
  })

  test('should use project collection IDs when on project page', () => {
    const state = setup({
      focusedCollection: 'C100003-EDSC',
      project: {
        collections: {
          allIds: ['C100000-EDSC', 'C100001-EDSC', 'C100002-EDSC']
        }
      },
      router: {
        location: {
          pathname: '/project/collections'
        }
      }
    })

    const result = prepareTimelineParams(state)

    expect(result).toEqual({
      authToken: 'test-auth-token',
      boundingBox: [],
      conceptId: ['C100000-EDSC', 'C100001-EDSC', 'C100002-EDSC'],
      endDate: '2023-01-01T00:00:00Z',
      interval: 'day',
      point: [],
      polygon: [],
      startDate: '2022-01-01T00:00:00Z'
    })
  })

  test('should use focused collection when not on project page', () => {
    const state = setup({
      focusedCollection: 'C100000-EDSC',
      project: {
        collections: {
          allIds: ['C100000-EDSC', 'C100001-EDSC', 'C100002-EDSC']
        }
      },
      router: {
        location: {
          pathname: '/search/granules'
        }
      }
    })

    const result = prepareTimelineParams(state)

    expect(result).toEqual({
      authToken: 'test-auth-token',
      boundingBox: [],
      conceptId: ['C100000-EDSC'],
      endDate: '2023-01-01T00:00:00Z',
      interval: 'day',
      point: [],
      polygon: [],
      startDate: '2022-01-01T00:00:00Z'
    })
  })

  test('should include spatial parameters when provided', () => {
    const state = setup({
      focusedCollection: 'C100000-EDSC',
      query: {
        collection: {
          spatial: {
            boundingBox: ['-180,90,180,-90'],
            point: ['40,40'],
            polygon: ['10,10,20,20,30,30,10,10']
          }
        }
      },
      router: {
        location: {
          pathname: '/search/granules'
        }
      }
    })

    const result = prepareTimelineParams(state)

    expect(result).toEqual({
      authToken: 'test-auth-token',
      boundingBox: ['-180,90,180,-90'],
      conceptId: ['C100000-EDSC'],
      endDate: '2023-01-01T00:00:00Z',
      interval: 'day',
      point: ['40,40'],
      polygon: ['10,10,20,20,30,30,10,10'],
      startDate: '2022-01-01T00:00:00Z'
    })
  })
})
