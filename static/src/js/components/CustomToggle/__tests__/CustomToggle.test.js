import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { FaGlobe } from 'react-icons/fa'

import CustomToggle from '../CustomToggle'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  const props = {
    className: 'test-class',
    onClick: jest.fn(),
    title: 'test-title'
  }

  if (type === 'icon') {
    props.icon = FaGlobe
  }

  const enzymeWrapper = shallow(<CustomToggle {...props}>Test</CustomToggle>)

  return {
    enzymeWrapper,
    props
  }
}

describe('CustomToggle component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('button').length).toEqual(1)
  })

  test('should render children', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('button').text()).toEqual('Test')
  })

  test('should render self with a className', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.test-class').length).toEqual(1)
  })

  test('should call onClick if the button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('button')

    button.simulate('click', {
      preventDefault: () => { }
    })
    expect(props.onClick.mock.calls.length).toBe(1)
  })

  test('should render self with an icon', () => {
    const { enzymeWrapper } = setup('icon')

    expect(enzymeWrapper.find('EDSCIcon').props().icon).toEqual(FaGlobe)
  })

  test('should render self without an icon', () => {
    const { enzymeWrapper } = setup('no-icon')

    expect(enzymeWrapper.find('EDSCIcon').length).toEqual(0)
  })
})
