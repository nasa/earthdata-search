import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import MockDate from 'mockdate'
import moment from 'moment'
import DatepickerContainer from '../DatepickerContainer'
import { getApplicationConfig } from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const { minimumTemporalDateString, temporalDateFormatFull } = getApplicationConfig()

  const props = {
    id: 'test-id',
    minDate: minimumTemporalDateString,
    maxDate: moment.utc().format(temporalDateFormatFull),
    onSubmit: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<DatepickerContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('DatepickerContainer component', () => {
  describe('onBlur', () => {
    test('sets the picker state', () => {
      const { enzymeWrapper } = setup()

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onBlur('1988-09-03 00:00:00')

      expect(enzymeWrapper.instance().picker.current.setState).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.instance().picker.current.setState)
        .toHaveBeenCalledWith({ currentView: 'years' })
    })
  })

  describe('onTodayClick', () => {
    test('without "start" or "end", returns null', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onBlur = jest.fn()
      enzymeWrapper.instance().onChange = jest.fn()
      enzymeWrapper.instance().onInputChange = jest.fn()
      const {
        onBlur,
        onChange,
        onInputChange
      } = enzymeWrapper.instance()
      const { onSubmit } = props

      enzymeWrapper.setProps({ type: null })

      // MockDate is used here to overwrite the js Date object. This allows us to
      // mock changes needed to test the moment functions
      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onBlur).toHaveBeenCalledTimes(0)
      expect(onChange).toHaveBeenCalledTimes(0)
      expect(onInputChange).toHaveBeenCalledTimes(0)

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0][0])
        .toEqual(null)

      MockDate.reset()
    })

    test('from "start" input, selects the beginning of the today', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onBlur = jest.fn()
      enzymeWrapper.instance().onChange = jest.fn()
      enzymeWrapper.instance().onInputChange = jest.fn()
      const {
        onBlur,
        onChange,
        onInputChange
      } = enzymeWrapper.instance()

      const { onSubmit } = props

      enzymeWrapper.setProps({ type: 'start' })

      // MockDate is used here to overwrite the js Date object. This allows us to
      // mock changes needed to test the moment functions
      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onBlur).toHaveBeenCalledTimes(0)
      expect(onChange).toHaveBeenCalledTimes(0)
      expect(onInputChange).toHaveBeenCalledTimes(0)

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0][0].toISOString())
        .toEqual('1988-09-03T00:00:00.000Z')

      MockDate.reset()
    })

    test('from "end" input, selects the beginning of the today', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      const { onSubmit } = props

      enzymeWrapper.instance().onBlur = jest.fn()
      const { onBlur } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: 'end' })

      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onBlur).toHaveBeenCalledTimes(0)
      expect(onSubmit).toHaveBeenCalledTimes(1)

      // This is because the date will become endOf('day') on Blur
      expect(onSubmit.mock.calls[0][0].toISOString())
        .toEqual('1988-09-03T23:59:59.999Z')

      MockDate.reset()
    })
  })

  describe('onClearClick', () => {
    test('triggers the onChange function with an empty string', () => {
      const { enzymeWrapper, props } = setup()
      const { onSubmit } = props

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onChange = jest.fn()
      const { onClearClick, onChange } = enzymeWrapper.instance()

      onClearClick()

      expect(onChange).toHaveBeenCalledTimes(0)

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0][0])
        .toEqual(null)
    })
  })

  describe('onChange', () => {
    test('when given an empty string, passes an invalid moment object', () => {
      const { enzymeWrapper, props } = setup()
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
      const { enzymeWrapper, props } = setup()
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
      const { enzymeWrapper, props } = setup()
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
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.instance().picker.current = {}
        enzymeWrapper.instance().picker.current.setState = jest.fn()

        const { onBlur } = enzymeWrapper.instance()
        const { onSubmit } = props
        enzymeWrapper.setProps({ type: 'start' })

        onBlur(moment.utc('1988-09-03'))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(moment.isMoment(onSubmit.mock.calls[0][0]))
          .toEqual(true)

        expect(onSubmit.mock.calls[0][0].toISOString())
          .toEqual('1988-09-03T00:00:00.000Z')
      })

      test('the "end" input passes the correct object', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.instance().picker.current = {}
        enzymeWrapper.instance().picker.current.setState = jest.fn()

        const { onBlur } = enzymeWrapper.instance()
        const { onSubmit } = props
        enzymeWrapper.setProps({ type: 'end' })

        onBlur(moment.utc('1988-09-03'))

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(moment.isMoment(onSubmit.mock.calls[0][0]))
          .toEqual(true)

        expect(onSubmit.mock.calls[0][0].toISOString())
          .toEqual('1988-09-03T23:59:59.999Z')
      })

      test('without when "start" and "end" defined, null is passed', () => {
        const { enzymeWrapper, props } = setup()
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
      const { enzymeWrapper } = setup()
      const { isValidDate } = enzymeWrapper.instance()

      const value = isValidDate(moment.utc('1959-12-30'))

      expect(value).toEqual(false)
    })

    test('when passed a date in the future, returns false', () => {
      const { enzymeWrapper } = setup()
      const { isValidDate } = enzymeWrapper.instance()

      const value = isValidDate(moment.utc(moment.utc().add(1, 'day')))

      expect(value).toEqual(false)
    })

    test('when passed a date one day in the past, returns true', () => {
      const { enzymeWrapper } = setup()
      const { isValidDate } = enzymeWrapper.instance()

      const value = isValidDate(moment.utc(moment.utc().add(-1, 'day')))

      expect(value).toEqual(true)
    })
  })
})
