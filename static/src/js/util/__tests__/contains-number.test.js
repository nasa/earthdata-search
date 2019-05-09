import { containsNumber } from '../contains-number'

describe('containsNumber', () => {
  describe('when provided a non number string', () => {
    test('returns false', () => {
      expect(containsNumber('test')).toEqual(false)
    })
  })

  describe('when provided a number string', () => {
    test('returns true', () => {
      expect(containsNumber('100')).toEqual(true)
    })
  })
})
