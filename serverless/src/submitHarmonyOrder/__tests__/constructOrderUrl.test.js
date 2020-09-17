import { constructOrderUrl } from '../constructOrderUrl'

describe('constructOrderUrl', () => {
  describe('when variables are selected', () => {
    test('url uses selected variable names in the url for variables', () => {
      const response = constructOrderUrl('C100000-EDSC', {
        selectedVariables: [
          'V100000-EDSC',
          'V100002-EDSC'
        ],
        url: 'https://harmony.earthdata.nasa.gov',
        variables: {
          'V100000-EDSC': {
            name: 'test_var',
            longName: 'Test Variable',
            conceptId: 'V100000-EDSC'
          },
          'V100001-EDSC': {
            name: 'test_var_1',
            longName: 'Test Variable 1',
            conceptId: 'V100001-EDSC'
          },
          'V100002-EDSC': {
            name: 'test_var_2',
            longName: 'Test Variable 2',
            conceptId: 'V100002-EDSC'
          }
        }
      })

      expect(response).toEqual('https://harmony.earthdata.nasa.gov/C100000-EDSC/ogc-api-coverages/1.0.0/collections/test_var%2Ctest_var_2/coverage/rangeset')
    })
  })

  describe('when no variables are selected', () => {
    test('url uses \'all\' in the url for variables', () => {
      const response = constructOrderUrl('C100000-EDSC', {
        url: 'https://harmony.earthdata.nasa.gov',
        variables: {
          'V100000-EDSC': {
            name: 'test_var',
            longName: 'Test Variable',
            conceptId: 'V100000-EDSC'
          },
          'V100001-EDSC': {
            name: 'test_var_1',
            longName: 'Test Variable 1',
            conceptId: 'V100001-EDSC'
          },
          'V100002-EDSC': {
            name: 'test_var_2',
            longName: 'Test Variable 2',
            conceptId: 'V100002-EDSC'
          }
        }
      })

      expect(response).toEqual('https://harmony.earthdata.nasa.gov/C100000-EDSC/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset')
    })
  })
})
