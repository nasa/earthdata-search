import { withAdvancedSearch, prepareCollectionParams, buildCollectionSearchParams } from '../collections'

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
    test('includes the correct tags', () => {
      const params = prepareCollectionParams({
        facetsParams: {
          feature: {
            customizable: true
          }
        }
      })

      expect(params).toEqual(
        expect.objectContaining({
          tagKey: [
            'edsc.extra.serverless.subset_service.esi',
            'edsc.extra.serverless.subset_service.opendap'
          ]
        })
      )
    })
  })
})

describe('#buildCollectionSearchParams', () => {
  describe('with multiple bounding boxes', () => {
    test('adds the bounding_box or parameter', () => {
      const params = {
        boundingBox: ['1,2,3,4', '5,6,7,8'],
        featureFacets: {},
        sortKey: ['start_date'],
        viewAllFacets: {}
      }

      expect(buildCollectionSearchParams(params)).toEqual(
        expect.objectContaining({
          boundingBox: ['1,2,3,4', '5,6,7,8'],
          options: {
            science_keywords_h: { or: true },
            temporal: { limit_to_granules: true },
            bounding_box: { or: true }
          }
        })
      )
    })
  })

  describe('with multiple circles', () => {
    test('adds the circle or parameter', () => {
      const params = {
        circle: ['1,2,3', '5,6,7'],
        featureFacets: {},
        sortKey: ['start_date'],
        viewAllFacets: {}
      }

      expect(buildCollectionSearchParams(params)).toEqual(
        expect.objectContaining({
          circle: ['1,2,3', '5,6,7'],
          options: {
            science_keywords_h: { or: true },
            temporal: { limit_to_granules: true },
            circle: { or: true }
          }
        })
      )
    })
  })

  describe('with multiple lines', () => {
    test('adds the line or parameter', () => {
      const params = {
        line: ['1,2,3,4', '5,6,7,8'],
        featureFacets: {},
        sortKey: ['start_date'],
        viewAllFacets: {}
      }

      expect(buildCollectionSearchParams(params)).toEqual(
        expect.objectContaining({
          line: ['1,2,3,4', '5,6,7,8'],
          options: {
            science_keywords_h: { or: true },
            temporal: { limit_to_granules: true },
            line: { or: true }
          }
        })
      )
    })
  })

  describe('with multiple points', () => {
    test('adds the point or parameter', () => {
      const params = {
        point: ['1,2', '3,4'],
        featureFacets: {},
        sortKey: ['start_date'],
        viewAllFacets: {}
      }

      expect(buildCollectionSearchParams(params)).toEqual(
        expect.objectContaining({
          point: ['1,2', '3,4'],
          options: {
            science_keywords_h: { or: true },
            temporal: { limit_to_granules: true },
            point: { or: true }
          }
        })
      )
    })
  })

  describe('with multiple polygons', () => {
    test('adds the polygon or parameter', () => {
      const params = {
        polygon: ['1,2,3,4', '5,6,7,8'],
        featureFacets: {},
        sortKey: ['start_date'],
        viewAllFacets: {}
      }

      expect(buildCollectionSearchParams(params)).toEqual(
        expect.objectContaining({
          polygon: ['1,2,3,4', '5,6,7,8'],
          options: {
            science_keywords_h: { or: true },
            temporal: { limit_to_granules: true },
            polygon: { or: true }
          }
        })
      )
    })
  })
})
