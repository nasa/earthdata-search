import { getFocusedCollectionId } from '../focusedCollection'

import useEdscStore from '../../useEdscStore'

describe('focusedCollection selectors', () => {
  describe('getFocusedCollectionId', () => {
    test('returns the focused collection ID', () => {
      useEdscStore.setState(() => ({
        focusedCollection: {
          focusedCollection: 'collection1'
        }
      }))

      const result = getFocusedCollectionId(useEdscStore.getState())
      expect(result).toEqual('collection1')
    })
  })
})
