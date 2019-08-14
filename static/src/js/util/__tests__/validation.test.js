import { nullableValue, nullableTemporal } from '../validation'

// TODO: Add tests for functions that use 'this' @medium

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
    // We pass an invalid date object here, as that is what we recieve from Yup when an
    // empty string is passed
    expect(nullableTemporal(new Date('xx'), '')).toEqual(null)
  })

  test('returns value for an non-empty temporal string', () => {
    const date = new Date('xx')
    expect(nullableTemporal(date, '2018-09-09')).toEqual(date)
  })
})
