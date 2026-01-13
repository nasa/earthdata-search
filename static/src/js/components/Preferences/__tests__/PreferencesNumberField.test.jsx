import { fireEvent, screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import PreferencesNumberField from '../PreferencesNumberField'

const setup = setupTest({
  Component: PreferencesNumberField,
  defaultProps: {
    schema: {
      description: 'Test Field Description'
    },
    name: 'testField',
    formData: 42,
    onChange: jest.fn()
  }
})

describe('PreferencesNumberField component', () => {
  test('renders a input form field', () => {
    setup()

    const input = screen.getByRole('spinbutton')

    expect(input.value).toEqual('42')
    expect(input.name).toEqual('testField')
  })

  describe('onChange', () => {
    test('onChange calls props onChange', async () => {
      const { props, user } = setup({
        overrideProps: {
          formData: ''
        }
      })

      const input = screen.getByRole('spinbutton')
      await user.type(input, '1')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(1)
    })

    test('returns an integer 0 when the input is "0"', async () => {
      const { props, user } = setup({
        overrideProps: {
          formData: ''
        }
      })

      const input = screen.getByRole('spinbutton')
      await user.type(input, '0')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(0)
    })

    test('returns a number 0.1 when the input is ".1"', () => {
      const { props } = setup({
        overrideProps: {
          formData: ''
        }
      })

      const input = screen.getByRole('spinbutton')
      // Use fireEvent instead of userEvent to simulate typing the '.' first
      fireEvent.change(input, { target: { value: '.1' } })

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(0.1)
    })

    test('returns a number -42 when the input is "-42"', async () => {
      const { props, user } = setup({
        overrideProps: {
          formData: ''
        }
      })

      const input = screen.getByRole('spinbutton')
      await user.type(input, '-4')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(-4)
    })
  })
})
