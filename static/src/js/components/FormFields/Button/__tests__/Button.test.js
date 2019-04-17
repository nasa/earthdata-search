import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Button from '../Button'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onClick: jest.fn(),
    text: 'Button Text'
  }

  const enzymeWrapper = mount(<Button {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Button component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
  })

  test('should call onClick if the button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('button')

    button.simulate('click')
    expect(props.onClick.mock.calls.length).toBe(1)
  })

  test('should not render self with an icon when missing an iconClass prop', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.setProps({ buttonStyle: 'icon' })

    expect(enzymeWrapper.find('i').length).toEqual(0)
    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
  })

  test('should render self with an icon', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.setProps({
      buttonStyle: 'icon',
      iconClass: 'test'
    })

    expect(enzymeWrapper.find('button').text()).toEqual('Button Text')
    expect(enzymeWrapper.find('i').hasClass('fa fa-test'))
    expect(enzymeWrapper.find('span').hasClass('visually-hidden'))
  })
})
