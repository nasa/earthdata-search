import { isLoggedIn } from '../isLoggedIn'

describe('isLoggedIn', () => {
  describe('when provided an empty string', () => {
    test('returns false', () => {
      expect(isLoggedIn('')).toEqual(false)
    })
  })

  describe('when provided non empty string', () => {
    test('returns true', () => {
      expect(isLoggedIn('token')).toEqual(true)
    })
  })

  describe('when provided null', () => {
    test('returns false', () => {
      expect(isLoggedIn(null)).toEqual(false)
    })
  })
})
