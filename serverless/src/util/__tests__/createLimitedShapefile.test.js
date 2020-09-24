import { createLimitedShapefile } from '../createLimitedShapefile'

describe('createLimitedShapefile', () => {
  test('creates a new shapefile with one selectedFeatures included', () => {
    const original = {
      type: 'FeatureCollection',
      features: [
        {
          edscId: 0,
          type: 'Feature',
          geometry: {
            mock: 'feature0'
          }
        },
        {
          edscId: 1,
          type: 'Feature',
          geometry: {
            mock: 'feature1'
          }
        },
        {
          edscId: 2,
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
          edscId: 1,
          type: 'Feature',
          geometry: {
            mock: 'feature1'
          }
        }
      ]
    }

    expect(createLimitedShapefile(original, [1])).toEqual(expectedResult)
  })

  test('creates a new shapefile with multiple selectedFeatures included', () => {
    const original = {
      type: 'FeatureCollection',
      features: [
        {
          edscId: 0,
          type: 'Feature',
          geometry: {
            mock: 'feature0'
          }
        },
        {
          edscId: 1,
          type: 'Feature',
          geometry: {
            mock: 'feature1'
          }
        },
        {
          edscId: 2,
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
          edscId: 1,
          type: 'Feature',
          geometry: {
            mock: 'feature1'
          }
        },
        {
          edscId: 2,
          type: 'Feature',
          geometry: {
            mock: 'feature2'
          }
        }
      ]
    }

    expect(createLimitedShapefile(original, [1, 2])).toEqual(expectedResult)
  })
})
