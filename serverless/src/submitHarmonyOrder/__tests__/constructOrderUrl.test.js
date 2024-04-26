import { constructOrderUrl } from '../constructOrderUrl'

describe('constructOrderUrl', () => {
  describe('when variables are selected', () => {
    test('url uses selected variable names in the url for variables', () => {
      const response = constructOrderUrl('C100000-EDSC', {
        selectedVariableNames: [
          'test_var', 'test_var_2'
        ],
        url: 'https://harmony.earthdata.nasa.gov'
      })

      expect(response).toEqual('https://harmony.earthdata.nasa.gov/C100000-EDSC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset')
    })
  })

  describe('when no variables are selected', () => {
    test('url uses \'all\' in the url for variables', () => {
      const response = constructOrderUrl('C100000-EDSC', {
        url: 'https://harmony.earthdata.nasa.gov'
      })

      expect(response).toEqual('https://harmony.earthdata.nasa.gov/C100000-EDSC/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset')
    })
  })
})
