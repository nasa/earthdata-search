import { decodeGranuleFilters, encodeGranuleFilters } from '../granuleFiltersEncoders'

describe('url#decodeGranuleFilters', () => {
  test('decodes granule filters correctly', () => {
    const expectedResult = {
      temporal: {
        endDate: '2016-07-09T00:00.000Z',
        startDate: '2015-07-09T00:00.000Z',
        recurringDayEnd: '',
        recurringDayStart: '',
        isRecurring: false
      },
      dayNightFlag: 'NIGHT',
      browseOnly: true,
      onlineOnly: true,
      cloudCover: {
        max: 2,
        min: 1
      },
      orbitNumber: {
        min: 3000,
        max: 3009
      },
      equatorCrossingLongitude: {
        min: -45,
        max: 45
      },
      equatorCrossingDate: {
        endDate: '2016-05-09T00:00.000Z',
        startDate: '2015-06-09T00:00.000Z',
        recurringDayEnd: '',
        recurringDayStart: '',
        isRecurring: false
      }
    }
    expect(decodeGranuleFilters({
      qt: '2015-07-09T00:00.000Z,2016-07-09T00:00.000Z',
      dnf: 'NIGHT',
      bo: 'true',
      oo: 'true',
      cc: {
        max: 2,
        min: 1
      },
      on: {
        max: 3009,
        min: 3000
      },
      ecl: {
        min: -45,
        max: 45
      },
      ecd: '2015-06-09T00:00.000Z,2016-05-09T00:00.000Z'
    })).toEqual(expectedResult)
  })
})

describe('url#encodeGranuleFilters', () => {
  test('encodes granule filters correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      temporal: {
        endDate: '2016-07-09T00:00.000Z',
        startDate: '2015-07-09T00:00.000Z'
      },
      dayNightFlag: 'NIGHT',
      browseOnly: true,
      onlineOnly: true,
      cloudCover: {
        max: 2,
        min: 1
      },
      orbitNumber: {
        min: 3000,
        max: 3009
      },
      equatorCrossingLongitude: {
        min: -45,
        max: 45
      },
      equatorCrossingDate: {
        endDate: '2016-05-09T00:00.000Z',
        startDate: '2015-06-09T00:00.000Z'
      }
    }
    expect(encodeGranuleFilters(props)).toEqual({
      qt: '2015-07-09T00:00.000Z,2016-07-09T00:00.000Z',
      dnf: 'NIGHT',
      bo: true,
      oo: true,
      cc: {
        max: 2,
        min: 1
      },
      on: {
        max: 3009,
        min: 3000
      },
      ecl: {
        min: -45,
        max: 45
      },
      ecd: '2015-06-09T00:00.000Z,2016-05-09T00:00.000Z'
    })
  })
})
