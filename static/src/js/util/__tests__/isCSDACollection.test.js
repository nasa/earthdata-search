import { isCSDACollection } from '../isCSDACollection'

describe('isCSDACollection', () => {
  describe('when no dataCenters array is provided', () => {
    test('returns false', () => {
      expect(isCSDACollection(undefined)).toEqual(false)
    })
  })

  describe('when provided an empty array', () => {
    test('returns false', () => {
      expect(isCSDACollection([])).toEqual(false)
    })
  })

  describe('when provided an array with no matching data center', () => {
    test('returns false', () => {
      expect(isCSDACollection([
        {
          shortName: 'Some Short Name'
        }
      ])).toEqual(false)
    })
  })

  describe('when provided an array with a matching data center', () => {
    test('returns true', () => {
      expect(isCSDACollection([
        {
          shortName: 'NASA/CSDA'
        }
      ])).toEqual(true)
    })
  })
})
