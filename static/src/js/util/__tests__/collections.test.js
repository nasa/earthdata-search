import { withAdvancedSearch, prepareCollectionParams } from '../collections'

describe('#withAdvancedSearch', () => {
  describe('when no advanced search parameters are passed', () => {
    test('should return the collection params', () => {
      const collectionParams = {
        test: 'test'
      }
      const advancedSearch = {}
      const result = withAdvancedSearch(collectionParams, advancedSearch)

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
        const collectionParams = {
          polygon: originalPolygon
        }
        const advancedSearch = {
          regionSearch: {
            selectedRegion: {
              spatial: advSearchPolygon
            }
          }
        }
        const result = withAdvancedSearch(collectionParams, advancedSearch)

        expect(result).toEqual({
          polygon: advSearchPolygon
        })
      })
    })
  })
})

describe('#prepareCollectionParams', () => {
  describe('when the customize facet is selected', () => {
    test('includes the correct serviceType', () => {
      const params = prepareCollectionParams({
        facetsParams: {
          feature: {
            customizable: true
          }
        }
      })

      expect(params).toEqual(
        expect.objectContaining({
          serviceType: [
            'esi',
            'opendap'
          ]
        })
      )
    })
  })
})
