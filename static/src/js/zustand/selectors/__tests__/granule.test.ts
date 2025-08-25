import useEdscStore from '../../useEdscStore'
import { getFocusedGranule, getGranuleId } from '../granule'

describe('granules selectors', () => {
  describe('getGranuleId', () => {
    test('returns the granule ID', () => {
      useEdscStore.setState(() => ({
        granule: {
          granuleId: 'granule1'
        }
      }))

      const result = getGranuleId(useEdscStore.getState())
      expect(result).toEqual('granule1')
    })
  })

  describe('getFocusedGranule', () => {
    test('returns the granule ID', () => {
      useEdscStore.setState(() => ({
        granule: {
          granuleId: 'granule1',
          granuleMetadata: {
            granule1: {
              title: 'Granule 1',
              description: 'Description for Granule 1'
            }
          }
        }
      }))

      const result = getFocusedGranule(useEdscStore.getState())
      expect(result).toEqual({
        title: 'Granule 1',
        description: 'Description for Granule 1'
      })
    })
  })
})
