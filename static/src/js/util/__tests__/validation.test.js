import { nullableValue, nullableTemporal, dateOutsideRange } from '../validation'

describe('#nullableValue', () => {
  test('returns null for an empty string', () => {
    expect(nullableValue('', '')).toEqual(null)
  })

  test('returns value for an non-empty string', () => {
    expect(nullableValue('Testing value', 'Testing value')).toEqual('Testing value')
  })
})

describe('#nullableTemporal', () => {
  test('returns null for an empty temporal string', () => {
    // We pass an invalid date object here, as that is what we receive from Yup when an
    // empty string is passed
    expect(nullableTemporal(new Date('xx'), '')).toEqual(null)
  })

  test('returns value for an non-empty temporal string', () => {
    const date = new Date('xx')
    expect(nullableTemporal(date, '2018-09-09')).toEqual(date)
  })
})

describe('#dateOutsideRange', () => {
  describe('with no value provided', () => {
    test('returns true', () => {
      expect(dateOutsideRange('')).toEqual(true)
    })
  })

  describe('when both start and end are defined', () => {
    test('before the range', () => {
      expect(dateOutsideRange('2018-01-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z')).toEqual(false)
    })

    test('equal to the start date', () => {
      expect(dateOutsideRange('2019-01-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z')).toEqual(true)
    })

    test('inside the range', () => {
      expect(dateOutsideRange('2019-02-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z')).toEqual(true)
    })

    test('equal to the end date', () => {
      expect(dateOutsideRange('2020-01-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z')).toEqual(true)
    })

    test('after the range', () => {
      expect(dateOutsideRange('2021-02-01T00:00:00.000Z', '2019-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z')).toEqual(false)
    })
  })

  describe('when only start is defined', () => {
    test('before the start date', () => {
      expect(dateOutsideRange('2019-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z', '')).toEqual(false)
    })

    test('equal to the start date', () => {
      expect(dateOutsideRange('2020-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z', '')).toEqual(true)
    })

    test('after to the start date', () => {
      expect(dateOutsideRange('2021-01-01T00:00:00.000Z', '2020-01-01T00:00:00.000Z', '')).toEqual(true)
    })
  })

  describe('when only end is defined', () => {
    test('before the end date', () => {
      expect(dateOutsideRange('2018-01-01T00:00:00.000Z', '', '2020-01-01T00:00:00.000Z')).toEqual(true)
    })

    test('equal to the end date', () => {
      expect(dateOutsideRange('2020-01-01T00:00:00.000Z', '', '2020-01-01T00:00:00.000Z')).toEqual(true)
    })

    test('after to the end date', () => {
      expect(dateOutsideRange('2021-01-01T00:00:00.000Z', '', '2020-01-01T00:00:00.000Z')).toEqual(false)
    })
  })
})
