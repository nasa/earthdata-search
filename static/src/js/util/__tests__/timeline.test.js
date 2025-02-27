import { calculateTimelineParams } from '../timeline'

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
      zoomLevel: 5,
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
      zoomLevel: 3,
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
      zoomLevel: 4,
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
      zoomLevel: 2,
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
      zoomLevel: 2,
      initialCenter: (currentDate + currentDate - (24 * 60 * 60 * 1000)) / 2
    })
  })
})
