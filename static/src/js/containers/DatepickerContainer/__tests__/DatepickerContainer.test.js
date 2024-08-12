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
  describe('onInputBlur', () => {
    test('sets the picker state', () => {
      const { enzymeWrapper } = setup()

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur({ target: { value: moment.utc('1988-09-03') } })

      expect(enzymeWrapper.instance().picker.current.setState).toHaveBeenCalledTimes(0)
    })

    describe('when type is start', () => {
      test('returns date as entered', () => {
        const { enzymeWrapper, props } = setup({ type: 'start' })
        const { onSubmit, format } = props

        // Because this is a shallow render the Datepicker component doesn't render so we have
        // to manually create a 'current' instance of the component
        enzymeWrapper.instance().picker.current = {}
        enzymeWrapper.instance().picker.current.setState = jest.fn()

        enzymeWrapper.instance().onInputBlur({ target: { value: moment.utc('1990-09-03 00:00:00') } })

        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(onSubmit).toHaveBeenCalledWith(moment.utc('1990-09-03 00:00:00', format))
      })
    })

    test('returns unchanged datetime when date is not a \'startOf\' day', () => {
      const { enzymeWrapper, props } = setup({ type: 'start' })
      const { onSubmit, format } = props

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur({ target: { value: moment.utc('1990-09-03 00:40:00') } })

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(moment.utc('1990-09-03 00:40:00', format))
    })
  })

  describe('when type is end', () => {
    test('returns date as entered', () => {
      const { enzymeWrapper, props } = setup({ type: 'end' })
      const { onSubmit, format } = props

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      // enzymeWrapper.instance().picker.current = {}
      // enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur({ target: { value: moment.utc('1990-09-03 00:00:00') } })

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(moment.utc('1990-09-03 00:00:00', format).endOf('day'))
    })

    test('returns autocompleted YYYY', () => {
      const { enzymeWrapper, props } = setup({ type: 'end' })
      const { onSubmit, format } = props

      const onChangeSpy = jest.spyOn(enzymeWrapper.instance(), 'onChange')

      enzymeWrapper.instance().onInputBlur({ target: { value: '1990' } })

      expect(onChangeSpy).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledTimes(1)
      // Had trouble matching the actual input that was being passed to the function
      expect(onSubmit.mock.calls[0][0].format(format)).toEqual('1990-12-31T23:59:59Z')
    })

    test('returns autocompleted YYYY-MM', () => {
      const { enzymeWrapper, props } = setup({ type: 'end' })
      const { onSubmit, format } = props

      const { onInputBlur } = enzymeWrapper.instance()

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      const onChangeSpy = jest.spyOn(enzymeWrapper.instance(), 'onChange')

      onInputBlur({ target: { value: '1990-06' } })

      expect(onChangeSpy).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledTimes(1)
      // Had trouble matching the actual input that was being passed to the function
      expect(onSubmit.mock.calls[0][0].format(format)).toEqual('1990-06-30T23:59:59Z')
    })

    test('returns date as entered', () => {
      const { enzymeWrapper, props } = setup({ type: 'end' })
      const { onSubmit, format } = props

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur({ target: { value: moment.utc('1990-09-03 00:00:00') } })

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(moment.utc('1990-09-03 00:00:00', format).endOf('day'))
    })

    test('returns unchanged datetime when date is not a \'startOf\' day', () => {
      const { enzymeWrapper, props } = setup({ type: 'start' })
      const { onSubmit, format } = props

      // Because this is a shallow render the Datepicker component doesn't render so we have
      // to manually create a 'current' instance of the component
      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur({ target: { value: moment.utc('1990-09-03 00:40:00') } })

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(moment.utc('1990-09-03 00:40:00', format))
    })
  })

  describe('onTodayClick', () => {
    test('without "start" or "end", returns null', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur = jest.fn()
      enzymeWrapper.instance().onChange = jest.fn()
      enzymeWrapper.instance().onInputChange = jest.fn()
      const {
        onInputBlur,
        onChange
      } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: null })

      // MockDate is used here to overwrite the js Date object. This allows us to
      // mock changes needed to test the moment functions
      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onInputBlur).toHaveBeenCalledTimes(0)
      expect(onChange).toHaveBeenCalledTimes(1)

      expect(onChange).toHaveBeenCalledWith(null)

      MockDate.reset()
    })

    test('from "start" input, selects the beginning of the today', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur = jest.fn()
      enzymeWrapper.instance().onChange = jest.fn()

      const {
        onInputBlur,
        onChange
      } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: 'start' })

      // MockDate is used here to overwrite the js Date object. This allows us to
      // mock changes needed to test the moment functions
      MockDate.set('09/03/1988')

      enzymeWrapper.instance().onTodayClick()

      expect(onInputBlur).toHaveBeenCalledTimes(0)
      expect(onChange).toHaveBeenCalledTimes(1)

      expect(onChange).toHaveBeenCalledWith('1988-09-03 00:00:00')

      MockDate.reset()
    })

    test('from "end" input, selects the beginning of the today', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onInputBlur = jest.fn()
      enzymeWrapper.instance().onChange = jest.fn()
      const { onChange, onTodayClick } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: 'end' })

      MockDate.set('09/03/1988')

      onTodayClick()

      expect(onChange).toHaveBeenCalledTimes(1)

      // This is because the date will become endOf('day') on Blur
      expect(onChange).toHaveBeenCalledWith('1988-09-03 23:59:59')

      MockDate.reset()
    })
  })

  describe('onClearClick', () => {
    test('triggers the onChange function with an empty string', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().picker.current = {}
      enzymeWrapper.instance().picker.current.setState = jest.fn()

      enzymeWrapper.instance().onChange = jest.fn()
      const { onClearClick, onChange } = enzymeWrapper.instance()

      onClearClick()

      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenCalledWith('')
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
        const { enzymeWrapper, props } = setup()
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
