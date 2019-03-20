import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Button from '../Button'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    text: 'Button Text',
    onClick: jest.fn()
  }

  const enzymeWrapper = shallow(<Button {...props} />)

  return {
    props,
    enzymeWrapper
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
})
