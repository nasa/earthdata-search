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
    onSubmit: jest.fn(),
    type: 'start',
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
    test('from "start" input, selects the beginning of the today', () => {
      const { enzymeWrapper } = setupShallow()
      enzymeWrapper.instance().onChange = jest.fn()
      const { onChange } = enzymeWrapper.instance()

      enzymeWrapper.setProps({ type: 'start' })

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
    })
  })

  describe('isValidDate', () => {
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
  })

  // test('when clicked toggles the state of show ', () => {
  //   const { enzymeWrapper } = setup()

  //   enzymeWrapper.find(Dropdown.Toggle).simulate('click')
  //   expect(enzymeWrapper.find(Dropdown).prop('show')).toBe(true)
  // })

  // test('when passed a start date renders DatePicker component correctly', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: '2019-03-30T00:00:00Z,' })

  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-30T00:00:00Z')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('')
  // })

  // test('when passed a end date renders DatePicker component correctly', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: ',2019-03-30T00:00:00Z' })

  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-30T00:00:00Z')
  // })

  // test('when passed a both start and end dates renders DatePicker components correctly', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: '2019-03-29T00:00:00Z,2019-03-30T00:00:00Z' })

  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-29T00:00:00Z')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-30T00:00:00Z')
  // })

  // test('when passed a start date after the end date renders DatePicker components correctly', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: '2019-03-30T00:00:00Z,2019-03-29T00:00:00Z' })

  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
  //   expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-30T00:00:00Z')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
  //   expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-29T00:00:00Z')
  // })

  // test('when passed a start date after the end date disables the apply button', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: '2019-03-30T00:00:00Z,2019-03-29T00:00:00Z' })

  //   expect(enzymeWrapper.find('.temporal-selection-dropdown__button--apply').prop('disabled')).toBe(true)
  // })

  // test('when passed a start date before the end date renders Alert correctly', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: '2019-03-29T00:00:00Z,2019-03-30T00:00:00Z' })

  //   expect(enzymeWrapper.find(Alert).at(0).prop('show')).toBe(false)
  // })

  // test('when passed a start date after the end date renders Alert correctly', () => {
  //   const { enzymeWrapper } = setup()
  //   enzymeWrapper.setProps({ temporalSearch: '2019-03-30T00:00:00Z,2019-03-29T00:00:00Z' })

  //   expect(enzymeWrapper.find(Alert).at(0).prop('show')).toBe(true)
  // })

  // test('sets the start date correctly when an invalid date is passed', () => {
  //   const { enzymeWrapper } = setup()
  //   const testObj = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

  //   enzymeWrapper.find(Datepicker).at(0).props().onSubmit(testObj)
  //   expect(enzymeWrapper.state().temporal.startDate).toEqual('')
  // })

  // test('sets the end date correctly when an invalid date is passed', () => {
  //   const { enzymeWrapper } = setup()
  //   const testObj = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

  //   enzymeWrapper.find(Datepicker).at(1).props().onSubmit(testObj)
  //   expect(enzymeWrapper.state().temporal.startDate).toEqual('')
  // })

  // test('sets the start date correctly when an valid date is passed', () => {
  //   const { enzymeWrapper } = setup()
  //   const testObj = moment.utc('2012-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

  //   enzymeWrapper.find(Datepicker).at(0).props().onSubmit(testObj)
  //   expect(enzymeWrapper.state().temporal.startDate).toEqual('2012-01-01T12:00:00.000Z')
  // })

  // test('sets the end date correctly when an valid date is passed', () => {
  //   const { enzymeWrapper } = setup()
  //   const testObj = moment.utc('2012-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

  //   enzymeWrapper.find(Datepicker).at(1).props().onSubmit(testObj)
  //   expect(enzymeWrapper.state().temporal.endDate).toEqual('2012-01-01T12:00:00.000Z')
  // })

  // test('sets the state correctly with an invalid start date', () => {
  //   const { enzymeWrapper } = setup()
  //   const invalidDate = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)
  //   const validStartDate = moment.utc('2012-01-01 12:00:00').toISOString()
  //   const validEndDate = moment.utc('2012-01-02 12:00:00').toISOString()

  //   enzymeWrapper.setState({ temporal: { startDate: validStartDate, endDate: validEndDate } })
  //   enzymeWrapper.instance().setStartDate(invalidDate)
  //   expect(enzymeWrapper.state().temporal.startDate).toBe('')
  //   expect(enzymeWrapper.state().temporal.endDate).toBe('2012-01-02T12:00:00.000Z')
  // })

  // test('sets the state correctly with an invalid end date', () => {
  //   const { enzymeWrapper } = setup()
  //   const invalidDate = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)
  //   const validStartDate = moment.utc('2012-01-01 12:00:00').toISOString()
  //   const validEndDate = moment.utc('2012-01-02 12:00:00').toISOString()

  //   enzymeWrapper.setState({ temporal: { startDate: validStartDate, endDate: validEndDate } })
  //   enzymeWrapper.instance().setEndDate(invalidDate)
  //   expect(enzymeWrapper.state().temporal.startDate).toBe('2012-01-01T12:00:00.000Z')
  //   expect(enzymeWrapper.state().temporal.endDate).toBe('')
  // })

  // test('clears the values onClearClick', () => {
  //   const { enzymeWrapper } = setup()
  //   const onChangeQueryMock = jest.fn()
  //   enzymeWrapper.setProps({
  //     onChangeQuery: onChangeQueryMock,
  //     temporalSearch: '2019-03-29T00:00:00Z,2019-03-30T00:00:00Z'
  //   })
  //   enzymeWrapper.setState({ open: true })

  //   enzymeWrapper.instance().onClearClick()

  //   expect(onChangeQueryMock).toHaveBeenCalledWith({ temporal: '' })
  //   expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  //   expect(enzymeWrapper.state()).toEqual({ open: false, temporal: { startDate: '', endDate: '' } })
  // })

  // test('applies the values onApplyClick', () => {
  //   const { enzymeWrapper } = setup()
  //   const onChangeQueryMock = jest.fn()
  //   enzymeWrapper.setProps({
  //     onChangeQuery: onChangeQueryMock,
  //     temporalSearch: ''
  //   })
  //   enzymeWrapper.setState({
  //     open: true,
  //     temporal: {
  //       endDate: '2019-03-30T00:00:00Z',
  //       startDate: '2019-03-29T00:00:00Z'
  //     }
  //   })

  //   enzymeWrapper.instance().onApplyClick()

  //   expect(onChangeQueryMock).toHaveBeenCalledWith({
  //     temporal: '2019-03-29T00:00:00Z,2019-03-30T00:00:00Z'
  //   })
  //   expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
  //   expect(enzymeWrapper.state()).toEqual({
  //     open: false,
  //     temporal: {
  //       endDate: '2019-03-30T00:00:00Z',
  //       startDate: '2019-03-29T00:00:00Z'
  //     }
  //   })
  // })
})
