import * as Yup from 'yup'

export const advancedSearchFields = [
  {
    name: 'regionSearch',
    type: 'regionSearch',
    label: 'Search by region',
    fields: [
      {
        name: 'endpoint',
        value: 'huc'
      },
      {
        name: 'keyword',
        validation: Yup.mixed().when('endpoint', {
          is: 'huc',
          then: Yup.number()
            .typeError('A valid HUC is required')
            .required('A value is required'),
          otherwise: Yup.string('A valid HUC region is required')
            .required('Region is required')
        })
      },
      {
        name: 'exact',
        value: false
      }
    ]
  }
]

export default advancedSearchFields
