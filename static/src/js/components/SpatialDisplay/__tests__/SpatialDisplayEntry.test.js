import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import SpatialDisplayEntry from '../SpatialDisplayEntry'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    type: 'start'
  }

  const enzymeWrapper = shallow(
    <SpatialDisplayEntry {...props}>
      38.79165, -77.11976
    </SpatialDisplayEntry>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialDisplayEntry component', () => {
  test('with valid type and children should render correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.text()).toEqual('38.79165, -77.11976')
  })
})
