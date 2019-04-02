import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TemporalSelection from '../TemporalSelection'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    type: 'start',
    value: '2019-03-30T00:00:00Z'
  }

  const enzymeWrapper = shallow(<TemporalSelection {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('TemporalSelection component', () => {
  test('with valid type and value should render correctly', () => {
    const { enzymeWrapper } = setup()
    // const newPoint = '2019-03-30T00:00:00Z'
    // enzymeWrapper.setProps({ type: 'start', value: newPoint })

    expect(enzymeWrapper.text()).toEqual('Start: 2019-03-30T00:00:00Z')
  })
})
