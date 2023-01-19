import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import FilterStackItem from '../FilterStackItem'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: 'Hello!',
    icon: 'test',
    title: 'Test',
    ...overrideProps
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

    expect(enzymeWrapper.find('EDSCIcon').hasClass('filter-stack-item__icon')).toBe(true)
  })

  test('renders a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('h3').hasClass('filter-stack-item__title')).toBe(true)
  })

  test('renders a secondary title', () => {
    const { enzymeWrapper } = setup({
      secondaryTitle: 'Secondary Title'
    })

    expect(enzymeWrapper.find('.filter-stack-item__secondary-title').length).toBe(1)
  })

  test('renders its body contents correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.filter-stack-item__body-contents').at(0).text()).toBe('Hello!')
  })
})
