import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import RadioField from '../RadioField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    schema: {
      enum: ['option1', 'option2'],
      enumNames: ['Option 1', 'Option 2'],
      description: 'Test Field Description'
    },
    name: 'testField',
    formData: 'option1',
    onChange: jest.fn()
  }

  const enzymeWrapper = shallow(<RadioField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('RadioField component', () => {
  test('renders a radio form field', () => {
    const { enzymeWrapper } = setup()

    const input1 = enzymeWrapper.find('input').first()
    const input2 = enzymeWrapper.find('input').last()

    expect(input1.props().value).toEqual('option1')
    expect(input1.props().checked).toBeTruthy()
    expect(input1.props().name).toEqual('testField')

    expect(input2.props().value).toEqual('option2')
    expect(input2.props().checked).toBeFalsy()
    expect(input2.props().name).toEqual('testField')
  })

  test('onChange sets the state', () => {
    const { enzymeWrapper } = setup()

    const input2 = enzymeWrapper.find('input').last()

    input2.props().onChange({ target: { value: 'option2' } })

    expect(enzymeWrapper.state().formData).toEqual('option2')
  })
})
