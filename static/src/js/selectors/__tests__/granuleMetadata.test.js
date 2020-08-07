import { getFocusedGranuleMetadata } from '../granuleMetadata'

describe('getFocusedGranuleMetadata selector', () => {
  test('returns the granule metadata', () => {
    const state = {
      focusedGranule: 'granuleId',
      metadata: {
        granules: {
          granuleId: {
            mock: 'data'
          }
        }
      }
    }

    expect(getFocusedGranuleMetadata(state)).toEqual({ mock: 'data' })
  })

  test('returns an empty object when there is no focusedGranule', () => {
    const state = {
      focusedGranule: '',
      metadata: {}
    }

    expect(getFocusedGranuleMetadata(state)).toEqual({})
  })
})
