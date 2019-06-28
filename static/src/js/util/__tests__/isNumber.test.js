import { isNumber } from '../isNumber'

describe('isNumber', () => {
  describe('when provided a non number string', () => {
    test('returns false', () => {
      expect(isNumber('test')).toEqual(false)
    })
  })

  describe('when provided a number string', () => {
    test('returns true', () => {
      expect(isNumber('100')).toEqual(true)
    })
  })
})
