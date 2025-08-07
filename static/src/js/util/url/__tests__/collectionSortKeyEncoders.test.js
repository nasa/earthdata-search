import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import { encodeCollectionSortKey, decodeCollectionSortKey } from '../collectionSortKeyEncoders'

describe('encodeCollectionSortKey', () => {
  describe('when the sort key matches the default', () => {
    test('returns undefined', () => {
      const result = encodeCollectionSortKey(
        collectionSortKeys.scoreDescending,
        'default'
      )

      expect(result).toBeUndefined()
    })
  })

  describe('when the sort key matches the default but the user preferences is different', () => {
    test('returns the encoded sort key', () => {
      const result = encodeCollectionSortKey(
        collectionSortKeys.scoreDescending,
        collectionSortKeys.usageDescending
      )

      expect(result).toEqual({
        csk: collectionSortKeys.scoreDescending
      })
    })
  })

  describe('when the sort key matches the user preference', () => {
    test('returns undefined', () => {
      const result = encodeCollectionSortKey(
        collectionSortKeys.usageDescending,
        collectionSortKeys.usageDescending
      )

      expect(result).toBeUndefined()
    })
  })

  describe('when the sort key should be encoded', () => {
    test('returns the encoded sort key', () => {
      const result = encodeCollectionSortKey(
        collectionSortKeys.startDateAscending,
        collectionSortKeys.usageDescending
      )

      expect(result).toEqual({
        csk: collectionSortKeys.startDateAscending
      })
    })
  })
})

describe('decodeCollectionSortKey', () => {
  describe('when the params include a sort key', () => {
    test('returns the decoded value', () => {
      const params = {
        csk: collectionSortKeys.startDateAscending
      }

      expect(decodeCollectionSortKey(params)).toEqual(collectionSortKeys.startDateAscending)
    })
  })

  describe('when the params do not include a sort key', () => {
    test('returns the default sort key', () => {
      const params = {}

      expect(decodeCollectionSortKey(params)).toEqual(undefined)
    })
  })
})
