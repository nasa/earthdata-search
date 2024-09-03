import React from 'react'

import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import AccessMethodRadio from '../AccessMethodRadio'

const setup = (overrideProps) => {
  const onChange = jest.fn()
  const onClick = jest.fn()
  const props = {
    id: 'test-id',
    description: 'test description',
    details: 'test details',
    value: 'test value',
    checked: false,
    onChange,
    onClick,
    title: 'test title',
    subtitle: 'test subtitle',
    error: '',
    disabled: false,
    externalLink: null,
    ...overrideProps
  }

  render(<AccessMethodRadio {...props} />)

  return {
    onChange,
    onClick
  }
}

describe('AccessMethodRadio component', () => {
  test('renders as a label', () => {
    setup()
    const label = screen.getByTestId('test-id')
    expect(label.nodeName).toEqual('LABEL')
  })

  test('has a test id', () => {
    setup()
    expect(screen.getByTestId('test-id')).toBeInTheDocument()
  })

  test('adds an htmlFor prop using the id', () => {
    setup()
    const label = screen.getByTestId('test-id')
    expect(label.htmlFor).toEqual('test-id')
  })

  test('does not add the is-selected classname modifier', () => {
    setup()
    const label = screen.getByTestId('test-id')
    expect(label.className).not.toContain('access-method-radio--is-selected')
  })

  test('displays the title', () => {
    setup()
    expect(screen.getByText('test title')).toBeInTheDocument()
  })

  test('displays the subtitle', () => {
    setup()
    expect(screen.getByText('test subtitle')).toBeInTheDocument()
  })

  test('displays the description', () => {
    setup()
    expect(screen.getByText('test description')).toBeInTheDocument()
  })

  test('displays the error message', () => {
    setup({ errorMessage: 'Something went wrong' })
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  describe('tool-tip on the access method radio', () => {
    test('displays the details as a tooltip on hover', async () => {
      setup()
      const user = userEvent.setup()
      const icon = screen.getByTestId('edsc-icon-details')

      await user.hover(icon)

      const tooltip = await screen.findByRole('tooltip')

      expect(tooltip).toBeInTheDocument()
      expect(screen.getByText('test details')).toBeInTheDocument()
    })

    test('displays the details as a tooltip on click including external links', async () => {
      setup({
        externalLink: {
          link: 'http://example.com',
          message: 'example message'
        }
      })

      const user = userEvent.setup()
      const icon = screen.getByTestId('edsc-icon-details')

      await act(async () => {
        await user.click(icon)
      })

      const tooltip = await screen.findByRole('tooltip')

      expect(tooltip).toBeInTheDocument()
      expect(screen.getByText('test details')).toBeInTheDocument()

      const externalLink = screen.getByRole('link', { name: 'example message' })
      expect(externalLink.href).toEqual('http://example.com/')
      screen.debug()
    })
  })

  test('does not display the service name', () => {
    setup()
    expect(screen.queryAllByText('Service:').length).toBe(0)
  })

  describe('input element', () => {
    test('has a name property', () => {
      setup()
      const input = screen.getByRole('radio', { value: 'test value' })
      expect(input.name).toEqual('test-id')
    })

    test('sets the checked property', () => {
      setup()
      const radioButton = screen.getByRole('radio', { value: 'test value' })
      expect(radioButton.checked).toEqual(false)
    })

    test('fires the onChange callback', async () => {
      const { onChange } = setup()
      const user = userEvent.setup()
      const radioButton = screen.getByRole('radio', { value: 'test value' })
      await user.click(radioButton)
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    test('fires the onClick callback', async () => {
      const { onClick } = setup()
      const user = userEvent.setup()
      const radioButton = screen.getByRole('radio', { value: 'test value' })
      await user.click(radioButton)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('can be disabled', () => {
      setup({ disabled: true })
      const radioButton = screen.getByRole('radio', { value: 'test value' })

      expect(radioButton).toBeDisabled()
    })
  })

  describe('fake input element', () => {
    test('does not display an icon', () => {
      setup()
      expect(screen.queryByTestId('edsc-icon')).toBeNull()
    })
  })

  describe('when the access method is checked', () => {
    test('adds the is-selected classname modifier', () => {
      setup({ checked: true })
      const label = screen.getByTestId('test-id')
      expect(label.className).toContain('access-method-radio--is-selected')
    })

    describe('input element', () => {
      test('sets the checked property', () => {
        setup({ checked: true })
        const radioButton = screen.getByRole('radio', { value: 'test value' })
        expect(radioButton.checked).toEqual(true)
        expect(screen.getByTestId('edsc-icon')).toBeInTheDocument()
      })
    })
  })
})
