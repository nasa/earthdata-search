import { getCollectionId } from '../collection'

import useEdscStore from '../../useEdscStore'

describe('collection selectors', () => {
  describe('getCollectionId', () => {
    test('returns the focused collection ID', () => {
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collection1'
        }
      }))

      const result = getCollectionId(useEdscStore.getState())
      expect(result).toEqual('collection1')
    })
  })
})
