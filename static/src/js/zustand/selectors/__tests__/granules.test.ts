import useEdscStore from '../../useEdscStore'
import { getGranules, getGranulesById } from '../granules'

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

  describe('getGranulesById', () => {
    test('returns the granules keyed by their ID', () => {
      useEdscStore.setState(() => ({
        granules: {
          granules: {
            count: 2,
            isLoaded: true,
            isLoading: true,
            items: [{
              id: 'granule1'
            }, {
              id: 'granule2'
            }]
          }
        }
      }))

      const result = getGranulesById(useEdscStore.getState())
      expect(result).toEqual({
        granule1: { id: 'granule1' },
        granule2: { id: 'granule2' }
      })
    })
  })
})
