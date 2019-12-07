import * as Yup from 'yup'

export const advancedSearchFields = [
  {
    name: 'fieldOne',
    label: 'Text Field',
    placeholder: 'Text Field',
    description: 'This is the description for field 1',
    type: 'input',
    value: '',
    validation: Yup.string()
      .trim()
      .test('isOnlyText', 'Must be text only', val => !/\d/.test(val))
  },
  {
    name: 'fieldTwo',
    label: 'Number Field',
    placeholder: 'Number Field',
    description: 'This is the description for field 2',
    type: 'input',
    value: '',
    validation: Yup.number()
      .typeError('Must be a number')
  }
]

export default advancedSearchFields
