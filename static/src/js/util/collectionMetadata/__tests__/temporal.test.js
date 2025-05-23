import {
  getDaysFromIsoDate,
  parseTemporal,
  buildTemporal
} from '../temporal'

describe('getDaysFromIsoDate', () => {
  test('returns the date in YYYY-MM-DD format for a valid ISO string', () => {
    const isoDate = '2023-10-01T12:34:56Z'
    expect(getDaysFromIsoDate(isoDate)).toEqual('2023-10-01')
  })

  test('returns an empty string for an empty input', () => {
    expect(getDaysFromIsoDate('')).toEqual('')
  })

  test('returns an empty string for undefined input', () => {
    expect(getDaysFromIsoDate(undefined)).toEqual('')
  })
})

describe('parseTemporal', () => {
  test('returns a range for rangeDateTimes', () => {
    const metadata = {
      endsAtPresentFlag: false,
      rangeDateTimes: [
        {
          beginningDateTime: '2023-01-01T00:00:00Z',
          endingDateTime: '2023-12-31T23:59:59Z'
        }
      ]
    }

    expect(parseTemporal(metadata)).toEqual([['2023-01-01 to 2023-12-31']])
  })

  test('returns a range with "ongoing" for rangeDateTimes when endsAtPresentFlag is true', () => {
    const metadata = {
      endsAtPresentFlag: true,
      rangeDateTimes: [
        {
          beginningDateTime: '2023-01-01T00:00:00Z',
          endingDateTime: ''
        }
      ]
    }

    expect(parseTemporal(metadata)).toEqual([['2023-01-01 to Present']])
  })

  test('returns "Not available" for invalid temporalRangeType', () => {
    const metadata = {
      endsAtPresentFlag: false
    }

    expect(parseTemporal(metadata)).toEqual('Not available')
  })

  test('parses singleDateTimes correctly', () => {
    const json = {
      endsAtPresentFlag: false,
      singleDateTimes: [
        '1990-07-01T00:00:00.000Z',
        '1995-07-01T00:00:00.000Z',
        '2000-07-01T00:00:00.000Z'
      ],
      temporalResolution: {
        Value: 43,
        Unit: 'Minute'
      }
    }
    expect(parseTemporal(json)).toEqual(['1990-07-01', '1995-07-01', '2000-07-01'])
  })

  test('parses singleDateTimes where the endsAtPresent flag is true', () => {
    const json = {
      endsAtPresentFlag: true,
      singleDateTimes: ['1990-07-01', '1995-07-01', '2000-07-01'],
      temporalResolution: {
        Value: 43,
        Unit: 'Minute'
      }
    }
    expect(parseTemporal(json)).toEqual(['1990-07-01 to Present', '1995-07-01 to Present', '2000-07-01 to Present'])
  })
})

describe('buildTemporal', () => {
  test('parses temporalExtents correctly for single date time that is not to Present', () => {
    const json = {
      temporalExtents: [
        {
          endsAtPresentFlag: false,
          rangeDateTimes: [
            {
              beginningDateTime: '2018-10-13T00:00:00.000Z',
              endingDateTime: '2020-11-13T00:00:00.000Z'
            }
          ]
        }
      ]
    }

    expect(buildTemporal(json)).toEqual(['2018-10-13 to 2020-11-13'])
  })

  test('parses temporalExtents correctly for single date time that is to Present', () => {
    const json = {
      temporalExtents: [
        {
          endsAtPresentFlag: true,
          rangeDateTimes: [
            {
              beginningDateTime: '2018-10-13T00:00:00.000Z',
              endingDateTime: ''
            }
          ]
        }
      ]
    }

    expect(buildTemporal(json)).toEqual(['2018-10-13 to Present'])
  })

  test('parses temporalExtents correctly for multiple entries', () => {
    const json = {
      temporalExtents: [
        {
          rangeDateTimes: [
            {
              beginningDateTime: '2018-01-01T00:00:00Z',
              endingDateTime: '2022-01-01T00:00:00Z'
            }
          ]
        },
        {
          rangeDateTimes: [
            {
              beginningDateTime: '2023-01-01T00:00:00Z',
              endingDateTime: '2023-12-31T23:59:59Z'
            }
          ]
        },
        {
          rangeDateTimes: [
            {
              beginningDateTime: '2024-01-01T00:00:00Z',
              endingDateTime: ''
            }
          ]
        }
      ]
    }

    expect(buildTemporal(json)).toEqual([
      '2018-01-01 to 2022-01-01',
      '2023-01-01 to 2023-12-31',
      '2024-01-01 to Present'
    ])
  })

  test('returns "Not available" for invalid temporalExtents', () => {
    const json = {
      temporalExtents: 'invalid'
    }

    expect(buildTemporal(json)).toEqual(['Not available'])
  })
})
