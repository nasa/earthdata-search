import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import SidebarFiltersItem from '../SidebarFiltersItem'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: <div className="test-child" />,
    description: 'Test description',
    heading: <div className="test-heading" />,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SidebarFiltersItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SidebarFiltersItem component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('li')
  })

  test('renders its children correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.sidebar-filters-item__body').children(0).prop('className')).toBe('test-child')
  })

  test('renders its heading correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.sidebar-filters-item__heading').children(0).prop('className')).toBe('test-heading')
  })

  describe('Description', () => {
    test('does not render when null', () => {
      const { enzymeWrapper } = setup({
        description: null
      })

      expect(enzymeWrapper.find('.sidebar-filters-item__description').length).toEqual(0)
    })

    test('renders correctly when defined', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.sidebar-filters-item__description').text()).toEqual('Test description')
    })
  })
})
