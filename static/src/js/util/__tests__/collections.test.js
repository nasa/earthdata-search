import { buildCollectionSearchParams, prepareCollectionParams } from '../collections'

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
            'opendap',
            'harmony'
          ]
        })
      )
    })
  })
})

describe('#buildCollectionParams', () => {
  describe('when the keyword does not have a quoted string', () => {
    test('the wildcard character is added between words', () => {
      const params = buildCollectionSearchParams({
        featureFacets: {},
        keyword: 'modis terra',
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        keyword: 'modis* terra*'
      }))
    })
  })

  describe('when the keyword has a quoted string', () => {
    test('the wildcard character is not added between words', () => {
      const params = buildCollectionSearchParams({
        featureFacets: {},
        keyword: '"modis" terra',
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        keyword: '"modis" terra'
      }))
    })
  })
})
