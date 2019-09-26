import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FilterStackItem from '../../FilterStack/FilterStackItem'
import FilterStackContents from '../../FilterStack/FilterStackContents'
import TemporalDisplay from '../TemporalDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onRemoveTimelineFilter: jest.fn(),
    temporalSearch: {}
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
    const { enzymeWrapper } = setup()
    const temporal = {
      startDate: '2019-03-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(2)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.value).toBe('2019-03-30T00:00:00Z')
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body')).toBe(null)
  })

  test('with only a end date should render the end date', () => {
    const { enzymeWrapper } = setup()
    const temporal = {
      endDate: '2019-05-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(2)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body')).toBe(null)
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.value).toBe('2019-05-30T00:00:00Z')
  })

  test('with both start and end date should render the both start and end date', () => {
    const { enzymeWrapper } = setup()
    const temporal = {
      endDate: '2019-05-30T00:00:00Z',
      startDate: '2019-03-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(2)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.value).toBe('2019-03-30T00:00:00Z')
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.value).toBe('2019-05-30T00:00:00Z')
  })

  test('with the same props should not rerender', () => {
    const { enzymeWrapper } = setup()
    const temporal = {
      endDate: '2019-05-30T00:00:00Z',
      startDate: '2019-03-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(2)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.value).toBe('2019-03-30T00:00:00Z')
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.value).toBe('2019-05-30T00:00:00Z')

    const secondTemporal = {
      endDate: '2019-05-30T00:00:00Z',
      startDate: '2019-03-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: secondTemporal })

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(2)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.value).toBe('2019-03-30T00:00:00Z')
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.value).toBe('2019-05-30T00:00:00Z')
  })

  test('with new props should rerender', () => {
    const { enzymeWrapper } = setup()
    const temporal = {
      endDate: '2019-05-30T00:00:00Z',
      startDate: '2019-03-30T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: temporal })

    const filterStackItem = enzymeWrapper.find(FilterStackItem)
    const filterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(filterStackItem.length).toBe(1)
    expect(filterStackContents.length).toBe(2)
    expect(filterStackContents.at(0).prop('title')).toBe('Start')
    expect(filterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(filterStackContents.at(0).prop('body').props.value).toBe('2019-03-30T00:00:00Z')
    expect(filterStackContents.at(1).prop('title')).toBe('Stop')
    expect(filterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(filterStackContents.at(1).prop('body').props.value).toBe('2019-05-30T00:00:00Z')

    const secondPoint = {
      endDate: '2019-05-29T00:00:00Z',
      startDate: '2019-03-29T00:00:00Z'
    }
    enzymeWrapper.setProps({ temporalSearch: secondPoint })

    const secondfilterStackItem = enzymeWrapper.find(FilterStackItem)
    const secondfilterStackContents = enzymeWrapper.find(FilterStackContents)

    expect(secondfilterStackItem.length).toBe(1)
    expect(secondfilterStackContents.length).toBe(2)
    expect(secondfilterStackContents.at(0).prop('title')).toBe('Start')
    expect(secondfilterStackContents.at(0).prop('body').props.type).toBe('start')
    expect(secondfilterStackContents.at(0).prop('body').props.value).toBe('2019-03-29T00:00:00Z')
    expect(secondfilterStackContents.at(1).prop('title')).toBe('Stop')
    expect(secondfilterStackContents.at(1).prop('body').props.type).toBe('end')
    expect(secondfilterStackContents.at(1).prop('body').props.value).toBe('2019-05-29T00:00:00Z')
  })
})
