import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import ButtonDropdown from '../ButtonDropdown'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  const props = {
    onClick: jest.fn(),
    buttonLabel: 'Test Label',
    buttonContent: 'Test Button Content',
    className: 'some-test-classname'
  }

  if (type === 'badge') {
    props.badge = 'badge test'
  }

  const enzymeWrapper = mount(<ButtonDropdown {...props}>Button Text</ButtonDropdown>)

  return {
    enzymeWrapper,
    props
  }
}

describe('ButtonDropdown component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper).toBeDefined()
  })

  test('should render its contents', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('button').text()).toContain('Test Button Content')
  })

  test('update its open state when the open prop changes', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.setProps({
      open: true
    })

    expect(enzymeWrapper.state()).toEqual({ open: true })
  })

  test('update its open state onDropdownToggle is called', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.instance().onDropdownToggle()

    expect(enzymeWrapper.state()).toEqual({ open: true })
  })

  describe('icon', () => {
    test('displays correctly by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('EDSCIcon').props().icon).toEqual(FaChevronDown)
    })

    test('displays correctly when opened', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onDropdownToggle()
      enzymeWrapper.update()

      expect(enzymeWrapper.find('EDSCIcon').props().icon).toEqual(FaChevronUp)
    })
  })
})
