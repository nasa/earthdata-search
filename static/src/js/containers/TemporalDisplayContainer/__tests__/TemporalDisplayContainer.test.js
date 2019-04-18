import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TemporalDisplay from '../../../components/TemporalDisplay/TemporalDisplay'
import { TemporalDisplayContainer } from '../TemporalDisplayContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    temporalSearch: ''
  }

  const enzymeWrapper = shallow(<TemporalDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalDisplayContainer component', () => {
  test('with start date should render the temporal info', () => {
    const { enzymeWrapper } = setup()
    const newStartDate = '2019-03-30T00:00:00Z'
    enzymeWrapper.setProps({ temporalSearch: newStartDate })

    expect(enzymeWrapper.find(TemporalDisplay).length).toEqual(1)

    expect(enzymeWrapper.find(TemporalDisplay).exists()).toBe(true)
  })

  test('with start date and end date should render the temporal info', () => {
    const { enzymeWrapper } = setup()
    const newStartDate = '2019-03-30T00:00:00Z,2019-05-30T00:00:00Z'
    enzymeWrapper.setProps({ temporalSearch: newStartDate })

    expect(enzymeWrapper.find(TemporalDisplay).length).toEqual(1)

    expect(enzymeWrapper.find(TemporalDisplay).exists()).toBe(true)
  })
})
