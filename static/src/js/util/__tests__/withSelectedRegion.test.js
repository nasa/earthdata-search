import { withSelectedRegion } from '../withSelectedRegion'

describe('#withSelectedRegion', () => {
  describe('when no advanced search parameters are passed', () => {
    test('should return the collection params', () => {
      const params = {
        test: 'test'
      }
      const selectedRegion = {}
      const result = withSelectedRegion(params, selectedRegion)

      expect(result).toEqual({
        test: 'test'
      })
    })
  })

  describe('when advanced search parameters are passed', () => {
    describe('when a region search is set', () => {
      test('should return the collection params with a modified polygon', () => {
        const originalPolygon = '1,2,3,4,1,2,3,4'
        const advSearchPolygon = '5,6,7,8,5,6,7,8'
        const params = {
          polygon: originalPolygon
        }
        const selectedRegion = {
          spatial: advSearchPolygon
        }
        const result = withSelectedRegion(params, selectedRegion)

        expect(result).toEqual({
          polygon: [advSearchPolygon]
        })
      })

      test('should return the collection params with a modified line', () => {
        const originalLine = '1,2,3,4,1,2,3,4'
        const advSearchLine = '5,6,7,8,5,6,7,8'
        const params = {
          line: originalLine
        }
        const selectedRegion = {
          type: 'reach',
          spatial: advSearchLine
        }
        const result = withSelectedRegion(params, selectedRegion)

        expect(result).toEqual({
          line: [advSearchLine]
        })
      })
    })
  })
})
