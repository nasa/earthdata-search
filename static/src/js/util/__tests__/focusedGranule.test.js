import {
  getFocusedGranuleObject
} from '../focusedGranule'

describe('getFocusedGranuleObject', () => {
  describe('when no granules are provided', () => {
    test('returns undefined', () => {
      expect(getFocusedGranuleObject('TEST')).toEqual(undefined)
    })
  })

  describe('when granules is an empty object', () => {
    test('returns undefined', () => {
      expect(getFocusedGranuleObject('TEST', {})).toEqual(undefined)
    })
  })

  describe('when passed a non-matching granule', () => {
    test('returns an empty object', () => {
      const granules = {
        byId: {
          TEST2: {
            test: 'test'
          }
        }
      }
      expect(getFocusedGranuleObject('TEST', granules)).toEqual({})
    })
  })

  describe('when passed a matching granule', () => {
    test('returns an empty object', () => {
      const obj = { test: 'test' }
      const granules = {
        byId: {
          TEST: obj
        }
      }
      expect(getFocusedGranuleObject('TEST', granules)).toEqual(obj)
    })
  })
})
