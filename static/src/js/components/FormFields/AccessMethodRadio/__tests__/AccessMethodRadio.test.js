import React from 'react'

import {
  render, screen
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

// Setup DOM elements before each test
// beforeEach(() => {
//   const { onChange, onClick } = setup()
// })

describe('AccessMethodRadio component', () => {
  // TODO I can som test these two with `querySelector`

  test.skip('renders as a label', () => {
    expect(screen.getByLabelText())
  })

  test('has a test id', () => {
    setup()
    expect(screen.getByTestId('test-id')).toBeInTheDocument()
  })

  // test('adds an htmlFor prop using the id', () => {
  //   expect(enzymeWrapper.props().htmlFor).toBe('test-id')
  // })

  // test('does not add the is-selected classname modifier', () => {
  //   expect(enzymeWrapper.props().className).not.toContain('access-method-radio--is-selected')
  // })

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
    // expect(enzymeWrapper.find('.access-method-radio__details').text()).toBe('test details')
  })

  test('does not display the service name section since this is not a `Harmony` service', () => {
    setup()
    expect(screen.queryAllByText('Service:').length).toBe(0)
    // expect(enzymeWrapper.find('.access-method-radio__service-name').length).toBe(0)
  })

  describe('input element', () => {
    test('has a name property', () => {
      // https://stackoverflow.com/questions/66633103/how-to-test-radio-button-in-react-testing-libraryuser-can-select-other-radio-bu
      // expect(enzymeWrapper.find('input').props().name).toBe('test-id')
      // There is a single radio button
      setup()
      expect(screen.getByRole('radio', { value: 'test value' })).toBeInTheDocument()
    })
    // TODO is false the same as empty string here
    test.skip('sets the checked property', () => {
      // expect(enzymeWrapper.find('input').props().checked).toBe('')
      setup()
      const radioButton = screen.getByRole('radio', { value: 'test value' })
      expect(radioButton.checked).toEqual('')
    })

    test('fires the onChange callback', async () => {
      // enzymeWrapper.find('input').simulate('change')
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
      expect()
      // expect(enzymeWrapper.find('.access-method-radio__radio-icon').length).toBe(0)
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
    // test('adds the is-selected classname modifier', () => {
    //   expect(enzymeWrapper.props().className).toContain('access-method-radio--is-selected')
    // })

    describe('input element', () => {
      test('sets the checked property', () => {
        setup({ checked: true })
        // expect(enzymeWrapper.find('input').props().checked).toBe('checked')
        const radioButton = screen.getByRole('radio', { value: 'test value' })
        // TODO why are these different values????
        // expect(radioButton.checked).toEqual('checked')
        expect(radioButton.checked).toEqual(true)
        expect(screen.getByTestId('edsc-icon')).toBeInTheDocument()
      })
    })
  })

  describe('when a service name is provided', () => {
    test('does not display an icon', () => {
      setup({ serviceName: 'test service name' })
      expect(screen.getByText('Service: test service name')).toBeInTheDocument()
      // The icon does not render
      expect(screen.queryByTestId('edsc-icon')).toBeNull()
    })
  })
})
