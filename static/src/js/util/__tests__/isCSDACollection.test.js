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

  describe('when provided an array of objects', () => {
    describe('when no data center matches', () => {
      test('returns false', () => {
        expect(isCSDACollection([
          {
            shortName: 'Some Short Name'
          }
        ])).toEqual(false)
      })
    })

    describe('when provided a matching data center', () => {
      test('returns true', () => {
        expect(isCSDACollection([
          {
            shortName: 'NASA/CSDA'
          }
        ])).toEqual(true)
      })
    })
  })

  describe('when provided an array of strings', () => {
    describe('when no data center matches', () => {
      test('returns false', () => {
        expect(isCSDACollection([
          'test/org'
        ])).toEqual(false)
      })
    })

    describe('when provided a matching data center', () => {
      test('returns true', () => {
        expect(isCSDACollection([
          'NASA/CSDA'
        ])).toEqual(true)
      })
    })
  })
})
