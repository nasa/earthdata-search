import { supportsShapefileSubsetting } from '../supportsShapefileSubsetting'

describe('supportsShapefileSubsetting', () => {
  describe('when variable subsetting is supported', () => {
    describe('when GeoJSON is not supported', () => {
      test('returns false', () => {
        const response = supportsShapefileSubsetting({
          conceptId: 'S100000-EDSC',
          serviceOptions: {
            subset: {
              spatialSubset: {
                shapefile: [{
                  format: 'ESRI'
                }]
              }
            }
          }
        })

        expect(response).toBeFalsy()
      })
    })
    describe('when GeoJSON is supported', () => {
      test('returns true', () => {
        const response = supportsShapefileSubsetting({
          conceptId: 'S100000-EDSC',
          serviceOptions: {
            subset: {
              spatialSubset: {
                shapefile: [{
                  format: 'GeoJSON'
                }]
              }
            }
          }
        })

        expect(response).toBeTruthy()
      })
    })
  })

  describe('when variable subsetting is not supported', () => {
    test('returns false', () => {
      const response = supportsShapefileSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: null
      })

      expect(response).toBeFalsy()
    })
  })
})
