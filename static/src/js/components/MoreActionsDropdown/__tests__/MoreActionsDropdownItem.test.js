import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'

import { MoreActionsDropdownItem } from '../MoreActionsDropdownItem'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    className: 'test-class',
    icon: 'FaGlobal',
    onClick: jest.fn(),
    title: 'Test Title',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<MoreActionsDropdownItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('MoreActionsDropdownItem component', () => {
  test('renders a dropdown item', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(Dropdown.Item)
  })

  test('adds the className', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.props().className).toBe('test-class more-actions-dropdown-item')
  })

  test('adds an icon', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('EDSCIcon').type()).toBe(EDSCIcon)
  })

  test('displays the text', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.text()).toContain('Test Title')
  })

  test('calls the onClick callback', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.simulate('click')

    expect(props.onClick).toHaveBeenCalledTimes(1)
  })
})
