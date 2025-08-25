import useEdscStore from '../../useEdscStore'
import { getGranules } from '../granules'

describe('granules selectors', () => {
  describe('getGranules', () => {
    test('returns the granules', () => {
      useEdscStore.setState(() => ({
        granules: {
          granules: {
            count: 1,
            isLoaded: true,
            isLoading: true,
            items: [{
              id: 'granule1'
            }]
          }
        }
      }))

      const result = getGranules(useEdscStore.getState())
      expect(result).toEqual({
        count: 1,
        isLoaded: true,
        isLoading: true,
        items: [{
          id: 'granule1'
        }]
      })
    })
  })
})
