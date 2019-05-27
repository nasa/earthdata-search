import { convertSizeToMB, convertSize } from '../project'

describe('project#convertSize', () => {
  test('returns MB correctly', () => {
    expect(convertSize(42)).toEqual({ size: '42.0', unit: 'MB' })
  })

  test('returns GB correctly', () => {
    expect(convertSize(43008)).toEqual({ size: '42.0', unit: 'GB' })
  })

  test('returns TB correctly', () => {
    expect(convertSize(44040192)).toEqual({ size: '42.0', unit: 'TB' })
  })

  test('returns PB correctly', () => {
    expect(convertSize(45097156608)).toEqual({ size: '42.0', unit: 'PB' })
  })

  test('returns EB correctly', () => {
    expect(convertSize(46179488366592)).toEqual({ size: '42.0', unit: 'EB' })
  })
})

describe('project#convertSizeToMB', () => {
  test('returns 0 if not size is given', () => {
    expect(convertSizeToMB()).toEqual(0)
  })

  test('returns 0 if invalid unit is given', () => {
    expect(convertSizeToMB({ size: '42', unit: 'kb' })).toEqual(0)
  })

  test('returns MB value when MB is given', () => {
    expect(convertSizeToMB({ size: '42', unit: 'MB' })).toEqual(42)
  })

  test('returns the correct value for GB', () => {
    expect(convertSizeToMB({ size: '42', unit: 'GB' })).toEqual(43008)
  })

  test('returns the correct value for TB', () => {
    expect(convertSizeToMB({ size: '42', unit: 'TB' })).toEqual(44040192)
  })

  test('returns the correct value for PB', () => {
    expect(convertSizeToMB({ size: '42', unit: 'PB' })).toEqual(45097156608)
  })

  test('returns the correct value for EB', () => {
    expect(convertSizeToMB({ size: '42', unit: 'EB' })).toEqual(46179488366592)
  })
})
