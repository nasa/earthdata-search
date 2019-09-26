import { normalizeTime, getTemporal } from '../edscDate'

describe('normalizeTime', () => {
  describe('when no time is provided', () => {
    test('returns null', () => {
      const result = normalizeTime()
      expect(result).toEqual(null)
    })
  })

  describe('when falsy value is provided', () => {
    test('returns null', () => {
      const result = normalizeTime(false)
      expect(result).toEqual(null)
    })
  })

  describe('when provided and ISO string', () => {
    test('returns a formatted utc date ', () => {
      const result = normalizeTime('2019-04-29T00:00:00.000Z')
      expect(result).toEqual('2019-04-29 00:00:00')
    })
  })
})

describe('getTemporal', () => {
  describe('when passed the same start and end date', () => {
    const result = getTemporal('2019-04-29T00:00:00.000Z', '2019-04-29T00:00:00.000Z')
    test('returns start date only', () => {
      expect(result).toEqual(['2019-04-29 00:00:00', null])
    })
  })

  describe('when passed a different start and end date', () => {
    const result = getTemporal('2019-04-28T00:00:00.000Z', '2019-04-29T00:00:00.000Z')
    test('returns a start and end date', () => {
      expect(result).toEqual(['2019-04-28 00:00:00', '2019-04-29 00:00:00'])
    })
  })

  describe('when passed only a start date', () => {
    const result = getTemporal('2019-04-29T00:00:00.000Z', null)
    test('returns start date only', () => {
      expect(result).toEqual(['2019-04-29 00:00:00', null])
    })
  })

  describe('when passed only a end date', () => {
    const result = getTemporal(null, '2019-04-29T00:00:00.000Z')
    test('returns start date only', () => {
      expect(result).toEqual([null, '2019-04-29 00:00:00'])
    })
  })
})
