import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import moment from 'moment'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import FilterStackContents from '../../FilterStack/FilterStackContents'
import TemporalDisplay from '../TemporalDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const { temporalSearch = {} } = overrideProps || {}

  const props = {
    onRemoveTimelineFilter: jest.fn(),
    temporalSearch: {
      isRecurring: false,
      ...temporalSearch
    }
  }

  const enzymeWrapper = shallow(<TemporalDisplay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalDisplay component', () => {
  test('with no props should render self without display', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.html()).toBe(null)
  })

  test('with only a start date should render the start date', () => {
    const { enzymeWrapper } = setup({
      temporalSearch: {
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(3)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.startDate).toEqual(moment.utc('2019-03-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body')).toBe(null)
  })

  test('with only a end date should render the end date', () => {
    const { enzymeWrapper } = setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z'
      }
    })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(3)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body')).toBe(null)
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.endDate).toEqual(moment.utc('2019-05-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
  })

  test('with both start and end date should render the both start and end date', () => {
    const { enzymeWrapper } = setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(3)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.startDate).toEqual(moment.utc('2019-03-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.endDate).toEqual(moment.utc('2019-05-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
  })

  test('with the same props should not rerender', () => {
    const { enzymeWrapper } = setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(3)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.startDate).toEqual(moment.utc('2019-03-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.endDate).toEqual(moment.utc('2019-05-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

    enzymeWrapper.setProps({
      temporalSearch: {
        isRecurring: false,
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(3)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.startDate).toEqual(moment.utc('2019-03-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.endDate).toEqual(moment.utc('2019-05-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
  })

  test('with new props should rerender', () => {
    const { enzymeWrapper } = setup({
      temporalSearch: {
        endDate: '2019-05-30T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(3)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.startDate).toEqual(moment.utc('2019-03-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.endDate).toEqual(moment.utc('2019-05-30T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

    enzymeWrapper.setProps({
      temporalSearch: {
        isRecurring: false,
        endDate: '2019-05-29T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    const secondfilterStackItem = enzymeWrapper.find(FilterStackItem)
    const secondfilterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(secondfilterStackItem.length).toBe(1)
    expect(secondfilterStackContents.length).toBe(3)
    expect(secondfilterStackContents.at(0).prop('title')).toBe('Start')
    expect(secondfilterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(secondfilterStackContents.at(0).prop('body').props.startDate).toEqual(moment.utc('2019-03-29T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
    expect(secondfilterStackContents.at(1).prop('title')).toBe('Stop')
    expect(secondfilterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(secondfilterStackContents.at(1).prop('body').props.endDate).toEqual(moment.utc('2019-05-29T00:00:00.000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))
  })
})
