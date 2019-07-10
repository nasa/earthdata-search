import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import FilterStackItem from '../FilterStackItem'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    children: 'Hello!',
    icon: 'test',
    title: 'Test'
  }

  const enzymeWrapper = shallow(<FilterStackItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FilterStackItem component', () => {
  test('renders itself as a list item', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('li')
    expect(enzymeWrapper.hasClass('filter-stack-item')).toBe(true)
  })

  test('renders an icon', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('i').hasClass('fa fa-test filter-stack-item__icon')).toBe(true)
  })

  test('renders a hidden title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('h3').hasClass('filter-stack-item__title visibility-hidden')).toBe(true)
  })

  test('renders its body contents correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.filter-stack-item__body-contents').at(0).text()).toBe('Hello!')
  })
})
