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
      }
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
      }
    })
  })
})
