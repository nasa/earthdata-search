import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import AccessMethodRadio from '../AccessMethodRadio'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    id: 'test-id',
    description: 'test description',
    details: 'test details',
    value: 'test value',
    checked: false,
    onChange: jest.fn(),
    onClick: jest.fn(),
    title: 'test title',
    subtitle: 'test subtitle',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AccessMethodRadio {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AccessMethodRadio component', () => {
  const { enzymeWrapper, props } = setup()

  test('renders as a label', () => {
    expect(enzymeWrapper.type()).toBe('label')
  })

  test('has a test id', () => {
    expect(enzymeWrapper.props()['data-testid']).toBe('test-id')
  })

  test('adds an htmlFor prop using the id', () => {
    expect(enzymeWrapper.props().htmlFor).toBe('test-id')
  })

  test('does not add the is-selected classname modifier', () => {
    expect(enzymeWrapper.props().className).not.toContain('access-method-radio--is-selected')
  })

  test('displays the title', () => {
    expect(enzymeWrapper.find('.access-method-radio__title').text()).toBe('test title')
  })

  test('displays the subtitle', () => {
    expect(enzymeWrapper.find('.access-method-radio__subtitle').text()).toBe('test subtitle')
  })

  test('displays the description', () => {
    expect(enzymeWrapper.find('.access-method-radio__description').text()).toBe('test description')
  })

  test('displays the details', () => {
    expect(enzymeWrapper.find('.access-method-radio__details').text()).toBe('test details')
  })

  test('does not display the service name section', () => {
    expect(enzymeWrapper.find('.access-method-radio__service-name').length).toBe(0)
  })

  describe('input element', () => {
    test('has a name property', () => {
      expect(enzymeWrapper.find('input').props().name).toBe('test-id')
    })

    test('has a value property', () => {
      expect(enzymeWrapper.find('input').props().value).toBe('test value')
    })

    test('sets the checked property', () => {
      expect(enzymeWrapper.find('input').props().checked).toBe('')
    })

    test('fires the onChange callback', () => {
      enzymeWrapper.find('input').simulate('change')

      const { onChange } = props

      expect(onChange).toHaveBeenCalledTimes(1)
    })

    test('fires the onClick callback', () => {
      enzymeWrapper.find('input').simulate('click')

      const { onClick } = props

      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('fake input element', () => {
    test('does not display an icon', () => {
      expect(enzymeWrapper.find('.access-method-radio__radio-icon').length).toBe(0)
    })
  })

  describe('more info section', () => {
    test('does not display by default', () => {
      expect(enzymeWrapper.find('CSSTransition').props().in).toBe(false)
    })

    test('displays when the more info button is clicked', () => {
      const stopPropagationMock = jest.fn()

      enzymeWrapper.find('button').simulate('click', {
        stopPropagation: stopPropagationMock
      })

      expect(enzymeWrapper.find('CSSTransition').props().in).toBe(true)
      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the access method is checked', () => {
    const { enzymeWrapper } = setup({
      checked: true
    })

    test('adds the is-selected classname modifier', () => {
      expect(enzymeWrapper.props().className).toContain('access-method-radio--is-selected')
    })

    describe('input element', () => {
      test('sets the checked property', () => {
        expect(enzymeWrapper.find('input').props().checked).toBe('checked')
      })
    })

    describe('fake input element', () => {
      test('displays an icon', () => {
        expect(enzymeWrapper.find('.access-method-radio__radio-icon').length).toBe(1)
      })
    })
  })

  describe('when a service name is provided', () => {
    const { enzymeWrapper } = setup({
      serviceName: 'test service name'
    })

    test('does not display an icon', () => {
      expect(enzymeWrapper.find('.access-method-radio__service-name').text()).toBe('Service: test service name')
    })
  })
})
