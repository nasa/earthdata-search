import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import moment from 'moment'

import Dropdown from 'react-bootstrap/Dropdown'

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

    enzymeWrapper.instance().onToggleClick()
    expect(enzymeWrapper.find(Dropdown).prop('show')).toBe(true)
  })

  test('sets the start date correctly when an valid date is passed', () => {
    const { enzymeWrapper } = setup()
    const testObj = moment.utc('2012-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.instance().setStartDate(testObj)
    expect(enzymeWrapper.state().temporal.startDate).toEqual('2012-01-01T12:00:00.000Z')
  })

  test('sets the end date correctly when an valid date is passed', () => {
    const { enzymeWrapper } = setup()
    const testObj = moment.utc('2012-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.instance().setEndDate(testObj)
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

    expect(onChangeQueryMock).toHaveBeenCalledWith({
      collection: {
        temporal: {}
      }
    })
    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.state()).toEqual({
      disabled: false,
      open: false,
      temporal: {
        startDate: '',
        endDate: '',
        recurringDayEnd: '',
        recurringDayStart: '',
        isRecurring: false
      }
    })
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
      collection: {
        temporal: {
          endDate: '2019-03-30T00:00:00.000Z',
          startDate: '2019-03-29T00:00:00.000Z'
        }
      }
    })
    expect(onChangeQueryMock).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.state()).toEqual({
      open: false,
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      },
      disabled: false
    })
  })
})
