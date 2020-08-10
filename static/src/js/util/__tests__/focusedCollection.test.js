import {
  getCollectionMetadata
} from '../focusedCollection'

describe('getCollectionMetadata', () => {
  describe('when no collections are provided', () => {
    test('returns undefined', () => {
      expect(getCollectionMetadata('TEST')).toEqual(undefined)
    })
  })

  describe('when collections is an empty object', () => {
    test('returns undefined', () => {
      expect(getCollectionMetadata('TEST', {})).toEqual(undefined)
    })
  })

  describe('when passed a non-matching collection', () => {
    test('returns an empty object', () => {
      const collections = {
        byId: {
          TEST2: {
            test: 'test'
          }
        }
      }
      expect(getCollectionMetadata('TEST', collections)).toEqual({})
    })
  })

  describe('when passed a matching collection', () => {
    test('returns the collection metadata', () => {
      const obj = { test: 'test' }
      const collections = {
        TEST: obj
      }
      expect(getCollectionMetadata('TEST', collections)).toEqual(obj)
    })
  })
})
