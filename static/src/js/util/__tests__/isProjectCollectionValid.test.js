import { isProjectCollectionValid } from '../isProjectCollectionValid'

describe('isProjectCollectionValid', () => {
  describe('when passed an invalid access method', () => {
    test('returns false', () => {
      const method = {}
      expect(isProjectCollectionValid(method)).toEqual(false)
    })
  })

  describe('when passed a valid access method', () => {
    test('returns true', () => {
      const method = {
        download: {
          type: 'download'
        }
      }
      expect(isProjectCollectionValid(method)).toEqual(true)
    })
  })
})