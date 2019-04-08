import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SpatialDisplayEntry from '../SpatialDisplayEntry'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    type: 'start',
    value: '38.79165, -77.11976'
  }

  const enzymeWrapper = shallow(<SpatialDisplayEntry {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialDisplayEntry component', () => {
  test('with valid type and value should render correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.text()).toEqual('38.79165, -77.11976')
  })
})
