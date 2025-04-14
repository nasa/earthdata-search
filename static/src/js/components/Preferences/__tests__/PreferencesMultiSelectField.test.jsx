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
        description: 'Test Field Description'
      }
    },
    uiSchema: {
      'ui:enumNames': ['Option 1', 'Option 2']
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

  test('onChange sets the state', async () => {
    const { user, onChange } = setup()
    const select = screen.getByRole('listbox')
    await user.selectOptions(select, 'option2')

    expect(onChange).toHaveBeenCalledTimes(1)
    // Adds the newly selected option to the existing formData
    expect(onChange).toHaveBeenCalledWith(['option1', 'option2'])
  })
})
