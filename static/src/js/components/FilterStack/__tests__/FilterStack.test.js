import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import FilterStack from '../FilterStack'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    children: undefined,
    isOpen: false
  }

  const enzymeWrapper = shallow(<FilterStack {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FilterStack component', () => {
  test('does not render without children', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(null)
  })

  test('renders its children', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ children: 'Hello!' })

    expect(enzymeWrapper.children().contains('Hello!'))
  })

  test('renders with the correct css when not visible', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.hasClass('filter-stack--visible')).toBe(false)
  })

  test('renders with the correct css when not visible', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ isOpen: true, children: 'Hello!' })

    expect(enzymeWrapper.hasClass('filter-stack--is-open')).toBe(true)
  })
})
