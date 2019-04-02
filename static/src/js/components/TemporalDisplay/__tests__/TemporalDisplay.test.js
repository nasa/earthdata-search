import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TemporalDisplay from '../TemporalDisplay'
import TemporalSelection from '../TemporalSelection'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    temporalSearch: ''
  }

  const enzymeWrapper = shallow(<TemporalDisplay {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('TemporalDisplay component', () => {
  test('with no props should render self without display', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('with only a start date should render the start date', () => {
    const { enzymeWrapper } = setup()
    const newPoint = '2019-03-30T00:00:00Z'
    enzymeWrapper.setProps({ temporalSearch: newPoint })

    const temporalDisplay = enzymeWrapper.find(TemporalSelection)
    expect(temporalDisplay.first().prop('type')).toEqual('start')
    expect(temporalDisplay.first().prop('value')).toEqual('2019-03-30T00:00:00Z')
  })

  test('with only a end date should render the end date', () => {
    const { enzymeWrapper } = setup()
    const newPoint = ',2019-05-30T00:00:00Z'
    enzymeWrapper.setProps({ temporalSearch: newPoint })

    const temporalDisplay = enzymeWrapper.find(TemporalSelection)
    expect(temporalDisplay.last().prop('type')).toEqual('end')
    expect(temporalDisplay.last().prop('value')).toEqual('2019-05-30T00:00:00Z')
  })

  test('with both start and end date should render the both start and end date', () => {
    const { enzymeWrapper } = setup()
    const newPoint = '2019-03-30T00:00:00Z,2019-05-30T00:00:00Z'
    enzymeWrapper.setProps({ temporalSearch: newPoint })

    const temporalDisplay = enzymeWrapper.find(TemporalSelection)
    expect(temporalDisplay.first().prop('type')).toEqual('start')
    expect(temporalDisplay.first().prop('value')).toEqual('2019-03-30T00:00:00Z')
    expect(temporalDisplay.last().prop('type')).toEqual('end')
    expect(temporalDisplay.last().prop('value')).toEqual('2019-05-30T00:00:00Z')
  })
})
