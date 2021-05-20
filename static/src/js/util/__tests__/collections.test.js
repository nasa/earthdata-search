import { prepareCollectionParams } from '../collections'

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
