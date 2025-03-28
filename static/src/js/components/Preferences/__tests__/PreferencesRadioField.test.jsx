import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PreferencesRadioField from '../PreferencesRadioField'

const setup = (overrideProps) => {
  const user = userEvent.setup()
  render(<PreferencesRadioField {...overrideProps} />)

  return {
    user,
    overrideProps
  }
}

describe('PreferencesRadioField component', () => {
  test('renders a radio form field', () => {
    const props = {
      schema: {
        enum: ['option1', 'option2'],
        enumNames: ['Option 1', 'Option 2'],
        description: 'Test Field Description'
      },
      name: 'testField',
      formData: 'option1',
      onChange: jest.fn()
    }
    setup(props)
    const inputFields = screen.getAllByRole('radio')

    // Ensure the form elements are correct to accommodate the blueMarble change
    expect(inputFields.length).toBe(2)

    expect(inputFields[0].checked).toEqual(true)
    expect(inputFields[0].value).toEqual('option1')

    expect(inputFields[1].value).toEqual('option2')
    expect(inputFields[1].checked).toEqual(false)
  })

  test('onChange sets the state', async () => {
    const onChange = jest.fn()
    const props = {
      schema: {
        enum: ['option1', 'option2'],
        enumNames: ['Option 1', 'Option 2'],
        description: 'Test Field Description'
      },
      name: 'testField',
      formData: 'option1',
      onChange
    }
    const { user } = setup(props)

    const inputFields = screen.getAllByRole('radio')

    // Ensure the form elements are correct to accommodate the blueMarble change
    expect(inputFields.length).toBe(2)

    expect(inputFields[0].checked).toEqual(true)
    expect(inputFields[0].value).toEqual('option1')

    expect(inputFields[1].checked).toEqual(false)
    expect(inputFields[1].value).toEqual('option2')
    await user.click(inputFields[1])

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('option2')
  })
})

describe('ensure that blueMarble is correctly rendered', () => {
  test('when blueMarble is the user preference it renders as world imagery', () => {
    const props = {
      schema: {
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
        description: 'Test Field Description',
        title: 'Base Layer'
      },
      name: 'testField',
      formData: 'blueMarble',
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

  test('when worldImagery is the user preference it renders as world imagery', () => {
    const props = {
      schema: {
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
        description: 'Test Field Description',
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
