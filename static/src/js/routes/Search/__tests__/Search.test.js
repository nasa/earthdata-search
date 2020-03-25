import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Search } from '../Search'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    match: {},
    advancedSearch: {},
    onUpdateAdvancedSearch: jest.fn()
  }

  const enzymeWrapper = shallow(<Search {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Search component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })
})
