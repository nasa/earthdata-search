import { createLimitedShapefile } from '../createLimitedShapefile'

describe('createLimitedShapefile', () => {
  test('creates a new shapefile with only the selectedFeatures included', () => {
    const original = {
      type: 'FeatureCollection',
      features: [
        {
          id: 0,
          type: 'Feature',
          geometry: {
            mock: 'feature0'
          }
        },
        {
          id: 1,
          type: 'Feature',
          geometry: {
            mock: 'feature1'
          }
        },
        {
          id: 2,
          type: 'Feature',
          geometry: {
            mock: 'feature2'
          }
        }
      ]
    }

    const expectedResult = {
      type: 'FeatureCollection',
      features: [
        {
          id: 1,
          type: 'Feature',
          geometry: {
            mock: 'feature1'
          }
        }
      ]
    }

    expect(createLimitedShapefile(original, [1])).toEqual(expectedResult)
  })
})
