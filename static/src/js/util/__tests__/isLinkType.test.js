import { isLinkType } from '../isLinkType'

describe('isLinkType', () => {
  describe('when passed an link that matches', () => {
    test('returns true', () => {
      expect(isLinkType('http://www.link.com/link/testvalue#', 'testvalue')).toEqual(true)
    })
  })

  describe('when passed an link does not match', () => {
    test('returns false', () => {
      expect(isLinkType('http://www.link.com/link/anothertest#', 'testvalue')).toEqual(false)
    })
  })

  describe('when passed an undefined link', () => {
    test('returns false', () => {
      expect(isLinkType(undefined, 'testvalue')).toEqual(false)
    })
  })
})
