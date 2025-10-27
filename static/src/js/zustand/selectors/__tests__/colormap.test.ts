import useEdscStore from '../../useEdscStore'

import { getColormapsMetadata } from '../colormap'

describe('getColormapsMetadata selector', () => {
  test('should return empty object when no collection is focused', () => {
    useEdscStore.setState(() => ({
      collection: {
        collectionId: null,
        collectionMetadata: {}
      }
    }))

    expect(getColormapsMetadata(useEdscStore.getState())).toEqual({})
  })

  test('should return empty object when collection has no colormaps', () => {
    useEdscStore.setState(() => ({
      collection: {
        collectionId: 'C123456789-PROV',
        collectionMetadata: {
          'C123456789-PROV': {
            id: 'C123456789-PROV',
            title: 'Test Collection'
          }
        }
      }
    }))

    expect(getColormapsMetadata(useEdscStore.getState())).toEqual({})
  })

  test('should return colormaps metadata when collection has colormaps', () => {
    const colormaps = {
      MODIS_Terra_SurfaceReflectance_Bands143: {
        scale: {
          colors: ['#ff0000', '#00ff00'],
          values: [0, 1],
          labels: ['Low', 'High']
        }
      }
    }

    useEdscStore.setState(() => ({
      collection: {
        collectionId: 'C123456789-PROV',
        collectionMetadata: {
          'C123456789-PROV': {
            colormaps
          }
        }
      }
    }))

    expect(getColormapsMetadata(useEdscStore.getState())).toEqual(colormaps)
  })
})
