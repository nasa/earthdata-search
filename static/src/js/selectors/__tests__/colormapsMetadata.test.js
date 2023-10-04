import { getColormapsMetadata } from '../colormapsMetadata'

describe('getColormapsMetadata selector', () => {
  test('checks that the metadata returned is formatted correctly.', () => {
    const state = {
      metadata: {
        colormaps: {
          AMSR2_Cloud_Liquid_Water_Day: {
            isLoaded: true,
            isErrored: false,
            isLoading: false,
            colorMapData: { scale: {} }
          }
        }
      }
    }

    expect(getColormapsMetadata(state)).toEqual({
      AMSR2_Cloud_Liquid_Water_Day: {
        isLoaded: true,
        isErrored: false,
        isLoading: false,
        colorMapData: { scale: {} }
      }
    })
  })

  test('returns an empty object when there are no colormaps', () => {
    const state = {
      metadata: {
        colormaps: {

        }
      }
    }

    expect(getColormapsMetadata(state)).toEqual({})
  })
})
