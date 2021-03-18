import { pruneFilters } from '../pruneFilters'

describe('pruneFilters', () => {
  test('removes empty values', () => {
    const inputParams = {
      boundingBox: undefined,
      browseOnly: true,
      circle: undefined,
      cloudCover: '',
      collectionId: 'collectionId',
      conceptId: [],
      dayNightFlag: undefined,
      equatorCrossingDate: undefined,
      equatorCrossingLongitude: undefined,
      exclude: {},
      gridCoords: '',
      isOpenSearch: false,
      line: undefined,
      onlineOnly: undefined,
      options: { spatial: { or: true } },
      orbitNumber: undefined,
      pageNum: 2,
      point: undefined,
      polygon: '-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
      readableGranuleName: undefined,
      sortKey: '-start_date',
      temporalString: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z',
      tilingSystem: undefined
    }

    const result = {
      browseOnly: true,
      collectionId: 'collectionId',
      conceptId: [],
      options: { spatial: { or: true } },
      pageNum: 2,
      polygon: '-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
      sortKey: '-start_date',
      temporalString: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
    }

    expect(pruneFilters(inputParams)).toEqual(result)
  })
})
