import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import TextField from '../TextField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    name: 'testName',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    value: 'Test value'
  }

  const enzymeWrapper = shallow(<TextField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TextField component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('input').prop('name')).toEqual('testName')
    expect(enzymeWrapper.find('input').prop('value')).toEqual('Test value')
  })

  test('should call onChange if value changes', () => {
    const { enzymeWrapper, props } = setup()
    const input = enzymeWrapper.find('input')

    input.simulate('change', { target: { name: 'testName', value: 'new value' } })
    expect(props.onChange.mock.calls.length).toBe(1)
    expect(props.onChange.mock.calls[0]).toEqual(['testName', 'new value'])
  })
})
