import React from 'react'

import {
  act, render, screen
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

  test('displays the details', () => {
    setup()
    expect(screen.getByText('test details')).toBeInTheDocument()
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
  })

  describe('fake input element', () => {
    test('does not display an icon', () => {
      setup()
      expect(screen.queryByTestId('edsc-icon')).toBeNull()
    })
  })

  describe('more info section', () => {
    test('does not display by default', () => {
      setup()
      expect(screen.getByText('More Info')).toBeInTheDocument()
    })

    test('displays when the more info button is clicked', async () => {
      const { onClick } = setup()
      const user = userEvent.setup()
      const moreInfoButton = screen.getByRole('button')
      await user.click(moreInfoButton)
      expect(screen.getByText('Less Info')).toBeInTheDocument()

      // Ensure outer `onClick` is not being called
      expect(onClick).toHaveBeenCalledTimes(0)
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

  describe('when a service name is provided', () => {
    test('does not display an icon', () => {
      setup({ serviceName: 'test service name' })
      // The icon does not render
      expect(screen.queryByTestId('edsc-icon')).toBeNull()
    })

    test('displays the service name', () => {
      const harmonyDetails = 'details: The service-name-is-passed-as-prop'
      setup({ serviceName: 'test service name', details: harmonyDetails })
      // The service name is passed in through the `details` prop
      const renderedServiceNames = screen.getAllByText(harmonyDetails)
      // renders in the `More-Info` section
      expect(renderedServiceNames[0].closest('div').className).toEqual('access-method-radio__more-info')
      expect(renderedServiceNames.length).toEqual(1)
    })
    describe('when the `subtitle` is `Harmony`', () => {
      test('service name appears on on customizable option primary title', () => {
        setup({ serviceName: 'test service name', subtitle: 'Harmony' })
        const renderedServiceNames = screen.getAllByText('test service name')
        // renders in the `access-method-content` section
        expect(renderedServiceNames[0].closest('div').className).toEqual('access-method-radio__header-secondary')
        expect(renderedServiceNames.length).toEqual(1)
      })

      test('Hovering over the service name opens a tooltip', async () => {
        const user = userEvent.setup()
        setup({ serviceName: 'test service name', subtitle: 'Harmony' })
        const renderedServiceName = screen.getByText('test service name')
        await act(async () => {
          await user.hover(renderedServiceName)
        })
        // Tooltip is being styled and rendered
        const tooltipMessage = screen.getByText('Service')
        expect(tooltipMessage.className).toEqual('tooltip__secondary-text')
      })
    })
    describe('when the `subtitle` is `OPeNDAP`', () => {
      test('service name appears on on customizable option primary title', () => {
        setup({ serviceName: 'test service name', subtitle: 'OPeNDAP' })
        const renderedServiceNames = screen.getAllByText('test service name')
        // renders in the `access-method-content` section
        expect(renderedServiceNames[0].closest('div').className).toEqual('access-method-radio__header-secondary')
        expect(renderedServiceNames.length).toEqual(1)
      })

      test('Hovering over the service name opens a tooltip', async () => {
        const user = userEvent.setup()
        setup({ serviceName: 'test service name', subtitle: 'OPeNDAP' })
        const renderedServiceName = screen.getByText('test service name')
        await act(async () => {
          await user.hover(renderedServiceName)
        })
        // Tooltip is being styled and rendered
        const tooltipMessage = screen.getByText('Service')
        expect(tooltipMessage.className).toEqual('tooltip__secondary-text')
      })
    })
  })
})
