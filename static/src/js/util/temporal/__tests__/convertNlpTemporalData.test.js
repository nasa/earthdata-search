import { convertNlpTemporalData } from '../convertNlpTemporalData'

describe('convertNlpTemporalData', () => {
  test('converts valid date range from ISO format to application format', () => {
    const nlpTemporal = {
      startDate: '2020-01-01T00:00:00+00:00',
      endDate: '2020-12-31T00:00:00+00:00'
    }

    const result = convertNlpTemporalData(nlpTemporal)

    expect(result).toEqual({
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-12-31T23:59:59.999Z',
      recurringDayStart: '',
      recurringDayEnd: '',
      isRecurring: false
    })
  })

  test('converts only start date when end date is missing', () => {
    const nlpTemporal = {
      startDate: '2020-06-15T00:00:00+00:00'
    }

    const result = convertNlpTemporalData(nlpTemporal)

    expect(result).toEqual({
      startDate: '2020-06-15T00:00:00.000Z',
      endDate: '',
      recurringDayStart: '',
      recurringDayEnd: '',
      isRecurring: false
    })
  })

  test('converts only end date when start date is missing', () => {
    const nlpTemporal = {
      endDate: '2020-12-31T00:00:00+00:00'
    }

    const result = convertNlpTemporalData(nlpTemporal)

    expect(result).toEqual({
      startDate: '',
      endDate: '2020-12-31T23:59:59.999Z',
      recurringDayStart: '',
      recurringDayEnd: '',
      isRecurring: false
    })
  })

  test('handles invalid date formats gracefully', () => {
    const consoleMock = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const nlpTemporal = {
      startDate: 'invalid-date',
      endDate: '2020-12-31T00:00:00+00:00'
    }

    const result = convertNlpTemporalData(nlpTemporal)

    expect(result).toEqual({
      startDate: '',
      endDate: '2020-12-31T23:59:59.999Z',
      recurringDayStart: '',
      recurringDayEnd: '',
      isRecurring: false
    })

    expect(consoleMock).toHaveBeenCalledWith('Invalid start date format:', 'invalid-date')
    consoleMock.mockRestore()
  })

  test('returns null when no dates are provided', () => {
    const nlpTemporal = {}
    const result = convertNlpTemporalData(nlpTemporal)
    expect(result).toBeNull()
  })

  test('returns null when input is null or undefined', () => {
    expect(convertNlpTemporalData(null)).toBeNull()
    expect(convertNlpTemporalData(undefined)).toBeNull()
    expect(convertNlpTemporalData('not an object')).toBeNull()
  })

  test('handles conversion errors correctly', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Spy on Date constructor to force an error
    const originalDate = global.Date
    global.Date = jest.fn(() => {
      throw new Error('Date constructor error')
    })

    const nlpTemporal = {
      startDate: '2020-01-01T00:00:00+00:00',
      endDate: '2020-12-31T00:00:00+00:00'
    }

    const result = convertNlpTemporalData(nlpTemporal)

    expect(result).toBeNull()
    expect(consoleErrorMock).toHaveBeenCalledWith('Error converting NLP temporal data:', expect.any(Error))

    // Restore original Date constructor
    global.Date = originalDate
    consoleErrorMock.mockRestore()
  })
})
