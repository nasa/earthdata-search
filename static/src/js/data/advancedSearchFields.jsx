import * as Yup from 'yup'

import { isNumber } from '../util/isNumber'

export const advancedSearchFields = [
  {
    name: 'regionSearch',
    type: 'regionSearch',
    label: 'Search by Feature',
    fields: [
      {
        name: 'endpoint',
        value: 'huc'
      },
      {
        name: 'keyword',
        validateFor: 'regionSearch',
        validation: Yup.mixed().test(
          'keyword',
          'Value is not a number',
          (value, context) => {
            const { parent } = context
            const { endpoint } = parent

            if (endpoint === 'huc') {
              return isNumber(value)
            }

            return true
          }
        ).test(
          'keyword',
          'Value is not a number',
          (value, context) => {
            const { parent } = context
            const { endpoint } = parent

            if (endpoint === 'rivers/reach') {
              return isNumber(value)
            }

            return true
          }
        )
          .required('A value is required')
      },
      {
        name: 'exact',
        value: false
      },
      {
        name: 'selectedRegion'
      }
    ]
  }
]

export default advancedSearchFields
