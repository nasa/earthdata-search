import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Project from '../Project'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {}

  const enzymeWrapper = shallow(<Project {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Project component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })
})
