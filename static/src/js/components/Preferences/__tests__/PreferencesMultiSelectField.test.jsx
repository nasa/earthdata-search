import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PreferencesMultiSelectField from '../PreferencesMultiSelectField'

const setup = (overrideProps) => {
  const onChange = jest.fn()
  const user = userEvent.setup()
  const props = {
    schema: {
      items: {
        enum: ['option1', 'option2'],
        enumNames: ['Option 1', 'Option 2'],
        description: 'Test Field Description'
      }
    },
    name: 'testField',
    formData: ['option1'],
    onChange,
    ...overrideProps
  }
  render(<PreferencesMultiSelectField {...props} />)

  return {
    user,
    onChange
  }
}

describe('PreferencesMultiSelectField component', () => {
  test('renders a radio form field', () => {
    setup()

    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument()
    expect(screen.getByText('Test Field')).toBeVisible()
  })

  // TODO put this test back in
  test('onChange sets the state', async () => {
    const { user, onChange } = setup()
    const select = screen.getByRole('listbox')
    await user.selectOptions(select, 'option2')

    expect(onChange).toHaveBeenCalledTimes(1)
    // TODO fix this assertion as it does not make sense that this passes
    expect(onChange).toHaveBeenCalledWith(['option1', 'option2'])
  })
})

describe('ensure that referenceLabels and referenceFeatures are correctly rendered', () => {
  test('when blueMarble is the user preference it renders as world imagery', () => {
    const props = {
      schema: {
        items: {
          enum: [
            'bordersRoads',
            'coastlines',
            'placeLabels',
            'referenceFeatures',
            'referenceLabels'
          ],
          enumNames: [
            'Borders and Roads',
            'Coastlines',
            'Place Labels'
          ]
        },
        title: 'Overlay Layers'
      },
      name: 'testField',
      formData: ['bordersRoads', 'coastlines', 'placeLabels'],
      onChange: jest.fn()
    }

    setup(props)

    const inputFields = screen.getAllByRole('option')
    console.log('🚀 ~ file: PreferencesMultiSelectField.test.jsx:83 ~ inputFields:', inputFields)

    // Ensure the form elements are correct to accommodate the blueMarble change
    expect(inputFields.length).toBe(3)
  })

  test.skip('when worldImagery is the user preference it renders as world imagery', () => {
    const props = {
      schema: {
        items: {
          enum: [
            'worldImagery',
            'trueColor',
            'landWaterMap',
            'blueMarble'
          ],
          enumNames: [
            'World Imagery',
            'Corrected Reflectance (True Color)',
            'Land / Water Map'
          ],
          description: 'Test Field Description'
        },
        title: 'Base Layer'
      },
      name: 'testField',
      // Form data is set to `worldImagery `
      formData: 'worldImagery',
      onChange: jest.fn()
    }

    setup(props)

    const inputFields = screen.getAllByRole('radio')

    // Ensure the form elements are correct to accommodate the blueMarble change
    expect(inputFields.length).toBe(3)

    expect(inputFields[0].checked).toEqual(true)
    expect(inputFields[0].value).toEqual('worldImagery')

    expect(inputFields[2].value).toEqual('landWaterMap')
    expect(inputFields[2].checked).toEqual(false)
  })
})
