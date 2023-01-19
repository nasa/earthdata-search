import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { FormCheck } from 'react-bootstrap'

import PreferencesRadioField from '../PreferencesRadioField'

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

  const enzymeWrapper = shallow(<PreferencesRadioField {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('PreferencesRadioField component', () => {
  test('renders a radio form field', () => {
    const { enzymeWrapper } = setup()

    const input1 = enzymeWrapper.find(FormCheck).first()
    const input2 = enzymeWrapper.find(FormCheck).last()

    expect(input1.props().value).toEqual('option1')
    expect(input1.props().checked).toBeTruthy()
    expect(input1.props().name).toEqual('testField')

    expect(input2.props().value).toEqual('option2')
    expect(input2.props().checked).toBeFalsy()
    expect(input2.props().name).toEqual('testField')
  })

  test('onChange sets the state', () => {
    const { enzymeWrapper } = setup()

    const input2 = enzymeWrapper.find(FormCheck).last()

    input2.props().onChange({ target: { value: 'option2' } })

    expect(enzymeWrapper.state().formData).toEqual('option2')
  })
})
