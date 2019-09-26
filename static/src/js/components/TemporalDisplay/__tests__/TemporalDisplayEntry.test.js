import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TemporalDisplayEntry from '../TemporalDisplayEntry'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    type: 'start',
    value: '2019-03-30T00:00:00Z'
  }

  const enzymeWrapper = shallow(<TemporalDisplayEntry {...props} />).dive()

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalDisplayEntry component', () => {
  test('with valid type and value should render correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.text()).toEqual('2019-03-30 00:00:00')
  })
})
