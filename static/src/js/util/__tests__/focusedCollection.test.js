import {
  getCollectionMetadata,
  getFocusedCollectionMetadata
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
    test('returns an empty object', () => {
      const obj = { test: 'test' }
      const collections = {
        byId: {
          TEST: obj
        }
      }
      expect(getCollectionMetadata('TEST', collections)).toEqual(obj)
    })
  })
})

describe('getFocusedCollectionMetadata', () => {
  describe('when no collections are provided', () => {
    test('returns undefined', () => {
      expect(getFocusedCollectionMetadata('TEST')).toEqual(undefined)
    })
  })

  describe('when collections is an empty object', () => {
    test('returns undefined', () => {
      expect(getFocusedCollectionMetadata('TEST', {})).toEqual(undefined)
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
      expect(getFocusedCollectionMetadata('TEST', collections)).toEqual(undefined)
    })
  })

  describe('when passed a matching collection', () => {
    test('returns an empty object', () => {
      const metadata = { test: 'test' }
      const collections = {
        byId: {
          TEST: {
            metadata
          }
        }
      }
      expect(getFocusedCollectionMetadata('TEST', collections)).toEqual(metadata)
    })
  })
})
