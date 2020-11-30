import { getCmrFacetParams } from '../facetsParams'

describe('getCmrFacetParams', () => {
  test('returns the cmr facet parameters', () => {
    const state = {
      facetsParams: {
        feature: {
          mapImagery: false,
          nearRealTime: false,
          customizable: false
        },
        cmr: {
          platform_h: [
            'AIRCRAFT'
          ]
        },
        viewAll: {}
      }
    }

    expect(getCmrFacetParams(state)).toEqual({
      platform_h: [
        'AIRCRAFT'
      ]
    })
  })

  describe('when there are no selected cmr parameters', () => {
    test('returns an empty object', () => {
      const state = {
        facetsParams: {
          feature: {
            mapImagery: false,
            nearRealTime: false,
            customizable: false
          },
          cmr: {},
          viewAll: {}
        }
      }

      expect(getCmrFacetParams(state)).toEqual({})
    })
  })
})
