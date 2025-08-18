import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedGranuleMetadata } from '../granuleMetadata'

describe('getFocusedGranuleMetadata selector', () => {
  test('returns the granule metadata', () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.focusedGranule.focusedGranule = 'granuleId'
    })

    const state = {
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
      metadata: {}
    }

    expect(getFocusedGranuleMetadata(state)).toEqual({})
  })
})
