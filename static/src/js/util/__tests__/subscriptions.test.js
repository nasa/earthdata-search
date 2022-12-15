import { prepareSubscriptionQuery, removeDisabledFieldsFromQuery } from '../subscriptions'

describe('prepareSubscriptionQuery', () => {
  test('returns the correct parameters', () => {
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
      options: { spatial: { or: true } },
      polygon: '-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
      temporalString: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
    }

    expect(prepareSubscriptionQuery(inputParams)).toEqual(result)
  })
})

describe('removeDisabledFieldsFromQuery', () => {
  test('removes disabled field from query', () => {
    const query = {
      keyword: 'modis',
      tagKey: ['mocktag']
    }

    const disabledFields = {
      keyword: true
    }

    const result = removeDisabledFieldsFromQuery(query, disabledFields)

    expect(result).toEqual({ tagKey: ['mocktag'] })
  })

  test('removes disabled tag field from query', () => {
    const query = {
      keyword: 'modis',
      tagKey: ['mocktag']
    }

    const disabledFields = {
      'tagKey-mocktag': true
    }

    const result = removeDisabledFieldsFromQuery(query, disabledFields)

    expect(result).toEqual({ keyword: 'modis' })
  })

  test('removes disabled consortium field from query', () => {
    const query = {
      keyword: 'modis',
      consortium: ['mockConsortium']
    }

    const disabledFields = {
      'consortium-mockConsortium': true
    }

    const result = removeDisabledFieldsFromQuery(query, disabledFields)

    expect(result).toEqual({ keyword: 'modis' })
  })

  test('does not remove a disabled field from the query if it is false in the disabledFields', () => {
    // This can happen when the user disables and field, and reenables it
    const query = {
      keyword: 'modis',
      tagKey: ['mocktag'],
      consortium: ['mockConsortium']
    }

    const disabledFields = {
      keyword: false
    }

    const result = removeDisabledFieldsFromQuery(query, disabledFields)

    expect(result).toEqual({ keyword: 'modis', tagKey: ['mocktag'], consortium: ['mockConsortium'] })
  })

  test('removes any remaining fields that are empty arrays', () => {
    const query = {
      serviceType: []
    }

    const disabledFields = {}

    const result = removeDisabledFieldsFromQuery(query, disabledFields)

    expect(result).toEqual({})
  })

  test('sets hasGranulesOrCwic correctly if the field has been disabled', () => {
    // hasGranulesOrCwic undefined in the query, but true in disabledFields
    const query = {}

    const disabledFields = {
      hasGranulesOrCwic: true
    }

    const result = removeDisabledFieldsFromQuery(query, disabledFields)

    expect(result).toEqual({ hasGranulesOrCwic: true })
  })
})
