import { screen } from '@testing-library/react'

import setupTest from '../../../../../../../jestConfigs/setupTest'

import TextField from '../TextField'

const setup = setupTest({
  Component: TextField,
  defaultProps: {
    name: 'testName',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    value: 'Test value'
  }
})

describe('TextField component', () => {
  test('should render self', () => {
    setup()

    expect(screen.getByRole('textbox').name).toEqual('testName')
    expect(screen.getByRole('textbox').value).toEqual('Test value')
  })

  test('should call onChange if value changes', async () => {
    const { props, user } = setup({
      overrideProps: {
        value: ''
      }
    })
    const input = screen.getByRole('textbox')

    await user.type(input, 'n')

    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.onChange).toHaveBeenCalledWith('testName', 'n')
  })

  test('should call onBlur if the input is blurred', async () => {
    const { props, user } = setup()
    const input = screen.getByRole('textbox')

    await user.click(input)
    await user.tab()

    expect(props.onBlur).toHaveBeenCalledTimes(1)
    expect(props.onBlur).toHaveBeenCalledWith(expect.objectContaining({
      type: 'blur'
    }))
  })
})
