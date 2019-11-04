import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MockDate from 'mockdate'
import moment from 'moment'

import Datetime from 'react-datetime'

import Datepicker from '../Datepicker'

Enzyme.configure({ adapter: new Adapter() })

function setupMounted() {
  const props = {
    id: 'test-id',
    onSubmit: jest.fn(),
    type: 'start',
    value: ''
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
    onSubmit: jest.fn(),
    type: 'start',
    minDate: '1960-01-01 00:00:00',
    maxDate: '1984-07-02T16:00:00',
    value: ''
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
      expect(dateTime.prop('value')).toEqual('1988-09-03 00:00:00')
    })
  })

  test('renders a single Datetime component', () => {
    const { enzymeWrapper } = setupShallow()
    expect(enzymeWrapper.find(Datetime).length).toEqual(1)
  })

  describe('onBlur', () => {
    test('sets the picker state', () => {
      const { enzymeWrapper } = setupMounted()
      enzymeWrapper.instance().picker = jest.fn()
      enzymeWrapper.instance().picker.setState = jest.fn()

      enzymeWrapper.instance().onBlur()

      expect(enzymeWrapper.instance().picker.setState).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.instance().picker.setState)
        .toHaveBeenCalledWith({ currentView: 'years' })
    })
  })

  describe('onTodayClick', () => {
    test('without "start" or "end", returns null', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.instance().onChange = jest.fn()
      const { onChange } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: null })

      // MockDate is used here to overwrite the js Date object. This allows us to
      // mock changes needed to test the moment functions
      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0][0])
        .toEqual(null)

      MockDate.reset()
    })

    test('from "start" input, selects the beginning of the today', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.instance().onChange = jest.fn()
      const { onChange } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: 'start' })

      // MockDate is used here to overwrite the js Date object. This allows us to
      // mock changes needed to test the moment functions
      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0][0].toISOString())
        .toEqual('1988-09-03T00:00:00.000Z')

      MockDate.reset()
    })

    test('from "end" input, selects the beginning of the today', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.instance().onChange = jest.fn()
      const { onChange } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: 'end' })

      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0][0].toISOString())
        .toEqual('1988-09-03T23:59:59.999Z')

      MockDate.reset()
    })
  })

  describe('onClearClick', () => {
    test('triggers the onChange function with an empty string', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.instance().onChange = jest.fn()
      const { onClearClick, onChange } = enzymeWrapper.instance()

      onClearClick()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith('')
    })
  })

  describe('onChange', () => {
    test('when given an empty string, passes an invalid moment object', () => {
      const { enzymeWrapper, props } = setupShallow()
      const { onChange } = enzymeWrapper.instance()
      const { onSubmit } = props

      onChange('')

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(moment.isMoment(onSubmit.mock.calls[0][0]))
        .toEqual(true)
      expect(onSubmit.mock.calls[0][0].isValid())
        .toEqual(false)
    })

    test('when given an invalid date, passes an invalid moment object', () => {
      const { enzymeWrapper, props } = setupShallow()
      const { onChange } = enzymeWrapper.instance()
      const { onSubmit } = props

      onChange('1988-09-0e 09:00:00')

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(moment.isMoment(onSubmit.mock.calls[0][0]))
        .toEqual(true)
      expect(onSubmit.mock.calls[0][0].isValid())
        .toEqual(false)
    })

    test('when given an custom time, passes a valid moment object with that time', () => {
      const { enzymeWrapper, props } = setupShallow()
      const { onChange } = enzymeWrapper.instance()
      const { onSubmit } = props

      onChange('1988-09-03 09:00:00')

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(moment.isMoment(onSubmit.mock.calls[0][0]))
        .toEqual(true)
      expect(onSubmit.mock.calls[0][0].toISOString())
        .toEqual('1988-09-03T09:00:00.000Z')
    })

    describe('when not given an custom time', () => {
      test('the "start" input passes the correct object', () => {
        const { enzymeWrapper, props } = setupShallow()
        const { onChange } = enzymeWrapper.instance()
        const { onSubmit } = props
        enzymeWrapper.setProps({ type: 'start' })

        onChange(moment.utc('1988-09-03'))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(moment.isMoment(onSubmit.mock.calls[0][0]))
          .toEqual(true)
        expect(onSubmit.mock.calls[0][0].toISOString())
          .toEqual('1988-09-03T00:00:00.000Z')
      })

      test('the "end" input passes the correct object', () => {
        const { enzymeWrapper, props } = setupShallow()
        const { onChange } = enzymeWrapper.instance()
        const { onSubmit } = props
        enzymeWrapper.setProps({ type: 'end' })

        onChange(moment.utc('1988-09-03'))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(moment.isMoment(onSubmit.mock.calls[0][0]))
          .toEqual(true)
        expect(onSubmit.mock.calls[0][0].toISOString())
          .toEqual('1988-09-03T23:59:59.999Z')
      })

      test('without when "start" and "end" defined, null is passed', () => {
        const { enzymeWrapper, props } = setupShallow()
        const { onChange } = enzymeWrapper.instance()
        const { onSubmit } = props
        enzymeWrapper.setProps({ type: null })

        onChange(moment.utc('1988-09-03'))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit.mock.calls[0][0])
          .toEqual(null)
      })
    })
  })

  describe('isValidDate', () => {
    beforeEach(() => {
      MockDate.set('07/02/1984')
    })

    afterEach(() => {
      MockDate.reset()
    })

    test('when passed a date thats too early, returns false', () => {
      const { enzymeWrapper } = setupShallow()
      const { isValidDate } = enzymeWrapper.instance()

      const value = isValidDate(moment.utc('1959-12-30'))

      expect(value).toEqual(false)
    })

    test('when passed a date in the future, returns false', () => {
      const { enzymeWrapper } = setupShallow()
      const { isValidDate } = enzymeWrapper.instance()

      const value = isValidDate(moment.utc(moment.utc().add(1, 'day')))

      expect(value).toEqual(false)
    })

    test('when passed a date one day in the past, returns true', () => {
      const { enzymeWrapper } = setupShallow()
      const { isValidDate } = enzymeWrapper.instance()

      const value = isValidDate(moment.utc(moment.utc().add(-1, 'day')))

      expect(value).toEqual(true)
    })
  })
})
