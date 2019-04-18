import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moment from 'moment'

import Alert from 'react-bootstrap/Alert'
import Dropdown from 'react-bootstrap/Dropdown'

import Datepicker from '../Datepicker'
import TemporalSelectionDropdown from '../TemporalSelectionDropdown'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    temporalSearch: {},
    onChangeQuery: jest.fn()
  }

  const enzymeWrapper = shallow(<TemporalSelectionDropdown {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalSelectionDropdown component', () => {
  test('on load should be closed on inital render', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(Dropdown).prop('show')).toBe(false)
  })

  test('when clicked toggles the state of show ', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(Dropdown.Toggle).simulate('click')
    expect(enzymeWrapper.find(Dropdown).prop('show')).toBe(true)
  })

  test('when passed a start date renders DatePicker component correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-30T00:00:00.000Z')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('')
  })

  test('when passed a end date renders DatePicker component correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        endDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-30T00:00:00.000Z')
  })

  test('when passed a both start and end dates renders DatePicker components correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-29T00:00:00.000Z')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-30T00:00:00.000Z')
  })

  test('when passed a start date after the end date renders DatePicker components correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        endDate: '2019-03-29T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-30T00:00:00.000Z')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-29T00:00:00.000Z')
  })

  test('when passed a start date after the end date disables the apply button', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        endDate: '2019-03-29T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find('.temporal-selection-dropdown__button--apply').prop('disabled')).toBe(true)
  })

  test('when passed a start date before the end date renders Alert correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Alert).at(0).prop('show')).toBe(false)
    expect(enzymeWrapper.find(Alert).at(1).prop('show')).toBe(false)
  })

  test('when passed a start date after the end date renders Alert correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporalSearch: {
        endDate: '2019-03-29T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Alert).at(0).prop('show')).toBe(true)
    expect(enzymeWrapper.find(Alert).at(1).prop('show')).toBe(false)
  })

  test('sets the start date correctly when an invalid date is passed', () => {
    const { enzymeWrapper } = setup()
    const testObj = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.find(Datepicker).at(0).props().onSubmit(testObj)
    expect(enzymeWrapper.state().temporal.startDate).toEqual('2012-01-efss 12:00:00')
  })

  test('sets the end date correctly when an invalid date is passed', () => {
    const { enzymeWrapper } = setup()
    const testObj = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.find(Datepicker).at(1).props().onSubmit(testObj)
    expect(enzymeWrapper.state().temporal.endDate).toEqual('2012-01-efss 12:00:00')
  })

  test('sets the start date correctly when an valid date is passed', () => {
    const { enzymeWrapper } = setup()
    const testObj = moment.utc('2012-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.find(Datepicker).at(0).props().onSubmit(testObj)
    expect(enzymeWrapper.state().temporal.startDate).toEqual('2012-01-01T12:00:00.000Z')
  })

  test('sets the end date correctly when an valid date is passed', () => {
    const { enzymeWrapper } = setup()
    const testObj = moment.utc('2012-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.find(Datepicker).at(1).props().onSubmit(testObj)
    expect(enzymeWrapper.state().temporal.endDate).toEqual('2012-01-01T12:00:00.000Z')
  })

  test('sets the state correctly with an invalid start date', () => {
    const { enzymeWrapper } = setup()
    const invalidDate = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)
    const validStartDate = moment.utc('2012-01-01 12:00:00').toISOString()
    const validEndDate = moment.utc('2012-01-02 12:00:00').toISOString()

    enzymeWrapper.setState({ temporal: { startDate: validStartDate, endDate: validEndDate } })
    enzymeWrapper.instance().setStartDate(invalidDate)
    expect(enzymeWrapper.state().temporal.startDate).toBe('2012-01-efss 12:00:00')
    expect(enzymeWrapper.state().temporal.endDate).toBe('2012-01-02T12:00:00.000Z')
  })

  test('sets the state correctly with an invalid end date', () => {
    const { enzymeWrapper } = setup()
    const invalidDate = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)
    const validStartDate = moment.utc('2012-01-01 12:00:00').toISOString()
    const validEndDate = moment.utc('2012-01-02 12:00:00').toISOString()

    enzymeWrapper.setState({ temporal: { startDate: validStartDate, endDate: validEndDate } })
    enzymeWrapper.instance().setEndDate(invalidDate)
    expect(enzymeWrapper.state().temporal.startDate).toBe('2012-01-01T12:00:00.000Z')
    expect(enzymeWrapper.state().temporal.endDate).toBe('2012-01-efss 12:00:00')
  })

  test('clears the values onClearClick', () => {
    const { enzymeWrapper } = setup()
    const onChangeQueryMock = jest.fn()
    enzymeWrapper.setProps({
      onChangeQuery: onChangeQueryMock,
      temporalSearch: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })
    enzymeWrapper.setState({ open: true })

    enzymeWrapper.instance().onClearClick()

    expect(onChangeQueryMock).toHaveBeenCalledWith({ temporal: '' })
    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.state()).toEqual({ open: false, temporal: { startDate: '', endDate: '' } })
  })

  test('applies the values onApplyClick', () => {
    const { enzymeWrapper } = setup()
    const onChangeQueryMock = jest.fn()
    enzymeWrapper.setProps({
      onChangeQuery: onChangeQueryMock,
      temporalSearch: {}
    })
    enzymeWrapper.setState({
      open: true,
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    enzymeWrapper.instance().onApplyClick()

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })
    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.state()).toEqual({
      open: false,
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })
  })
})
