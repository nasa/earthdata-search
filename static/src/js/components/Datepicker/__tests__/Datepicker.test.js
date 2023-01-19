import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import Datetime from 'react-datetime'

import Datepicker from '../Datepicker'

Enzyme.configure({ adapter: new Adapter() })

function setupMounted() {
  const props = {
    id: 'test-id',
    isValidDate: jest.fn(),
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onClearClick: jest.fn(),
    onTodayClick: jest.fn(),
    picker: React.createRef(),
    type: 'start',
    value: '',
    viewMode: 'years'
  }

  const enzymeWrapper = mount(<Datepicker {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

function setupShallow() {
  const props = {
    id: 'test-id',
    format: '',
    isValidDate: jest.fn(),
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onClearClick: jest.fn(),
    onTodayClick: jest.fn(),
    picker: React.createRef(),
    value: '',
    viewMode: 'years'
  }

  const enzymeWrapper = shallow(<Datepicker {...props} />, { disableLifecycleMethods: true })

  return {
    enzymeWrapper,
    props
  }
}

describe('Datepicker component', () => {
  describe('on render', () => {
    test('creates the custom buttons', () => {
      const { enzymeWrapper } = setupMounted()
      const buttonContainer = enzymeWrapper.getDOMNode().querySelectorAll('.datetime__buttons')
      const buttons = buttonContainer[0].querySelectorAll('.datetime__button')
      const buttonToday = buttonContainer[0].querySelectorAll('.datetime__button--today')
      const buttonClear = buttonContainer[0].querySelectorAll('.datetime__button--clear')

      expect(buttonContainer.length).toEqual(1)
      expect(buttons.length).toEqual(2)
      expect(buttonToday.length).toEqual(1)
      expect(buttonClear.length).toEqual(1)
    })

    test('handles non-ISO dates correctly', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.setProps({ value: '1988-09-0e 00:00:00' })

      const dateTime = enzymeWrapper.find(Datetime)
      expect(dateTime.prop('value')).toEqual('1988-09-0e 00:00:00')
    })

    test('handles ISO dates correctly', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.setProps({ value: '1988-09-03T00:00:00.000Z' })

      const dateTime = enzymeWrapper.find(Datetime)
      expect(dateTime.prop('value')).toEqual('1988-09-03T00:00:00.000Z')
    })
  })

  test('renders a single Datetime component', () => {
    const { enzymeWrapper } = setupShallow()
    expect(enzymeWrapper.find(Datetime).length).toEqual(1)
  })
})
