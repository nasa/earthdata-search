import { isLinkType } from '../isLinkType'

describe('isLinkType', () => {
  describe('when passed an link that matches', () => {
    test('returns true', () => {
      expect(isLinkType('testvalue', 'http://www.link.com/link/testvalue#')).toEqual(true)
    })
  })

  describe('when passed an link does not match', () => {
    test('returns false', () => {
      expect(isLinkType('testvalue', 'http://www.link.com/link/anothertest#')).toEqual(false)
    })
  })

  describe('when passed an undefined link', () => {
    test('returns false', () => {
      expect(isLinkType('testvalue', undefined)).toEqual(false)
    })
  })
})
